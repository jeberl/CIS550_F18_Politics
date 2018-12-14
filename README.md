# CIS550_F18_Politics

## Project Description
Our project was conceived after recognizing a very specific political problem and grew into an app to solve that problem as well as provide general information about the political landscape in the US.\
\
Imagine there is an important vote about to happen on some congressional subcommittee that you are very passionate about. You want to try and persuade the representatives on that subcommittee to vote a certain way (either by contacting them, lobbying them, etc.) so you want to find the members of the committee who will be most susceptible to your persuasion. Presumably, those members on the committee who are in the closest re-election races will be most likely to listen to you. But how do you find which representative is in the closest re-election bid? That’s where our app, Let’s Talk Politics, comes in solving this issue and providing general information on the American Political System.\
\
Our web app accomplishes this goal in 5 sections:\
The home page includes an overview of the app and a very simple, easy-to-follow breakdown of the 4 main features of the website.\
\
The “Committee Members” page solves the initial problem we recognized by finding members of a committee in the closest races. Here, the user is able to choose a committee from a dropdown of all congressional committees and then choose a subcommittee under that committee. The user will then see a) who on the committee is in the closest race b) who on the committee is least likely to be reelected and c) who are all the members of the committee and what is their contact information.\
\
The “Reps Per State” page allows the user to view a listing of all of the states with the number of representatives per state. This allows the user to see which of the states have the most political representation and compare how their states stacks up to the rest of the nation.\
\
The “Who’s Running” page allows the user to enter their (or someone else’s) state and congressional district to see all of the candidates running. Additionally, the user is able to see which of the candidates, if any, are incumbents (currently hold the office).\
\
Lastly the “Tight Race Watch” page allows the user to find all races nationally which are within a specific margin/ For example, a user may select 2% to see a list of all of the races polling data that indicates that the race is within the margin, specified. Note that these are not vote share percentages but likelihood of winning as model by FiveThirtyEight, more info on this data source below.  On the “Tight Race Watch” page, we limit the tight races to 10% or less because we figured anything more than that is no longer considered a tight race.\
\
We designed our app to solve a specific problem in american politics and provide constituants easier access their representative. We feel our app accomplishes this and more in an elegant and intuitive platform that can help increase political participation and hold representatives more accountable to their districts.


## Running Application

Run node app from within the PoliticsApp folder to launch app\
- Open a new terminal window 
- Type the following commands\
  1 - cd NodeApp\
  2 - npm install\
  3 - node app \
The second command will install all the packages used in this project\
The third will run the server. \
\
To check if the server is actually running, open a browser and go to the following link
localhost:8080
