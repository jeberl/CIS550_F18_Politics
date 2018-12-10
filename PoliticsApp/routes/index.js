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

// Add new page for tight race watch
router.get('/tight', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'tight.html'));
});

// Add new page for Contacting your reps
router.get('/contact', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../', 'views', 'candidate.html'));
});

// Add new page for getting information on committees
router.get('/committee', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../', 'views', 'committee.html'));
})

router.get('/data/:email', function(req,res) {
  var query;
  if (req.params.email === 'undefined') {
  	// If email is null, show all people.
  	query = 'SELECT * FROM Person';
  } else {
  	// If email provided, return the person with that email.
  	query = 'SELECT * FROM Person P WHERE P.login = \'' + req.params.email + '\'';
  }
  // note that email parameter in the request can be accessed using "req.params.email"
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }  
    });
});

// Route handler for member of committee in closest race
router.post('/closestCommitteeData/:comcode/:subcomcode', function(req, res) {
	// TODO remove dependency on PollLite
	var comcode = req.params.comcode;
	var subcomcode = req.params.subcomcode;
  if (typeof subcomcode === 'undefined') {
    subcomcode = '00';
  }
	console.log("closest race --> comcode = " + comcode);
	var query = 'SELECT DISTINCT m.firstname, m.lastname, p.win_probability as winProbability FROM'+
              '(SELECT * FROM CommitteeAssignment WHERE committee_id = \''+comcode+'\') '+
              'ca JOIN Member m ON ca.state = m.state AND ca.district = m.district JOIN '+
              'PollLite p ON m.state = p.state AND m.district = p.district WHERE '+
              'p.is_incumbent = 1 AND p.win_probability + 50 = '+
              '(SELECT MIN(ABS(p.win_probability - 50)) FROM (SELECT * FROM '+
              'CommitteeAssignment WHERE committee_id = \''+comcode+'\') ca JOIN Member m '+
              'ON ca.state = m.state AND ca.district = m.district JOIN PollLite p ON '+
              'm.state = p.state AND m.district = p.district) OR p.win_probability - 50 = '+
              '(SELECT MIN(ABS(p.win_probability - 50)) FROM (SELECT * FROM CommitteeAssignment '+
              'WHERE committee_id = \''+comcode+'\') ca JOIN Member m ON ca.state = m.state AND '+
              'ca.district = m.district JOIN PollLite p ON m.state = p.state AND '+
              'm.district = p.district)';
	connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log("Success running query!");
        res.json(rows);
    }
    });
});

// Route handler for member of committee least likely to win re-election
router.post('/leastLikelyData/:comcode/:subcomcode', function(req, res) {
  // TODO remove dependency on PollLite
  var comcode = req.params.comcode;
  var subcomcode = req.params.subcomcode;
  if (typeof subcomcode === 'undefined') {
    subcomcode = '00';
  }
  console.log("least likely --> comcode = " + comcode);
  var query = 'SELECT DISTINCT m.firstname, m.lastname, p.state, p.district '+
              'FROM (SELECT * FROM CommitteeAssignment WHERE committee_id = \''
              +comcode+'\') ca JOIN Member m ON ca.state = m.state AND ca.district'+
              ' = m.district JOIN PollLite p ON m.state = p.state AND m.district = '+
              'p.district WHERE p.win_probability = (SELECT MIN(p.win_probability) '+
              'FROM (SELECT * FROM CommitteeAssignment WHERE committee_id = \''
              +comcode+'\') ca JOIN Member m ON ca.state = m.state AND ca.district ='+
              ' m.district JOIN PollLite p ON m.state = p.state AND m.district = '+
              'p.district WHERE p.is_incumbent = 1)';
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log("Success running query!");
        res.json(rows);
    }
    });
});

// Route handler for all members of committee given committee codes
router.post('/allMemberOnComData/:comcode/:subcomcode', function(req, res) {
  var comcode = req.params.comcode;
  var subcomcode = req.params.subcomcode;
  if (typeof subcomcode === 'undefined') {
    subcomcode = '00';
  }
  console.log("all members on committee --> comcode = " + comcode);
  var query = 'SELECT DISTINCT m.firstname, m.lastname, m.state, m.district '+
              'FROM Member m JOIN CommitteeAssignment ca ON m.district = ca.district '+
              'AND m.state = ca.state WHERE ca.committee_id = \''+comcode+'\'';
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log("Success running query!");
        res.json(rows);
    }
    });
});

// Route handler for "Who's Running"
router.get('/runningData/:state/:district', function(req,res) {
  // TODO add drop down for Poll type - currently, just PollLite
  console.log("state = " + req.params.state);
  console.log("district = " + req.params.district);
  // Uncomment below when establish Oracle connection
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

// Route handler for Family drop down
router.get('/familyDropDown', function(req,res) {
	var query = 'SELECT DISTINCT login FROM Family';
	connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }  
    });
});

// Route handler for "Show Family"
router.get('/familyData/:familyLogin', function(req,res) {
	var login = req.params.familyLogin;
	var query = 'SELECT Fa.member as login, P.name, P.sex, P.RelationshipStatus, P.Birthyear ' +
              'FROM Family Fa JOIN Person P ON Fa.member = P.login WHERE Fa.login = \'' + login + '\'';
	connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }  
    });
});


module.exports = router;