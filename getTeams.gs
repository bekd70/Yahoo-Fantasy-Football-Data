/**
 * Gets the teams and managers for your league
 */
function getTeams() {
  var ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  var sheet = ss.getSheetByName("Teams");
  if(!sheet){
    ss.insertSheet("Teams", 4);
    var sheet = ss.getSheetByName("Teams");
  }
  var service = getService();
  //var service = OAuth2.createService('Yahoo.com');
  if (service.hasAccess()) {
    sheet.clear();
    sheet.appendRow(['teamKey','teamId','teamName','teamUrl','teamLogo','teamManager']);
    for(var t=1; t<GLOBALS.teamCount+1; t++){
      var url = 'https://fantasysports.yahooapis.com/fantasy/v2/team/399.l.' + GLOBALS.leagueId +'.t.'+ t;
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
      var keys = Object.keys(json.fantasy_content.team);
      //Logger.log(JSON.stringify(json))
      var teamData = json.fantasy_content.team;
      var teamValues = [];
      
      var teamKey = teamData.team_key.Text;
      var teamId = teamData.team_id.Text;
      var teamName = teamData.name.Text;
      var teamUrl = teamData.url.Text;
      var teamLogo = teamData.team_logos.team_logo.url.Text;
      var teamManager = teamData.managers.manager.nickname.Text;
      
      teamValues.push(teamKey,teamId,teamName,teamUrl,teamLogo,teamManager);
      
      sheet.appendRow(teamValues)
    }
  }
  else{
    showSidebar();
  }
}
