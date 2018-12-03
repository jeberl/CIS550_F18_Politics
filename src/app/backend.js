const pwd = '/Users/Jesse/Desktop/UPenn/2018_F/Databases/CIS550_F18_Politics/src/app'

const queries = require(pwd + '/queries.js').queries;

var PollModels = Object.freeze({"lite":1, "classic":2, "deluxe":3});

class Backend {
	
	constructor() {
		//TODO: init connection to SQL DB
		//TODO: init connection to Mongo DB
	}

	static get_query_info(query_name) {
		return(`
		Query: ${query_name}
		Inputs : ${queries[query_name]['input_names']}
		Description : ${queries[query_name]['description']}`)
	}

	// returns whether connection is live
	isConnected() {
		return true;
	}

	get_least_likely_member_of_committee_to_win_reelection(cid, poll_model) {}
	get_member_of_committee_in_closest_race(cid, poll_model) {}
	get_candidates_in_district(state, district) {}
	get_info_for_member(state, district) {}
	get_all_committees() {}
	get_all_subcomittees_on_committee(cid) {}
	get_all_members_on_committee(cid) {}
	get_all_members_up_for_reelection_on_committee(cid) {}
	get_all_races_within(num_percentage_points, poll_model) {}
	get_num_districts_in_state(state) {}
	get_member_from_district(state, district) {}
}

module.exports = {
	Backend: Backend,
	PollModels : PollModels,
};

b = new Backend();
console.log(Backend.get_query_info("get_all_races_within"));