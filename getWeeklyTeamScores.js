/**
 * refreshes the weekly scores table for each team and each week
 */
function getWeeklyScores() {
  let ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  let weeklyScoreTableSheet =ss.getSheetByName("Weekly Score Table");
  if(!weeklyScoreTableSheet){
    ss.insertSheet("Weekly Score Table", 5);
    let weeklyScoreTableSheet = ss.getSheetByName("Weekly Score Table");
  }
  weeklyScoreTableSheet.clear();
  let titleRow = [];
  titleRow.push("Team Name");
  
  for(let i=1;i<=GLOBALS.totalWeeks;i++){
    titleRow.push(`Week ${i} Score`);
    titleRow.push(`Week ${i} Projected Score`);
  }
  weeklyScoreTableSheet.appendRow(titleRow);
  let teamSheet = ss.getSheetByName("Teams");
  let teamData =teamSheet.getDataRange().getValues()
  let service = getService();
  let weeklyValues = [];
  if (service.hasAccess()) {
    let response;
    let teamKeys = "team_keys=" ;
    for(td=1;td<teamData.length;td++){
      weeklyValues.push([teamData[td][2]])
      if (td < teamData.length-1){
        teamKeys = teamKeys + teamData[td][0]+ ",";
      }
      else{
        teamKeys = teamKeys + teamData[td][0] ;
      }
    }
    for(let w=1; w<=GLOBALS.totalWeeks;w++){
      let tempValues = [];
      let url = `https://fantasysports.yahooapis.com/fantasy/v2/teams;${teamKeys}/stats;type=week;week=${w}`;
      try{
        response = UrlFetchApp.fetch(url, {
          headers: {
            'Authorization': 'Bearer ' + service.getAccessToken()
          }
        });
      }
      catch(e){
        Logger.log(e)
      }
      let xml = response.getContentText();
      let json = XML_to_JSON(xml);
      //Logger.log(JSON.stringify(json))
      let weeklyData = json.fantasy_content.teams.team
      let iterator = 1;
      for (let i=0;i<weeklyData.length;i++){
        let totalScore = weeklyData[i].team_points.total.Text;
        let projectedScore = weeklyData[i].team_projected_points.total.Text
        weeklyValues[i].push(totalScore,projectedScore);
      }
    }
    weeklyScoreTableSheet.getRange(2, 1, GLOBALS.teamCount, 35).setValues(weeklyValues);
  }
    
  else{
    showSidebar();
  }
  
}