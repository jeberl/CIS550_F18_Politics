var express = require('express');
var router = express.Router();
var path = require('path');

// Connect string to mysql - UNCOMMENT ABOVE TO CONNECT TO ORACLE
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'cis550project.cf6ohcdz76sh.us-east-2.rds.amazonaws.com',
  user     : 'cis550project',
  password : 'cis550project',
  database : 'Politics'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

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
  var query = 'SELECT DISTINCT committee_id FROM CommitteeAssignment ORDER BY committee_id ASC';
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
      else {
        res.json(rows);
      };
    });
});

// Route hanlder for getting all subcommittees for a specific committee
router.post('/SubCommitteeData/:committeeDrop', function(req, res) {
  console.log(req.params.committeeDrop);
  var query = 'SELECT DISTINCT subcommittee FROM CommitteeAssignment WHERE committee_id = \''
              +req.params.committeeDrop+'\' ORDER BY subcommittee ASC';
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
      else {
        console.log('Executed Query!');
        res.json(rows);
      };
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
	connection.query(query, function(err, rows, fields) {
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
  connection.query(query, function(err, rows, fields) {
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
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
     else {
      res.json(rows);
    }}
    );
});

// Route handler for getting all states
router.get('/stateDropDown', function(req, res) {
  var query = 'SELECT DISTINCT state FROM Member ORDER BY state ASC';
  connection.query(query, function(err, rows, fields) {
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
  connection.query(query, function(err, rows, fields) {
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
  connection.query(query, function(err, rows, fields) {
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



module.exports = router;