/**
 * Gets the stats for each player for the passed week
 * @param {int} week number to get data for.
 */
function getWeeklyPlayerStats(w=7) {
  let ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  let weeklyPlayerScoresSheet =ss.getSheetByName("Weekly Player Scores");
  if(!weeklyPlayerScoresSheet){
    ss.insertSheet("Weekly Player Scores", 7);
    let weeklyPlayerScoresSheet = ss.getSheetByName("Weekly Player Scores");
  }
  let teamSheet = ss.getSheetByName("Teams");
  let teamData =teamSheet.getDataRange().getValues()
  let service = getService();
  let finalValues = [];
  if (service.hasAccess()) {
    let teamKeys = []
    for(td=1;td<teamData.length;td++){
      teamKeys.push([teamData[td][0],teamData[td][2]]);
    }
    
   for(let i=0; i<teamKeys.length;i++){
    let response,response2
      let teamValues = [];
      let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKeys[i][0]}/roster;type=week;week=${w }/players`;
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
      let weeklyData = json.fantasy_content.team.roster.players.player;
      for (let j=0;j<weeklyData.length;j++){
        teamValues.push([
          teamKeys[i][0],
          teamKeys[i][1],
          weeklyData[j].player_key.Text,
          weeklyData[j].name.full.Text,
          weeklyData[j].selected_position.position.Text
        ]);
      }
      console.log(`The team Values are ${teamValues}`)
      let playerKeys = "player_keys=" ;
      for(let p=0;p<teamValues.length;p++){
        
        if (p < teamValues.length-1){
          playerKeys = playerKeys + teamValues[p][2] + ",";
        }
        else{
          playerKeys = playerKeys + teamValues[p][2];
        }
      }
      let url2 = `https://fantasysports.yahooapis.com/fantasy/v2/league/${yearId}.l.${GLOBALS.leagueId}/players;${playerKeys}/stats;type=week;week=${w}`;
      try{
        response2 = UrlFetchApp.fetch(url2, {
          headers: {
            'Authorization': 'Bearer ' + service.getAccessToken()
          }
        });
      }
      catch(e){
        Logger.log(e)
      }
      let xml2 = response2.getContentText();
      let json2 = XML_to_JSON(xml2);
      Logger.log(JSON.stringify(json2))
      let playerData = json2.fantasy_content.league.players.player
      for(let k=0;k<playerData.length;k++){
        teamValues[k].push(playerData[k].player_points.total.Text,"Week " + w);
      }
     finalValues.push(teamValues);
     Logger.log(`Player Scores saved for team ${teamKeys[i][1]} for week ${w}`)
    }
    Logger.log(`the final values are ${finalValues}`)
    for (let s = 0;s<finalValues.length;s++){
      weeklyPlayerScoresSheet.getRange(weeklyPlayerScoresSheet.getLastRow()+1, 1, finalValues[s].length, 7).setValues(finalValues[s])
    }
     
  }
    
  else{
    showSidebar();
  }
  
}