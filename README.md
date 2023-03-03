# Volleyball-statistics-web-app
Fullstack web application for my university final thesis

******************************** Abstract ********************************

The application aims to specifically help these groups of people:
•	statisticians- monitoring of volleyball matches and detailed analysis of the completed ones;
•	scouts- easier finding of quality players;
•	users- watch live results when no video streaming is available.

The application is characterized by 3 main functionalities:
1.	Dashboard for monitoring the match- monitoring the current score, entering a new point, substituting players, calling a time out, giving cards,
monitoring the players lineups in the court and their rotations, monitoring a sequence of the last 5 points (what was the current score, which player
served and who won the point).
2.	Generation of detailed statistics for the completed match- display of the final result; comparison of points won from attack, block, block out,
aces and opponent errors; basic information about the match (city, state, hall, date and time, main and assistant referee, description of the match);
a display of the players from both teams and how many sets they won.
3.	Watching live results- display of the current result; basic information about the match (city, state, hall, date and time, main and assistant referee,
description of the match); monitoring the players lineups in the court and their rotations; following a sequence of the last 5 points (what was the current
score, which player served and who won the point). 

The application has a system for registering and logging in users.
Logged in users- can start statistics for a match and set it’s status to be Private(only the user who enters the statistics can see it) or Public(both
logged in and unauthenticated users can see the live score, and can also see the game statistics when it is finished). In the admin panel, any user can
change the match status from Public to Private (and vice versa) at any time.
Unauthenticated users– can’t start statistics for a match, but can follow live results for Public matches or view detailed statistics for already Completed
Public matches.

