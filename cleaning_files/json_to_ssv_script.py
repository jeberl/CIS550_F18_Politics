import csv
from xml.etree import ElementTree as ET

file_folder = "data"

xml = "MemberDataAndAssignments.xml"
member_csv = "data/Members.csv"
assignment_csv = "data/CommitteeAssignments.csv"

member_attributes = ["state","district","firstname","lastname","middlename","party","caucus","state-fullname","office-building","office-room","office-zip","office-zip-suffix","phone","elected-date"]

assignment_attributes = ["state","district","committee_id","subcommittee"]

#Build Member.csv
with open(member_csv, "w") as m_out:
	m_writer = csv.DictWriter(m_out, fieldnames=member_attributes)
	#m_writer.writeheader()
	with open(assignment_csv, "w") as a_out:
		a_writer = csv.DictWriter(a_out, fieldnames=assignment_attributes)
		#a_writer.writeheader()

		root = ET.parse("{}/{}".format(file_folder, xml)).getroot()
		root = root[1]
		for member in root:
			info = member[1]
			assignments = member[2]
			state = member[0].text[0:2]
			district = int(member[0].text[2:4])
			if district == 0:
				district = 1

			member_data = {"state": state, "district" : district, "state-fullname": info.find('state').find('state-fullname').text}
			for attribute in member_attributes:
				if attribute not in member_data.keys():
					member_data[attribute] = info.find(attribute).text
					for bad_char, replacement in {u'\xfa' : 'u', u'\xe1' : 'a', u'\xe9' : 'e', u'\xf3' : 'b'}.items():
						if member_data[attribute] and bad_char in member_data[attribute]:
							member_data[attribute] = member_data[attribute].replace(bad_char, replacement)
			if member_data['lastname']:
				m_writer.writerow(member_data)

			for assignment in assignments:
				comcode = None
				if 'comcode' in assignment.attrib.keys():
					comcod = assignment.attrib['comcode']
				if 	'subcomcode' in assignment.attrib.keys():
					comcode = assignment.attrib['subcomcode']
				if comcode:
					assignment_data = {"state": state, "district" : district, "committee_id": comcode[0:2], "subcommittee": comcode[2:4]}
					a_writer.writerow(assignment_data)




			


