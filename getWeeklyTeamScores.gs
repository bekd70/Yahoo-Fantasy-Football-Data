/**
 * refreshes the weekly scores table for each team and each week
 */
function getWeeklyScores() {
  var ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  var weeklyScoreTableSheet =ss.getSheetByName("Weekly Score Table");
  if(!weeklyScoreTableSheet){
    ss.insertSheet("Weekly Score Table", 5);
    var weeklyScoreTableSheet = ss.getSheetByName("Weekly Score Table");
  }
  weeklyScoreTableSheet.clear();
  var titleRow = [];
  titleRow.push("Team Name");
  
  for(var i=1;i<=GLOBALS.totalWeeks;i++){
    titleRow.push("Week " + i + " Score");
    titleRow.push("Week " + i + " Projected Score");
  }
  weeklyScoreTableSheet.appendRow(titleRow);
  var teamSheet = ss.getSheetByName("Teams");
  var teamData =teamSheet.getDataRange().getValues()
  var service = getService();
  var weeklyValues = [];
  if (service.hasAccess()) {
    var teamKeys = "team_keys=" ;
    for(td=1;td<teamData.length;td++){
      weeklyValues.push([teamData[td][2]])
      if (td < teamData.length-1){
        teamKeys = teamKeys + teamData[td][0]+ ",";
      }
      else{
        teamKeys = teamKeys + teamData[td][0] ;
      }
    }
    for(var w=1; w<=GLOBALS.totalWeeks;w++){
      var tempValues = [];
      var url = 'https://fantasysports.yahooapis.com/fantasy/v2/teams;' + teamKeys +'/stats;type=week;week=' + w;
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
      var weeklyData = json.fantasy_content.teams.team
      var iterator = 1;
      for (var i=0;i<weeklyData.length;i++){
        var totalScore = weeklyData[i].team_points.total.Text;
        var projectedScore = weeklyData[i].team_projected_points.total.Text
        weeklyValues[i].push(totalScore,projectedScore);
      }
    }
    weeklyScoreTableSheet.getRange(2, 1, 14, 33).setValues(weeklyValues);
  }
    
  else{
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',authorizationUrl);
  }
  
}