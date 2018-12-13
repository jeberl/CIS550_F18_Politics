
var mysql = require('mysql');
var AWS = require('aws-sdk');
const queries = require('../javascripts/queries');

const PollModels = Object.freeze({"lite":1, "classic":2, "deluxe":3});

class Backend {

    var dynamo = undefined;
    var mysql_connection = undefined;

    constructor() {
        //MySQL Set Up
        mysql_connection = mysql.createConnection({
          host     : 'cis550project.cf6ohcdz76sh.us-east-2.rds.amazonaws.com',
          user     : 'cis550project',
          password : 'cis550project',
          database : 'Politics'
        });

        mysql_connection.connect(function(err) {
          if (err) {
            console.log("Could not connect to MySQL. \nAborting...")
            //throw err;
          }
          console.log("Connected!");
        });
        //MySQL Set Up
        dynamo = new AWS.DynamoDB({region: "us-west-2"});
    }

    static get_query_info(query_name) {
        return(`
        Query: ${query_name}
        Inputs : ${queries[query_name]['input_names']}
        Description : ${queries[query_name]['description']}`)
    }

    get_least_likely_member_of_committee_to_win_reelection(cid, poll_model) {}
    get_member_of_committee_in_closest_race(cid, poll_model) {}
    get_candidates_in_district(state, district) {}
    get_info_for_member(state, district) {}
    get_all_committees() {}
    get_all_subcomittees_on_committee(cid) {
        console.log("Running the get sub query w/" + cid);
    }
    get_all_members_on_committee(cid) {}
    get_all_members_up_for_reelection_on_committee(cid) {}
    get_all_races_within(num_percentage_points, poll_model) {}
    get_num_districts_in_state(state) {}
    get_member_from_district(state, district) {}

}

module.exports = {
    Backend: Backend,
    PollModels : PollModels,
}  
