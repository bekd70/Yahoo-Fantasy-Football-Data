function getDraftResults() {
  let ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  let draftResultsDataSheet = ss.getSheetByName("Draft Results");
  let teamsData = ss.getSheetByName("Teams").getDataRange().getValues();
  if(!draftResultsDataSheet){
    ss.insertSheet("Draft Results", 1);
    let draftResultsDataSheet = ss.getSheetByName("Draft Results");
  }
  draftResultsDataSheet.clear();
  draftResultsDataSheet.appendRow(['round','pick','teamId','team','playerName','playerPosition','playerTeamName','playerByeWeek','cost']);
  draftResultsDataSheet.getRange(2,1,1,1).setValue("Loading Data...");
  SpreadsheetApp.flush();
  let playerInfo = [];
  let playerArray =[];
  let draftContent = [];
  let service = getService();
  if (service.hasAccess()) {
    let draftResponse
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${yearId}.l.${GLOBALS.leagueId}/draftresults`;
     try{
      draftResponse = UrlFetchApp.fetch(url, {
        muteHttpExceptions: true,
        headers: {
          'Authorization': 'Bearer ' + service.getAccessToken()
        },
        'muteHttpExceptions': true
      });
    }
    catch(e){
      Logger.log(e)
    }
    let responseCode = draftResponse.getResponseCode();
    console.log(`The Response Code is ${responseCode}`);
    let draftXml = draftResponse.getContentText();
    let draftJson = XML_to_JSON(draftXml);
    //Logger.log(JSON.stringify(draftJson));
    let draftResults = draftJson.fantasy_content.league.draft_results.draft_result;
    console.log(`There are ${draftResults.length} draft records`);
    if(draftResults!==undefined){
      let maxResults = 25;
      let recordCount = 0;
      for(let i=0;i<draftResults.length;i++){
        playerArray.push(draftResults[i].player_key.Text)
      }
      while (recordCount<playerArray.length){
        let playerUrl = `https://fantasysports.yahooapis.com/fantasy/v2/league/${GLOBALS.yearId}.l.${GLOBALS.leagueId}/players;player_keys=`;
        let tempCount = 0;
        while(tempCount<=maxResults){
          if(tempCount < maxResults-1 ){
            if(recordCount<playerArray.length-1){
            playerUrl = playerUrl + playerArray[recordCount] + ",";
            recordCount++;
            }
          }
          else if (tempCount == maxResults ){
            playerUrl = playerUrl + playerArray[recordCount];
            recordCount++;
          }
          else if(recordCount==playerArray.length-1){
            playerUrl = playerUrl + playerArray[recordCount];
            recordCount++;
            break;
          }
          else if( recordCount>playerArray.length){
            recordCount++;
            break;
          }
          tempCount++;
        }
        console.log(playerUrl);
        try{
            let playerResponse = UrlFetchApp.fetch(playerUrl, {
              muteHttpExceptions: true,
              headers: {
                'Authorization': 'Bearer ' + service.getAccessToken()
              }
            });
            let playerResponseCode = playerResponse.getResponseCode()
            console.log(`The Player response is ${playerResponseCode}`)
            
            let playerXml = playerResponse.getContentText();
            let playerJson = XML_to_JSON(playerXml);
            if(playerResponseCode>299){
              console.log(JSON.stringify(playerJson))
            }
            for(let i=0;i<playerJson.fantasy_content.league.players.player.length;i++){
              let playerResults = playerJson.fantasy_content.league.players.player[i];
              playerName = playerResults.name.full.Text
              playerTeamName = playerResults.editorial_team_full_name.Text
              playerByeWeek = playerResults.bye_weeks.week.Text;
              playerPosition = playerResults.display_position.Text;
              playerInfo.push([playerName,playerPosition,playerTeamName,playerByeWeek])
            }
            console.log(`There are ${playerInfo.length} players now`)
          }
          catch(e){
            playerName = "";
            playerTeamName = "";
            playerByeWeek = "";
            Logger.log(e)
          }
      }
      
      for(let i=0;i<draftResults.length;i++){
        let team;
        let result = draftResults[i];
        //console.log(`Draft Result: ${JSON.stringify(result)}`)
        let round = result.round.Text;
        let pick = result.pick.Text;
        let cost = result.cost.Text;
        let teamId = result.team_key.Text;
        let teamMatch = ArrayLib.indexOf(teamsData,0,teamId)
        if(teamMatch>0){
          team = `${teamsData[teamMatch][2]}--${teamsData[teamMatch][5]}`
        }
        
        draftContent.push([round,pick,teamId,team,playerInfo[i][0],playerInfo[i][1],playerInfo[i][2],playerInfo[i][3],cost])
        //console.log(`There are ${draftContent.length} rows, and the content of this row is ${draftContent[i]}`)
      }
      draftResultsDataSheet.getRange(2,1,draftContent.length,9).setValues(draftContent);
      
      SpreadsheetApp.flush()
    }
    else{
      draftResultsDataSheet.getRange(2,1,1,1).setValue("No Draft Results to report");
    }
  }
  else{
    showSidebar();
  }
  
}
