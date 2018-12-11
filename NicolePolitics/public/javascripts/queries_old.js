// let queries = {
// 	get_least_likely_member_of_committee_to_win_reelection : {
// 		type: "SQL",
// 		input_names : ["cid", "poll_model"],
// 		description : `Given a committee with id, %1, 
// 			return the first and last name of the member 
// 			of the committee least likely to retain her 
// 			seat given that she is up for reelection using 
// 			polling model %2. NOTE: some committee members 
// 			may not be seeking another term, these will not
// 			be included.`,
// 		query : 
// 			`SELECT DISTINCT m.firstname, m.lastname, p.district, p.state
// 			FROM (SELECT * FROM CommitteeAssignment
// 			WHERE committee_id = %1) ca
// 			JOIN Member m ON ca.state = m.state AND ca.district = m.district
// 			JOIN %2 p ON 
// 			m.state = p.state AND
// 			m.district = p.district
// 			WHERE p.win_probability = (
// 				SELECT MIN(p.win_probability)
// 				FROM (SELECT * FROM CommitteeAssignment
// 				WHERE committee_id = %1) ca
// 				JOIN Member m ON ca.state = m.state AND ca.district = m.district
// 				JOIN %2 p ON 
// 				m.state = p.state AND
// 				m.district = p.district
// 				WHERE p.is_incumbent = 1
// 			);`
// 	},
// 	get_member_of_committee_in_closest_race : {
// 		type: 'SQL',
// 		input_names: ['cid', 'poll_model'],
// 		description : "Given a committee with id, %1, return the first and last name of the member of the committee in the closest reelection bid, that is who’s win probability is closest to 50% using polling model %2",
// 		query : `
// 			SELECT DISTINCT m.firstname, m.lastname, p.win_probability
// 			FROM (SELECT * FROM CommitteeAssignment
// 			WHERE committee_id = %1) ca
// 			JOIN Member m ON ca.state = m.state AND ca.district = 
// 			m.district JOIN %2 p ON m.state = p.state AND 
// 			m.district = p.district
// 			WHERE p.is_incumbent = 1 AND p.win_probability + 50 = (
// 				SELECT MIN(ABS(p.win_probability - 50))
// 				FROM (SELECT * FROM CommitteeAssignment
// 				WHERE committee_id = %1) ca
// 				JOIN Member m ON ca.state = m.state AND ca.district = 
// 				m.district JOIN %2 p ON m.state = p.state AND 
// 				m.district = p.district) OR
// 				P.win_probability - 50 = (
// 				SELECT MIN(ABS(p.win_probability - 50))
// 				FROM (SELECT * FROM CommitteeAssignment
// 				WHERE committee_id = %1) ca
// 				JOIN Member m ON ca.state = m.state AND ca.district = 
// 				m.district JOIN %2 p ON m.state = p.state AND 
// 				m.district = p.district);`
// 	},
// 	get_candidates_in_district : {
// 		type: 'SQL',
// 		input_names: ['state', 'district'],
// 		description: `Given a state,  %1, and district, %2, return the list of candidates running in the upcoming election, their party and probability of winning `,
// 		query: `
// 			SELECT candidate_first, candidate_last, party,
// 			win_probability, is_incumbent
// 			FROM PollLite p
// 			WHERE p.state = %1 AND p.district = %2;`
// 	},
// 	get_info_for_member : {
// 		type: 'SQL',
// 		input_names: ['state', 'district'],
// 		description: `Given a state, %1, and district, %2, return all the information about the member from that district`,
// 		query: `
// 			SELECT *
// 			FROM Members
// 			WHERE Members.state = %1 AND Members.district = %2;`
// 	},
// 	get_all_committees : {
// 		type: 'mongo',
// 		input_names: [],
// 		descripion: 'Return a list of all committees with their id and name',
// 		query: `
// 			db.committees.find(
// 				{},
// 				{committee_id : 1, full_committee_name : 1, _id : 0}
// 			);`
// 	},
// 	get_all_subcomittees_on_committee : {
// 		type: 'mongo',
// 		input_names: ['cid'],
// 		descripion: `Given a committee with id, %1,return name and id for all subcommittees under that committee`,
// 		query: `
// 			db.committees.find(
// 				{committee_code : %1},
// 				{“subcommittee.subcommittee_code” : 1,
//  					“Subcommittee.full_subcommittee_name” : 1,
// 					_id : 0 }
// 			);`
// 	},
// 	get_all_members_on_committee: {
// 		type: 'SQL',
// 		input_names: ['cid'],
// 		description: `Given a committee with id, %1,return the district, state,  first and last name of all members of that committee`,
// 		query : `
// 			SELECT DISTINCT m.firstname, m.lastname, m.district, m.state
// 			FROM Member m JOIN CommitteeAssignment ca ON m.district = ca.district AND m.state = ca.state
// 			WHERE ca.committee_id = %1;`
// 	},
// 	get_all_members_up_for_reelection_on_committee: {
// 		type: 'SQL',
// 		input_names: ['cid'],
// 		description: `Given a committee with id, %1 return the district, state, first and last name of all members of that committee who are in a contested election, that is they are running for reelection and have at least 1 opponent or their win percentage is less than 100`,
// 		query : `
// 			SELECT DISTINCT m.firstname, m.lastname, p.district, p.state
// 			FROM (SELECT * FROM CommitteeAssignment
// 			WHERE committee_id = %1) ca
// 			JOIN Members m ON m.state = ca.state AND m.district = ca.district
// 			JOIN PollLite p ON m.state = p.state AND m.district = p.district 
// 			WHERE p.win_probability < 100 AND p.is_incumbent = 1;`
// 	},
// 	get_all_races_within: {
// 		type: 'SQL',
// 		input_names: ['num_percentage_points', 'poll_model'],
// 		description: `Given a number of percentage points, %1, return state, district, lead candidate first name, lead candidate last name, lead candidate win probability, trailing candidate first name, trailing candidate last name, and trailing candidate win probability, for every race where the leading candidate is %1 percentage points or fewer ahead of the trailing candidate using polling model %2`,
// 		query : `
// 			SELECT DISTINCT c1.state AS state, 
// 				c1.district AS district, 
// 				c1.candidate_first AS lead_first,
// 				c1.candidate_last AS lead_last, 
// 				c1.win_probability AS lead_win_prob, 
// 				c2.candidate_first AS trail_first, 
// 				c2.candidate_last AS trail_last,
// 				c2.win_probability AS trail_win_prob
// 			FROM %2 c1 
// 				JOIN %2 c2 
// 				ON c1.state = c2.state AND c1.district = c2.district
// 			WHERE c1.win_probability >= c2.win_probability AND
// 				C1.win_probability <= c2.win_probability + %1;`
// 	},
// 	get_num_districts_in_state: {
// 		type: 'SQL',
// 		input_names: ['state'],
// 		description: `Given a state, %1, return the number of congressional districts in that state`,
// 		query: `
// 			SELECT MAX(district)
// 			FROM PollLite
// 			WHERE state == '%1'`
// 	},
// 	get_member_from_district: {
// 		type: 'SQL',
// 		input_names: ['state', 'district'],
// 		description: `Given a state, %1, and district %2, return the name of the current incumbent member from that state`,
// 		query : `
// 			SELECT firstname, lastname
// 			FROM Member
// 			WHERE state == '%1' AND district == '%2'`
// 	}
// };
// export default queries;
