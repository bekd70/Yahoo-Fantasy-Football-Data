/**
 * Gets the stats for each player for the passed week
 * @param {int} week number to get data for.
 */
function getWeeklyPlayerStats(w) {
  var ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  var weeklyPlayerScoresSheet =ss.getSheetByName("Weekly Player Scores");
  if(!weeklyPlayerScoresSheet){
    ss.insertSheet("Weekly Player Scores", 7);
    var weeklyPlayerScoresSheet = ss.getSheetByName("Weekly Player Scores");
  }
  var teamSheet = ss.getSheetByName("Teams");
  var teamData =teamSheet.getDataRange().getValues()
  var service = getService();
  var finalValues = [];
  if (service.hasAccess()) {
    var teamKeys = []
    for(td=1;td<teamData.length;td++){
      teamKeys.push([teamData[td][0],teamData[td][2]]);
    }
    
    //for(var i=0; i<3;i++){
   for(var i=0; i<teamKeys.length;i++){
      var teamValues = [];
      var url = 'https://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKeys[i][0] +'/roster;type=week;week=' + w + '/players';
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
      var weeklyData = json.fantasy_content.team.roster.players.player;
      for (var j=0;j<weeklyData.length;j++){
        teamValues.push([
          teamKeys[i][0],
          teamKeys[i][1],
          weeklyData[j].player_key.Text,
          weeklyData[j].name.full.Text,
          weeklyData[j].selected_position.position.Text
        ]);
      }
      var playerKeys = "player_keys=" ;
      for(var p=0;p<teamValues.length;p++){
        if (p < teamValues.length-1){
          playerKeys = playerKeys + teamValues[p][2] + ",";
        }
        else{
          playerKeys = playerKeys + teamValues[p][2];
        }
      }
      var url2 = 'https://fantasysports.yahooapis.com/fantasy/v2/league/399.l.' + GLOBALS.leagueId + '/players;' + playerKeys + '/stats;type=week;week=' + w;
      try{
        var response2 = UrlFetchApp.fetch(url2, {
          headers: {
            'Authorization': 'Bearer ' + service.getAccessToken()
          }
        });
      }
      catch(e){
        Logger.log(e)
      }
      var xml2 = response2.getContentText();
      var json2 = XML_to_JSON(xml2);
      var playerData = json2.fantasy_content.league.players.player
      for(var k=0;k<playerData.length;k++){
        teamValues[k].push(playerData[k].player_points.total.Text,"Week " + w);
      }
     finalValues.push(teamValues);
     Logger.log("Player Scores saved for team %s for week %s",teamKeys[i][1],w)
    }
    for (var s = 0;s<finalValues.length;s++){
      weeklyPlayerScoresSheet.getRange(weeklyPlayerScoresSheet.getLastRow()+1, 1, finalValues[s].length, 7).setValues(finalValues[s])
    }
     
  }
    
  else{
    showSidebar();
  }
  
}
