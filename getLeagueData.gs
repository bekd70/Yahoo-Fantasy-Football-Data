/**
 * Gets the league information from Yahoo to save the info to a sheet
 */
function getLeagueData() {
  var ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  var leagueDataSheet = ss.getSheetByName("LeagueData");
  if(!leagueDataSheet){
    ss.insertSheet("LeagueData", 1);
    var leagueDataSheet = ss.getSheetByName("LeagueData");
  }
  
  var service = getService();
  if (service.hasAccess()) {
    leagueDataSheet.clear();
    var url = 'https://fantasysports.yahooapis.com/fantasy/v2/league/399.l.' + GLOBALS.leagueId;
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
    Logger.log(JSON.stringify(json))
    var keys = Object.keys(json.fantasy_content.league);
    leagueDataSheet.appendRow(keys)
    var leagueData = json.fantasy_content.league;
    var leagueValues = [];
    
    for (var i=0;i<keys.length;i++){
      leagueValues.push(leagueData[keys[i]].Text);
    }
    leagueDataSheet.appendRow(leagueValues)
    
  }
  else{
    showSidebar();
  }
  
}

/**
 * Gets the roster positions for your League
 */
function getRosterData() {
  var ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  var rosterInfoSheet = ss.getSheetByName("Roster Info");
  if(!rosterInfoSheet){
    ss.insertSheet("Roster Info", 2);
    var rosterInfoSheet = ss.getSheetByName("Roster Info");
  }
  var service = getService();
  if (service.hasAccess()) {
    rosterInfoSheet.clear();
    var url = 'https://fantasysports.yahooapis.com/fantasy/v2/league/399.l.' + GLOBALS.leagueId + '/settings';
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
    var keys = Object.keys(json.fantasy_content.league.settings.roster_positions);
    rosterInfoSheet.appendRow(["Position", "Number of"]);
    var rosterData = json.fantasy_content.league.settings.roster_positions.roster_position;
    for (var i=0;i<rosterData.length;i++){
      var rosterValues = [];
      rosterValues.push(rosterData[i].position.Text,rosterData[i].count.Text);
      rosterInfoSheet.appendRow(rosterValues)
    }
  }
  else{
    showSidebar();
  }
}

/**
 * Gets the Statistics keys and names of statistics for your league
 */
function getStatKeys(){
  var ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  var statKeysSheet = ss.getSheetByName("Stat Keys");
   if(!statKeysSheet){
    ss.insertSheet("Stat Keys", 3);
    var statKeysSheet = ss.getSheetByName("Stat Keys");
  }
  var service = getService();
  if (service.hasAccess()) {
    var url = 'https://fantasysports.yahooapis.com/fantasy/v2/league/399.l.' + GLOBALS.leagueId + '/settings';
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
    var keys = Object.keys(json.fantasy_content.league.settings.stat_categories.stats.stat[0]);
    statKeysSheet.appendRow(keys);
    var statKeysData = json.fantasy_content.league.settings.stat_categories.stats.stat;
    for (var i=0;i<statKeysData.length;i++){
      var statKeysValues = [];
      for (var j=0;j<keys.length;j++){
        statKeysValues.push(statKeysData[i][keys[j]].Text);
      }
      statKeysSheet.appendRow(statKeysValues)
    }
  }
  else{
    showSidebar();
  }
}

