CREATE TABLE Member (
	state VARCHAR(2),
	district TINYINT,
	firstname VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	middlename VARCHAR(255),
	party VARCHAR(1),
	caucus VARCHAR(1),
	state_fullname VARCHAR(30),
	office_building VARCHAR(10),
	office_room VARCHAR(10),
	office_zip INT,
	office_zip_suffix INT,
	phone VARCHAR(20),
	elected_date VARCHAR(25),
	PRIMARY KEY (state, district),
	CHECK (state IN ('AL', 'AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VI','VT','VA','WA','WV','WI','WY'))
);

CREATE TABLE CommitteeAssignment (
	state VARCHAR(2),
	district TINYINT,
	committee_id VARCHAR(4),
	subcommittee VARCHAR(4) NOT NULL,
	PRIMARY KEY (state, district, committee_id, subcommittee),
	FOREIGN KEY (state, district) REFERENCES Member(state, district)
);

CREATE TABLE PollLite (
	state VARCHAR(2),
	district TINYINT,
	candidate_first VARCHAR(255),
	candidate_last VARCHAR(255),
	party VARCHAR(1),
	is_incumbent INTEGER(1),
	win_probability DECIMAL,
	expected_voteshare DECIMAL,
	p10_voteshare DECIMAL,
	p90_voteshare DECIMAL,
	PRIMARY KEY (state, district, candidate_first, candidate_last),
	FOREIGN KEY (state, district) REFERENCES Member(state, district)
);

CREATE TABLE PollDeluxe (
	state VARCHAR(2),
	district TINYINT,
	candidate_first VARCHAR(255),
	candidate_last VARCHAR(255),
	party VARCHAR(1),
	is_incumbent INTEGER(1),
	win_probability DECIMAL,
	expected_voteshare DECIMAL,
	p10_voteshare DECIMAL,
	p90_voteshare DECIMAL,
	PRIMARY KEY (state, district, candidate_first, candidate_last),
	FOREIGN KEY (state, district) REFERENCES Member(state, district)
);

CREATE TABLE PollClassic (
	state VARCHAR(2),
	district TINYINT,
	candidate_first VARCHAR(255),
	candidate_last VARCHAR(255),
	party VARCHAR(1),
	is_incumbent INTEGER(1),
	win_probability DECIMAL,
	expected_voteshare DECIMAL,
	p10_voteshare DECIMAL,
	p90_voteshare DECIMAL,
	PRIMARY KEY (state, district, candidate_first, candidate_last),
	FOREIGN KEY (state, district) REFERENCES Member(state, district)
);

