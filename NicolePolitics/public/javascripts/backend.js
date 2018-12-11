"use strict";
exports.__esModule = true;
var pwd = '.';
var queries = require(pwd + '/queries.js').queries;
var PollModels = Object.freeze({ "lite": 1, "classic": 2, "deluxe": 3 });
var Backend = /** @class */ (function () {
    function Backend() {
        //TODO: init connection to SQL DB
        //TODO: init connection to Mongo DB
    }
    Backend.get_query_info = function (query_name) {
        return ("\n\t\tQuery: " + query_name + "\n\t\tInputs : " + queries[query_name]['input_names'] + "\n\t\tDescription : " + queries[query_name]['description']);
    };
    // returns whether connection is live
    Backend.prototype.isConnected = function () {
        return true;
    };
    Backend.prototype.get_least_likely_member_of_committee_to_win_reelection = function (cid, poll_model) { };
    Backend.prototype.get_member_of_committee_in_closest_race = function (cid, poll_model) { };
    Backend.prototype.get_candidates_in_district = function (state, district) { };
    Backend.prototype.get_info_for_member = function (state, district) { };
    Backend.prototype.get_all_committees = function () { };
    Backend.prototype.get_all_subcomittees_on_committee = function (cid) {
        console.log("Running the get sub query w/" + cid);
    };
    Backend.prototype.get_all_members_on_committee = function (cid) { };
    Backend.prototype.get_all_members_up_for_reelection_on_committee = function (cid) { };
    Backend.prototype.get_all_races_within = function (num_percentage_points, poll_model) { };
    Backend.prototype.get_num_districts_in_state = function (state) { };
    Backend.prototype.get_member_from_district = function (state, district) { };
    return Backend;
}());
exports.Backend = Backend;
/* module.exports = {
    Backend: Backend,
    PollModels : PollModels,
} */
console.log(Backend.get_query_info("get_all_races_within"));
