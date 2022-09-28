/**
 * Gets the league information from Yahoo to save the info to a sheet
 */
function getLeagueData() {
  console.log(`getting League data`)
  let ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  let leagueDataSheet = ss.getSheetByName("LeagueData");
  if(!leagueDataSheet){
    ss.insertSheet("LeagueData", 1);
    let leagueDataSheet = ss.getSheetByName("LeagueData");
  }
  
  let service = getService();
  if (service.hasAccess()) {
    let response
    leagueDataSheet.clear();
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${yearId}.l.${GLOBALS.leagueId}`;
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
    let keys = Object.keys(json.fantasy_content.league);
    leagueDataSheet.appendRow(keys)
    let leagueData = json.fantasy_content.league;
    let leagueValues = [];
    
    for (let i=0;i<keys.length;i++){
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
  console.log(`getting roster data`)
  let ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  let rosterInfoSheet = ss.getSheetByName("Roster Info");
  if(!rosterInfoSheet){
    ss.insertSheet("Roster Info", 2);
    let rosterInfoSheet = ss.getSheetByName("Roster Info");
  }
  let service = getService();
  if (service.hasAccess()) {
    let response
    rosterInfoSheet.clear();
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${yearId}.l.${GLOBALS.leagueId}/settings`;
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
    let keys = Object.keys(json.fantasy_content.league.settings.roster_positions);
    rosterInfoSheet.appendRow(["Position", "Number of"]);
    let rosterData = json.fantasy_content.league.settings.roster_positions.roster_position;
    for (let i=0;i<rosterData.length;i++){
      let rosterValues = [];
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
  console.log(`getting stats data`)
  let ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  let statKeysSheet = ss.getSheetByName("Stat Keys");
   if(!statKeysSheet){
    ss.insertSheet("Stat Keys", 3);
    let statKeysSheet = ss.getSheetByName("Stat Keys");
  }
  let service = getService();
  
  if (service.hasAccess()) {
    let response
    statKeysSheet.clear();
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${yearId}.l.${GLOBALS.leagueId}/settings`;
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
    let keys = Object.keys(json.fantasy_content.league.settings.stat_categories.stats.stat[0]);
    statKeysSheet.appendRow(keys);
    let statKeysData = json.fantasy_content.league.settings.stat_categories.stats.stat;
    //console.log(statKeysData)
    for (let i=0;i<statKeysData.length;i++){
      let statKeysValues = [];
      for (let j=0;j<keys.length;j++){
        statKeysValues.push(statKeysData[i][keys[j]].Text);
      }
      statKeysSheet.appendRow(statKeysValues)
    }
  }
  else{
    showSidebar();
  }
}

