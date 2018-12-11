"use strict";
exports.__esModule = true;
var queries = {
    get_least_likely_member_of_committee_to_win_reelection: {
        type: "SQL",
        input_names: ["cid", "poll_model"],
        description: "Given a committee with id, %1, \n\t\t\treturn the first and last name of the member \n\t\t\tof the committee least likely to retain her \n\t\t\tseat given that she is up for reelection using \n\t\t\tpolling model %2. NOTE: some committee members \n\t\t\tmay not be seeking another term, these will not\n\t\t\tbe included.",
        query: "SELECT m.firstname, m.lastname, p.district, p.state\n\t\t\tFROM ((\n\t\t\tSELECT * FROM CommitteeAssignments\n\t\t\tWHERE committee_id = %1\n\t\t\t) \n\t\t\tJOIN Members m \n\t\t\tJOIN %2 p ON \n\t\t\tm.state = p.state AND\n\t\t\tm.district = p.district AND\n\t\t\tm.firstname = p.candidate_first AND\n\t\t\tm.lastname = p.candidate_last ) t\n\t\t\tWHERE p.win_probability = (\n\t\t\t\tSELECT MIN(t.p.win_probability)\n\t\t\t\tFROM t\n\t\t\t);"
    },
    get_member_of_committee_in_closest_race: {
        type: 'SQL',
        input_names: ['cid', 'poll_model'],
        description: "Given a committee with id, %1, return the first and last name of the member of the committee in the closest reelection bid, that is who’s win probability is closest to 50% using polling model %2",
        query: "\n\t\t\tSELECT *\n\t\t\tFROM (\n\t\t\t\t(\n\t\t\t\t\tSELECT * FROM CommitteeAssignments\n\t\t\t\t\tWHERE committee_id = %1\n\t\t\t\t) \n\t\t\t\tJOIN Members m \n\t\t\t\tJOIN %2 p ON \n\t\t\t\tm.state = p.state AND\n\t\t\t\tm.district = p.district AND\n\t\t\t\tm.firstname = p.candidate_first AND\n\t\t\t\tm.lastname = p.candidate_last ) t\n\t\t\tWHERE p.win_probability = (\n\t\t\t\tSELECT MIN(ABS(t.p.win_probability - 50))\n\t\t\t\tFROM t\n\t\t\t);"
    },
    get_candidates_in_district: {
        type: 'SQL',
        input_names: ['state', 'district'],
        description: "Given a state,  %1, and district, %2, return the list of candidates running in the upcoming election, their party and probability of winning ",
        query: "\n\t\t\tSELECT candidate_first, candidate_last, party,\n\t\t\t\tWin_probability, incumbent\n\t\t\tFROM PollLite p\n\t\t\tWHERE p.state = %1 AND p.district = %2;"
    },
    get_info_for_member: {
        type: 'SQL',
        input_names: ['state', 'district'],
        description: "Given a state, %1, and district, %2, return all the information about the member from that district",
        query: "\n\t\t\tSELECT *\n\t\t\tFROM Members\n\t\t\tWHERE Members.state = %1 AND Members.district = %2;"
    },
    get_all_committees: {
        type: 'mongo',
        input_names: [],
        descripion: 'Return a list of all committees with their id and name',
        query: "\n\t\t\tdb.committees.find(\n\t\t\t\t{},\n\t\t\t\t{committee_id : 1, full_committee_name : 1, _id : 0}\n\t\t\t);"
    },
    get_all_subcomittees_on_committee: {
        type: 'mongo',
        input_names: ['cid'],
        descripion: "Given a committee with id, %1,return name and id for all subcommittees under that committee",
        query: "\n\t\t\tdb.committees.find(\n\t\t\t\t{committee_code : %1},\n\t\t\t\t{\u201Csubcommittee.subcommittee_code\u201D : 1,\n \t\t\t\t\t\u201CSubcommittee.full_subcommittee_name\u201D : 1,\n\t\t\t\t\t_id : 0 }\n\t\t\t);"
    },
    get_all_members_on_committee: {
        type: 'SQL',
        input_names: ['cid'],
        description: "Given a committee with id, %1,return the district, state,  first and last name of all members of that committee",
        query: "\n\t\t\tSELECT m.firstname, m.lastname, p.district, p.state\n\t\t\tFROM (\n\t\t\t\t(SELECT * FROM CommitteeAssignments\n\t\t\t\tWHERE committee_id = %1\n\t\t\t\t) \n\t\t\t\tJOIN Members m \n\t\t\t\tJOIN PollLite p ON \n\t\t\t\t\tm.state = p.state AND\n\t\t\t\tm.district = p.district AND\n\t\t\t\tm.firstname = p.candidate_first AND\n\t\t\t\tm.lastname = p.candidate_last ) t;"
    },
    get_all_members_up_for_reelection_on_committee: {
        type: 'SQL',
        input_names: ['cid'],
        description: "Given a committee with id, %1 return the district, state, first and last name of all members of that committee who are in a contested election, that is they are running for reelection and have at least 1 opponent or their win percentage is less than 100",
        query: "\n\t\t\tSELECT m.firstname, m.lastname, p.district, p.state\n\t\t\tFROM ((\n\t\t\t\tSELECT * FROM CommitteeAssignments\n\t\t\t\tWHERE committee_id = %1\n\t\t\t) \n\t\t\t\tJOIN Members m \n\t\t\t\tJOIN PollLite p ON \n\t\t\t\t\tm.state = p.state AND\n\t\t\t\t\tm.district = p.district AND\n\t\t\t\t\tm.firstname = p.candidate_first AND\n\t\t\t\t\tm.lastname = p.candidate_last ) t\n\t\t\tWHERE p.win_probability < 100;"
    },
    get_all_races_within: {
        type: 'SQL',
        input_names: ['num_percentage_points', 'poll_model'],
        description: "Given a number of percentage points, %1, return state, district, lead candidate first name, lead candidate last name, lead candidate win probability, trailing candidate first name, trailing candidate last name, and trailing candidate win probability, for every race where the leading candidate is %1 percentage points or fewer ahead of the trailing candidate using polling model %2",
        query: "\n\t\t\tSELECT DISTINCT c1.state AS state, \n\t\t\t\tc1.district AS district, \n\t\t\t\tc1.candidate_first AS lead_first,\n\t\t\t\tc1.candidate_last AS lead_last, \n\t\t\t\tc1.win_probability AS lead_win_prob, \n\t\t\t\tc2.candidate_first AS trail_first, \n\t\t\t\tc2.candidate_last AS trail_last,\n\t\t\t\tc2.win_probability AS trail_win_prob\n\t\t\tFROM %2 c1 \n\t\t\t\tJOIN %2 c2 \n\t\t\t\tON c1.state = c2.state AND c1.district = c2.district\n\t\t\tWHERE c1.win_probability >= c2.win_probability AND\n\t\t\t\tC1.win_probability <= c2.win_probability + %1;"
    },
    get_num_districts_in_state: {
        type: 'SQL',
        input_names: ['state'],
        description: "Given a state, %1, return the number of congressional districts in that state",
        query: "\n\t\t\tSELECT MAX(district)\n\t\t\tFROM PollLite\n\t\t\tWHERE state == \u2018%1\u2019"
    },
    get_member_from_district: {
        type: 'SQL',
        input_names: ['state', 'district'],
        description: "Given a state, %1, and district %2, return the name of the current incumbent member from that state",
        query: "\n\t\t\tSELECT firstname, lastname\n\t\t\tFROM Member\n\t\t\tWHERE state == \u2018%1\u2019 AND district == %2"
    }
};
exports["default"] = queries;
