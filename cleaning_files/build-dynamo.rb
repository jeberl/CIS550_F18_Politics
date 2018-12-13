require 'aws-sdk-dynamodb'  # v2: require 'aws-sdk'
require 'json'

# Create dynamodb client in us-west-2 region
dynamodb = Aws::DynamoDB::Client.new(region: 'us-west-2')

file = File.read('committees.json')
committees = JSON.parse(file)
committees.each{|committee|


  subcoms = []
  if (committee["subcomittees"] != nil)
    committee["subcomittees"].each{|subcom|
      subcoms.concat([{
        "subcommittee_code" => {
            S: subcom["subcommittee_code"].to_s
        },
        "full_subcommittee_name" => {
            S: subcom["full_subcommittee_name"].to_s
        }
      }])
    }  
  end
  #puts subcoms

  com = {
        "committee_id" => committee["committee_id"],
        "room" => {
          S: committee["room"].to_s
        },
        "full_committee_name" => {
          S: committee["full_committee_name"].to_s
        },
        "type" => {
          S: committee["type"].to_s
        },
        "building-code" => {
          S: committee["building-code"].to_s
        },
        "phone" => {
          S: committee["phone"].to_s
        },
        "subcomittees" => {
          L: subcoms
        }
      }

  params = {
      table_name: 'Committees2',
      item:  com,
  }

  begin
    result = dynamodb.put_item(params)
    puts 'Added committee: ' + result.to_s

  rescue  Aws::DynamoDB::Errors::ServiceError => error
    puts 'Unable to add committee:' + error.to_s
    puts
  end
}