/**
 * Gets the Matchups for the passes week number
 * @param {int} week number to get data for.
 */
function getMatchups(weekNumber=15) {
  let service = getService();
  let ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  let teams = ss.getSheetByName("Teams").getDataRange().getValues()
  let matchupSheet = ss.getSheetByName("Weekly Matchups");
  if(!matchupSheet){
    ss.insertSheet("Weekly Matchups", 6);
    let matchupSheet = ss.getSheetByName("Weekly Matchups");
  }
  if (service.hasAccess()) {
    
      for(let i=1; i<teams.length;i++){
        let response
        let tempValues = [];
        let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teams[i][0]}/matchups;weeks=` + weekNumber;
        console.log(url)
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
        Logger.log(JSON.stringify(json))
        let matchupData = json.fantasy_content.team.matchups.matchup;
        //console.log(`The matchup data is ${JSON.stringify(matchupData)}`)
        let winningTeam;
        if(matchupData.winner_team_key){
          console.log('winning team key exists')
          winningTeam = matchupData.winner_team_key.Text;
        }
        else{
          console.log('winning team key does not exist')
          if(Number(matchupData.teams.team[0].team_points.total.Text) > Number(matchupData.teams.team[1].team_points.total.Text)){
            winningTeam = matchupData.teams.team[0].team_key.Text
            console.log(`In the IF. the winning team key is ${winningTeam}`)
          }
          else{
            winningTeam = matchupData.teams.team[1].team_key.Text
            console.log(`In the else. the winning team key is ${winningTeam}`)
          }
        }
        
         
        let matchupGrade;
        if (matchupData.matchup_grades){
          matchupGrade = matchupData.matchup_grades.matchup_grade[0].grade.Text;
        }
        else{
          matchupGrade = ''
        }
        
        let teamName = matchupData.teams.team[0].name.Text;
        let oppTeamName = matchupData.teams.team[1].name.Text;
        let teamId = matchupData.teams.team[0].team_key.Text;
        let managerName = matchupData.teams.team[0].managers.manager.nickname.Text;
        let teamPoints = matchupData.teams.team[0].team_points.total.Text;
        let teamProjPoints = matchupData.teams.team[0].team_projected_points.total.Text;
        let oppPoints = matchupData.teams.team[1].team_points.total.Text;
        let oppProjPoints = matchupData.teams.team[1].team_projected_points.total.Text;
        let weeklyStart = matchupData.week_start.Text;
        let weeklyEnd = matchupData.week_end.Text;
        let status;
        if (teamId === winningTeam){
          status = "Winner";
        }
        else{
          status = "Loser";
        }
        matchupSheet.appendRow([teamId,teamName,managerName,oppTeamName,matchupGrade,status,teamProjPoints,teamPoints,oppProjPoints,oppPoints,weeklyStart,weeklyEnd,"Week " + weekNumber]);
        Logger.log("Weekly Matchup for %s saved",teamName)
     }  
  }
    
  else{
    showSidebar();
  }
  
}
