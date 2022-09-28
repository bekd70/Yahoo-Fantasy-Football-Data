/**
 * Gets the teams and managers for your league
 */
function getTeams() {
  console.log(`getting Teams data`)
  let ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  let sheet = ss.getSheetByName("Teams");
  if(!sheet){
    ss.insertSheet("Teams", 4);
    let sheet = ss.getSheetByName("Teams");
  }
  let service = getService();
  if (service.hasAccess()) {
    let response;
    sheet.clear();
    sheet.appendRow(['teamKey','teamId','teamName','teamUrl','teamLogo','teamManager']);
    let teamKey,teamId,teamName,teamUrl,teamLogo,teamManager;
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${yearId}.l.${GLOBALS.leagueId}/teams`;
    try{
      response = UrlFetchApp.fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + service.getAccessToken()
        },
        'muteHttpExceptions': true
      });
    }
    catch(e){
      Logger.log(`I am in the getTeams script and the error is ${e}`)
    }
    let responseCode = response.getResponseCode();
    console.log(`The response Code is ${responseCode}`)
    let xml = response.getContentText();
    let json = XML_to_JSON(xml);
    //let keys = Object.keys(json.fantasy_content.team);
    //Logger.log(JSON.stringify(json));
    let teamValues = [];
    if(responseCode<300){
      let teamData = json.fantasy_content.league.teams.team;
      if(teamData.length>0){
        //console.log(`I am in the if loop`)
        for(let i=0;i<teamData.length;i++){
          teamKey = teamData[i].team_key.Text;
          teamId = teamData[i].team_id.Text;
          teamName = teamData[i].name.Text;
          teamUrl = teamData[i].url.Text;
          teamLogo = teamData[i].team_logos.team_logo.url.Text;
          teamManager = teamData[i].managers.manager.nickname.Text;
          
          teamValues.push([teamKey,teamId,teamName,teamUrl,teamLogo,teamManager]);
        }
      } 
      sheet.getRange(2,1,teamValues.length,6).setValues(teamValues)
    } 
  }
  else{
    showSidebar();
  }
}
