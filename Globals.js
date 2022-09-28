/*************
* 
* Replace the GLOBALS letiables to match your environment. 
* This Script uses the OAuth2 and BetterLog libraries. OAuth2 is required but betterLog is not
* Comment out Logger =  BetterLog.useSpreadsheet(GLOBALS.sheetId); to use the standard Stackdriverlogging
* 
* Go to Resources and add the following two libraries:
* OAuth2: 1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF, https://github.com/googleworkspace/apps-script-oauth2
* BetterLog: 1DSyxam1ceq72bMHsE6aOVeOl94X78WCwiYPytKi7chlg4x5GqiNXSw0l
* 
* You will need to obtain Yahoo API client ID & Secretto use the scripts.  In the process of creating your API credentials
* you will need to enter https://script.google.com/macros/d/{YOUR SCRIPT ID}/usercallback into the redirect URi form. Once entered 
* and you have entered the key and secret below, you will need to run 
* initializeLeagueData() function.  You will get a URL in the Log.  Copy this URL to a browser and go to it.  It should 
* return "Success".  Once that is done, you will not need to do it again.
* 
**************/

const GLOBALS = {
  sheetId: "XXXXX", //ID of the Spreadsheet
  CLIENT_ID:'XXXXXXX', //your Yahoo client ID
  CLIENT_SECRET: 'XXXXXXXX',  //your Yahoo client secret
  teamCount: 14, //the number of teams in your league
  leagueId: 'XXXXXX',  //The ID of you Yahoo league
  totalWeeks:17 
}

//this will check to see if the yearId is saved to the PorpertiesService
const yearId = checkGameKey()

let Logger = BetterLog.useSpreadsheet(GLOBALS.sheetId);

/**
 * Initializes the League data
 */
function initializeLeagueData() {
  console.log("at the beginning")
  getLeagueData();
  getRosterData();
  getStatKeys();
  getTeams();
  
}

/**
 * Gets the Weekly data for your teams and players
 */
function getWeeklyData() {
  let ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  let menuSheet = ss.getSheetByName("Menu")
  let w = menuSheet.getRange("B8").getValue();
  console.log("Refreshing team names...")
  getTeams();
  console.log("Getting Matchups...")
  getMatchups(w);
  console.log("Getting Player Stats...")
  getWeeklyPlayerStats(w);
  console.log("Getting Weekly Scores...")
  getWeeklyScores();
}

function getService() {
  return OAuth2.createService('Yahoo')
  // Set the endpoint URLs.
  .setAuthorizationBaseUrl('https://api.login.yahoo.com/oauth2/request_auth')
  .setTokenUrl('https://api.login.yahoo.com/oauth2/get_token')

  // Set the client ID and secret.
  .setClientId(GLOBALS.CLIENT_ID)
  .setClientSecret(GLOBALS.CLIENT_SECRET)

  // Set the name of the callback function that should be invoked to complete
  // the OAuth flow.
  .setCallbackFunction('authCallback')

  // Set the property store where authorized tokens should be persisted.
  .setPropertyStore(PropertiesService.getUserProperties());
}

/**
* Handles the OAuth callback.
*/
function authCallback(request) {
  let service = getService();
  let authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Success!');
  } else {
    return HtmlService.createHtmlOutput('Denied.');
  }
}

/**
 * Logs the redict URI to register.
 */
function logRedirectUri() {
  Logger.log(OAuth2.getRedirectUri());
}

/**
* Reset the authorization state, so that it can be re-tested.
*/
function reset() {
  getService().reset();
}
/*****
 * Open Sidebar and add authorization link
 ****/
function showSidebar() {
  let service = getService();
    let authorizationUrl = service.getAuthorizationUrl();
    let template = HtmlService.createTemplate(
        '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
        'Reopen the sidebar when the authorization is complete.');
    template.authorizationUrl = authorizationUrl;
    let page = template.evaluate();
    SpreadsheetApp.getUi().showSidebar(page)
    //DocumentApp.getUi().showSidebar(page);
  
}

/*
* Gets the year ID (game_key) from Yahoo and sets it to a script property
* This yearID changes every year
*/
function setGameKey(){
  let service = getService();
    
  let url = "https://fantasysports.yahooapis.com/fantasy/v2/game/nfl"
  try{
      let response = UrlFetchApp.fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + service.getAccessToken()
        }
      });
      let xml = response.getContentText();
      let json = XML_to_JSON(xml);
      let gameKey = json.fantasy_content.game.game_key.Text;
      // Set a property in each of the three property stores.
      let scriptProperties = PropertiesService.getScriptProperties();
      scriptProperties.setProperty('yearId', gameKey);

      scriptProperties = PropertiesService.getScriptProperties()
      let yearId = scriptProperties.getProperty('yearId')
      console.log(yearId)
    }
  catch(e){
    Logger.log(e)
  }
}

function checkGameKey(){
  try{
    let gameKey;
    let scriptProperties = PropertiesService.getScriptProperties();
    if(!scriptProperties.getProperty('yearId')){
      gameKey = setGameKey()
    }
    else{
      gameKey = scriptProperties.getProperty('yearId')
    }
    return gameKey
  }
  catch(e){
    Logger.log(e)
  }

}
