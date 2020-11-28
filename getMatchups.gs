/**
 * Gets the Matchups for the passes week number
 * @param {int} week number to get data for.
 */
function getMatchups(weekNumber) {
  var service = getService();
   var ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  var matchupSheet = ss.getSheetByName("Weekly Matchups");
  if(!matchupSheet){
    ss.insertSheet("Weekly Matchups", 6);
    var matchupSheet = ss.getSheetByName("Weekly Matchups");
  }
  if (service.hasAccess()) {
    
      for(var i=1; i<=GLOBALS.teamCount;i++){
        var tempValues = [];
        var url = 'https://fantasysports.yahooapis.com/fantasy/v2/team/399.l.785967.t.' + i + '/matchups;weeks=' + weekNumber;
        try{
          var response = UrlFetchApp.fetch(url, {
            headers: {
              'Authorization': 'Bearer ' + service.getAccessToken()
            }
          });
        }
        catch(e){
          Logger.log(e)
        }
        var xml = response.getContentText();
        var json = XML_to_JSON(xml);
        //Logger.log(JSON.stringify(json))
        var matchupData = json.fantasy_content.team.matchups.matchup;
        var winningTeam = matchupData.winner_team_key.Text;
        var matchupGrade = matchupData.matchup_grades.matchup_grade[0].grade.Text;
        var teamName = matchupData.teams.team[0].name.Text;
        var oppTeamName = matchupData.teams.team[1].name.Text;
        var teamId = matchupData.teams.team[0].team_key.Text;
        var managerName = matchupData.teams.team[0].managers.manager.nickname.Text;
        var teamPoints = matchupData.teams.team[0].team_points.total.Text;
        var teamProjPoints = matchupData.teams.team[0].team_projected_points.total.Text;
        var oppPoints = matchupData.teams.team[1].team_points.total.Text;
        var oppProjPoints = matchupData.teams.team[1].team_projected_points.total.Text;
        var weeklyStart = matchupData.week_start.Text;
        var weeklyEnd = matchupData.week_end.Text;
        if (teamId === winningTeam){
          var status = "Winner";
        }
        else{
          var status = "Looser";
        }
        matchupSheet.appendRow([teamId,teamName,managerName,oppTeamName,matchupGrade,status,teamPoints,teamProjPoints,oppPoints,oppProjPoints,weeklyStart,weeklyEnd,"Week " + weekNumber]);
        Logger.log("Weekly Matchup for %s saved",teamName)
     }  
  }
    
  else{
    showSidebar();
  }
  
}
