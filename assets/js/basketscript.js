//If user clikcs basketball button on modle then it sends them to basketball page
//Page shows teams stats, Past games, and upcoming Games
var lastGameEl = document.querySelector("#last-game-container");
var nextGameEl = document.querySelector("#next-game-container");
var teamLineUpEl = document.querySelector("#team-lineup");
var userTeamEl = document.querySelector("#user-team");

const nbaTeams = [
  { teamName: "Boston Celtics", id: 3422 },
  { teamName: "New Jersey Nets", id: 3436 },
  { teamName: "New York Knicks", id: 3421 },
  { teamName: "Philadelphia 76ers", id: 3420 },
  { teamName: "Toronto Raptors", id: 3433 },
  { teamName: "Chicago Bulls", id: 3409 },
  { teamName: "Cleveland Cavaliers", id: 3432 },
  { teamName: "Detroit Pistons", id: 3424 },
  { teamName: "Indiana Pacers", id: 3419 },
  { teamName: "Milwaukee Bucks", id: 3410 },
  { teamName: "Atlanta Hawks", id: 3423 },
  { teamName: "Miami Heat", id: 3435 },
  { teamName: "Orlando Magic", id: 3437 },
  { teamName: "Washington Wizards", id: 3431 },
  { teamName: "Denver Nuggets", id: 3417 },
  { teamName: "Minnesota Timberwolves", id: 3426 },
  { teamName: "Oklahoma City Thunder", id: 3418 },
  { teamName: "Portland Trail Blazers", id: 3414 },
  { teamName: "Utah Jazz", id: 3434 },
  { teamName: "Golden State Warriors", id: 3428 },
  { teamName: "Los Angeles Clippers", id: 3425 },
  { teamName: "Los Angeles Lakers", id: 3427 },
  { teamName: "Phoenix Suns", id: 3416 },
  { teamName: "Sacramento Kings", id: 3413 },
  { teamName: "Dallas Mavericks", id: 3411 },
  { teamName: "Houston Rockets", id: 3412 },
  { teamName: "Memphis Grizzlies", id: 3415 },
  { teamName: "San Antonio Spurs", id: 3429 },
];

$(document).ready(function () {
  for (let i = 0; i < nbaTeams.length; i++) {
    var listTeams = document.createElement("p");
    listTeams.textContent = nbaTeams[i].teamName;
    listTeams.classList.add("navbar-item");
    userTeamEl.append(listTeams);
  }
});

document.querySelector(".submit-btn").addEventListener("click", function () {
  //grabs id according to userTeamEl value and sets it to teamID
  var obj = nbaTeams.find((o) => o.teamName === userTeamEl.value);
  var teamID = obj.id;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "db671925bdmshfcbe269e1b241ddp1d83d8jsncfb029306090",
      "X-RapidAPI-Host": "basketapi1.p.rapidapi.com",
    },
  };
  findTeamPlayers(teamID, options);
  findNextMatches(teamID, options);
  findLastMatches(teamID, options);
});

function findTeamPlayers(teamID, options) {
  setTimeout(function () {
    //team players
    fetch(
      "https://basketapi1.p.rapidapi.com/api/basketball/team/" +
        teamID +
        "/players",
      options
    )
      .then((response) => response.json())
      .then(function (data) {
        //display teams players in player div
        //players.player.name
        //players.player.jerseyNumber
        //list players on a team along with their jersey number
        //Get player ID data.players[i].player.id
        for (let i = 0; i < data.players.length; i++) {
          var teamRosterEl = document.createElement("div");
          var currentPlayerEl = document.createElement("p");
          currentPlayerEl.textContent = data.players[i].player.name;
          teamRosterEl.append(currentPlayerEl);
          var currentPlayerNum = document.createElement("p");
          currentPlayerNum.textContent = data.players[i].player.jerseyNumber;
          teamRosterEl.append(currentPlayerNum);
          teamLineUpEl.append(teamRosterEl);
        }
      })
      .catch((err) => console.error(err));
  }, 2000);
}

function teamPlayerStats(playerID, seasonID, options) {
  fetch(
    "https://basketapi1.p.rapidapi.com/api/basketball/player/" +
      playerID +
      "/tournament/132/season/" +
      seasonID +
      "/statistics/regularseason",
    options
  )
    .then((response) => response.json())
    .then(function (data) {
      var playerAssistEl = document.createElement("p");
      playerAssistEl.textContent = "Assists: " + data.statistics.assists;
      var playerBlocksEl = document.createElement("p");
      playerBlocksEl.textContent = "Blocks: " + data.statistics.blocks;
      var playerPointsEl = document.createElement("p");
      playerPointsEl.textContent = "Points: " + data.statistics.points;
    })
    .catch((err) => console.error(err));
}

function findNextMatches(teamID, options) {
  setTimeout(function () {
    //team next match results
    fetch(
      "https://basketapi1.p.rapidapi.com/api/basketball/team/" +
        teamID +
        "/matches/next/0",
      options
    )
      .then((response) => response.json())
      .then(function (data) {
        for (let i = 24; i < data.events.length; i++) {
          //display upcoming team matches in seperate divs inside the nextGameEl container
          //events.homeScore[i]
          //homeScore
          //homeTeam
          //awayScore
          //awayTeam
          //if homeScore/awayScore === null then 0
          //startTimestamp format into mm/dd/yyyy hh:mm
          var nextMatchEl = document.createElement("div");
          //var homeTeamEl = document.createElement("p");
          var homeTeamEl = data.events[i].homeTeam.name;
          //nextMatchEl.append(homeTeamEl);
          //var awayTeamEl = document.createElement("p");
          var awayTeamEl = data.events[i].awayTeam.name;
          //nextMatchEl.append(awayTeamEl);
          var nextMatchLineUpEl = homeTeamEl + " VS " + awayTeamEl;
          nextMatchEl.append(nextMatchLineUpEl);
          var secondsDate = data.events[i].startTimestamp;
          var upcomingDate = secondsDate * 1000;
          var dateObj = new Date(upcomingDate);
          var dateFormat = dateObj.toDateString();
          var listDate = document.createElement("p");
          listDate.textContent = dateFormat;
          nextMatchEl.append(listDate);
          nextGameEl.append(nextMatchEl);
        }
        console.log(data);
      })
      .catch((err) => console.error(err));
  }, 2000);
}

function findLastMatches(teamID, options) {
  //team last match results
  fetch(
    "https://basketapi1.p.rapidapi.com/api/basketball/team/" +
      teamID +
      "/matches/previous/0",
    options
  )
    .then((response) => response.json())
    .then(function (data) {
      for (let i = 24; i < data.events.length; i++) {
        //display past team matches in seperate divs inside the lastGameEl container
        //events.homeScore[i]
        //homeScore
        //homeTeam
        //awayScore
        //awayTeam
        //if homeScore/awayScore === null then 0
        //startTimestamp format into mm/dd/yyyy hh:mm
        //Get season from matches data.events[i].tournament.id
        var lastMatchEl = document.createElement("div");
        //var homeTeamEl = document.createElement("p");
        var homeTeamEl = data.events[i].homeTeam.name;
        //lastMatchEl.append(homeTeamEl);
        //var homeTeamScoreEl = document.createElement("p");
        var homeTeamScoreEl = data.events[i].homeScore.current;
        //lastMatchEl.append(homeTeamScoreEl);
        //var awayTeamScoreEl = document.createElement("p");
        var awayTeamScoreEl = data.events[i].awayScore.current;
        //lastMatchEl.append(awayTeamScoreEl);
        //var awayTeamEl = document.createElement("p");
        var awayTeamEl = data.events[i].awayTeam.name;
        //lastMatchEl.append(awayTeamEl);
        var lastMatchLineUpEl =
          homeTeamScoreEl +
          " " +
          homeTeamEl +
          " VS " +
          awayTeamEl +
          " " +
          awayTeamScoreEl;
        lastMatchEl.append(lastMatchLineUpEl);
        var secondsDate = data.events[i].startTimestamp;
        var pastDate = secondsDate * 1000;
        var dateObj = new Date(pastDate);
        var dateFormat = dateObj.toDateString();
        var listDate = document.createElement("p");
        listDate.textContent = dateFormat;
        lastMatchEl.append(listDate);
        lastGameEl.append(lastMatchEl);
      }
      console.log(data);
    })
    .catch((err) => console.error(err));
}