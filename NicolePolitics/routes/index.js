var express = require('express');
var router = express.Router();
var path = require('path');

// const back = require('../public/javascripts/backend');
// const Backend = new back.Backend();

var mysql = require('mysql');
var AWS = require('aws-sdk');

//MySQL Set Up
const mysql_connection = mysql.createConnection({
  host     : 'cis550project.cf6ohcdz76sh.us-east-2.rds.amazonaws.com',
  user     : 'cis550project',
  password : 'cis550project',
  database : 'Politics'
});

mysql_connection.connect(function(err) {
  if (err) {
    console.log("Could not connect to MySQL. \nAborting...")
    throw err;
  }
  console.log("Connected!");
});

//DynamoDB Set Up
const dynamo = new AWS.DynamoDB({region: "us-west-2"});
const dynamo_table = "Committees2";


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

// Add a new page for who's running
router.get('/run', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'run.html'));
});

// Add a new page for who's running
router.get('/navbar', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'navbar.html'));
});

// Add new page for tight race watch
router.get('/tight', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'tight.html'));
});

// Add new page for getting information on committees
router.get('/committee', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../', 'views', 'committee.html'));
})

// Add new page for getting num reps by state
router.get('/numreps', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'numreps.html'));
})

// Add some assets
router.get('/1.png', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'assets', '1.png'));
})
router.get('/2.png', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'assets', '2.png'));
})
router.get('/3.png', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'assets', '3.png'));
})

// Route handler for getting all committees
router.get('/committeeDropDown', function(req, res) {

  const params = {
      TableName: dynamo_table,
      AttributesToGet: ['committee_id', 'full_committee_name']
  };

  dynamo.scan(params, function(err, data) {
    if (err) {
      console.log("Unable to connect to Dynamo. Attempting to get committees using MySQL");
      var query = 'SELECT DISTINCT committee_id FROM CommitteeAssignment ORDER BY committee_id ASC';
      mysql_connection.query(query, function(err, rows, fields) {
        if (err) console.log(err);
        else {
          console.log(rows);
          res.json(rows);
        };
        });
    } else {
      const new_data = data.Items.map(function(x) {
        return {"committee_id": x.committee_id.S, "full_committee_name": x.full_committee_name.M.S.S};
      });
      res.json(new_data)
    }
  });

});

// Route hanlder for getting all subcommittees for a specific committee
router.post('/SubCommitteeData/:committeeDrop', function(req, res) {
  const cid = req.params.committeeDrop

  const params = {
      TableName: dynamo_table,
      Key:{
        "committee_id": {
          S: cid
        }
      },
      ProjectionExpression: "subcomittees"
  };
  
  dynamo.getItem(params, function(err, data) {
    if (err) {
      console.log("err: " + "\n" + JSON.stringify(err, undefined, 2));
      console.log("Unable to connect to Dynamo. Attempting to get committees using MySQL");
      var query = 'SELECT DISTINCT subcommittee FROM CommitteeAssignment WHERE committee_id = \''
              +cid.substring(0,2)+'\' ORDER BY subcommittee ASC';
      mysql_connection.query(query, function(err, rows, fields) {
        if (err) console.log(err);
        else {
          console.log(rows);
          res.json(rows);
        };
      });
    } else {
      const sub_coms = data.Item.subcomittees.M.L.L;
      var new_data = sub_coms.map(function(x) {
        return {"subcommittee_id": x.M.subcommittee_code.M.S.S, "full_subcommittee_name": x.M.full_subcommittee_name.M.S.S};
      });

      if (new_data[0] == undefined) {
        new_data = [{"full_subcommittee_name": "No Subcomittees"}];
      }
      console.log("data: " + "\n" + JSON.stringify(new_data, undefined, 2));
      res.json(new_data);
    }
  });
});

// Route handler for member of committee in closest race
router.post('/closestCommitteeData/:comcode/:subcomcode/:pollModel', function(req, res) {
	var comcode = req.params.comcode;
	var subcomcode = req.params.subcomcode;
  var pollModel = req.params.pollModel;
  console.log("pollModel = " + pollModel);
  if (subcomcode === 'undefined') {
    console.log("sub is 0");
    subcomcode = '00';
  }
	var query = 'SELECT DISTINCT m.firstname, m.lastname, p.win_probability as winProbability FROM'+
              '(SELECT * FROM CommitteeAssignment WHERE committee_id = \''+comcode+'\' AND subcommittee = \''+subcomcode+'\') '+
              'ca JOIN Member m ON ca.state = m.state AND ca.district = m.district JOIN '+pollModel+
              ' p ON m.state = p.state AND m.district = p.district WHERE '+
              'p.is_incumbent = 1 AND p.win_probability + 50 = '+
              '(SELECT MIN(ABS(p.win_probability - 50)) FROM (SELECT * FROM '+
              'CommitteeAssignment WHERE committee_id = \''+comcode+'\' AND subcommittee = \''+subcomcode+'\') ca JOIN Member m '+
              'ON ca.state = m.state AND ca.district = m.district JOIN '+pollModel+' p ON '+
              'm.state = p.state AND m.district = p.district) OR p.win_probability - 50 = '+
              '(SELECT MIN(ABS(p.win_probability - 50)) FROM (SELECT * FROM CommitteeAssignment '+
              'WHERE committee_id = \''+comcode+'\' AND subcommittee = \''+subcomcode+'\') ca JOIN Member m ON ca.state = m.state AND '+
              'ca.district = m.district JOIN '+pollModel+' p ON m.state = p.state AND '+
              'm.district = p.district)';
	mysql_connection.query(query, function(err, rows, fields) {
    if (err) console.log(err)
      else {
        res.json(rows);
      };
    });
});

// Route handler for member of committee least likely to win re-election
router.post('/leastLikelyData/:comcode/:subcomcode/:pollModel', function(req, res) {
  var comcode = req.params.comcode;
  var subcomcode = req.params.subcomcode;
  var pollModel = req.params.pollModel;
  if (subcomcode === 'undefined') {
    console.log("sub is 0");
    subcomcode = '00';
  }
  console.log("least likely --> comcode = " + comcode);
  var query = 'SELECT DISTINCT m.firstname, m.lastname, p.state, p.district '+
              'FROM (SELECT * FROM CommitteeAssignment WHERE committee_id = \''
              +comcode+'\' AND subcommittee = \''+subcomcode+'\') ca JOIN Member m ON ca.state = m.state AND ca.district'+
              ' = m.district JOIN '+pollModel+' p ON m.state = p.state AND m.district = '+
              'p.district WHERE p.win_probability = (SELECT MIN(p.win_probability) '+
              'FROM (SELECT * FROM CommitteeAssignment WHERE committee_id = \''
              +comcode+'\' AND subcommittee = \''+subcomcode+'\') ca JOIN Member m ON ca.state = m.state AND ca.district ='+
              ' m.district JOIN '+pollModel+' p ON m.state = p.state AND m.district = '+
              'p.district WHERE p.is_incumbent = 1)';
  mysql_connection.query(query, function(err, rows, fields) {
    if (err) console.log(err); else {
      res.json(rows);
    }});
});

// Route handler for all members of committee given committee codes
router.post('/allMemberOnComData/:comcode/:subcomcode', function(req, res) {
  var comcode = req.params.comcode;
  var subcomcode = req.params.subcomcode;
  if (subcomcode === 'undefined') {
    subcomcode = '00';
    console.log("sub is 0");
  }
  var query = 'SELECT DISTINCT m.firstname, m.lastname, m.state, m.district, m.phone '+
              'FROM Member m JOIN CommitteeAssignment ca ON m.district = ca.district '+
              'AND m.state = ca.state WHERE ca.committee_id = \''+comcode+'\' AND subcommittee = \''+subcomcode+'\'';
  mysql_connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
     else {
      res.json(rows);
    }}
    );
});

// Route handler for getting all states
router.get('/stateDropDown', function(req, res) {
  var query = 'SELECT DISTINCT state FROM Member ORDER BY state ASC';
  mysql_connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
      else {
        res.json(rows);
      };
    });
});

// Route hanlder for getting all disticts for a specific state
router.post('/districtData/:stateDrop', function(req, res) {
  console.log(req.params.stateDrop);
  var query = 'SELECT DISTINCT district FROM Member WHERE state = \''
              +req.params.stateDrop+'\' ORDER BY state ASC';
  mysql_connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
      else {
        console.log('Executed Query!');
        res.json(rows);
      };
    });
});

// Route handler for "Who's Running"
router.get('/runningData/:state/:district', function(req,res) {
  console.log("state = " + req.params.state);
  console.log("district = " + req.params.district);
  var query = 'SELECT candidate_first as firstname, candidate_last as lastname, party, ' + 
              'win_probability as winProbability, is_incumbent as isIncumbent FROM ' +
              'PollLite WHERE state = \''+req.params.state+'\'AND district = \''
              +req.params.district+'\''
  mysql_connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log("Success running query!");
        res.json(rows);
    }  
    });
});

// Route handler for "Tight Race"
router.get('/tightData/:threshold/:pollModel', function(req,res) {
  var threshold =  req.params.threshold;
  var pollModel = req.params.pollModel;
  var query = 'SELECT DISTINCT p1.state, p1.district, p1.candidate_first as '+
              'leadFirstname, p1.candidate_last as leadLastname, p1.win_probability as '+
              'leadWinProbability, p2.candidate_first as behindFirstname, p2.candidate_last '+
              'as behindLastname, p2.win_probability as behindWinProbability FROM '+pollModel+
              ' p1 JOIN '+pollModel+' p2 ON p1.state = p2.state AND p1.district = p2.district '+
              'WHERE abs(p1.win_probability - p2.win_probability) <= '+threshold+
              ' and p1.win_probability >= '+threshold+' and p1.candidate_last > p2.candidate_last';
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log("Success running query!");
        res.json(rows);
    }  
    });
});

// Route handler for "Number of Reps per state"
router.get('/repData', function(req,res) {
  var query = 'SELECT state, COUNT(*) AS numReps FROM Member GROUP BY state ASC';
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log("Success running query!");
        res.json(rows);
    }  
    });
});



module.exports = router;
