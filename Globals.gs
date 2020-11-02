/*************
* 
* Replace the GLOBALS variables to match your environment. 
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

var GLOBALS = {
  sheetId: "{YOUR SHEET ID}",
  CLIENT_ID: '{YOUR YAHOO CLIENT ID}',
  CLIENT_SECRET: '{YOUR YAHOO CLIENT SECRET}',
  teamCount: 14,
  leagueId: '{YOUR YAHOO FANTASY SPORTS LEAGUE ID}',
  totalWeeks:16
}

var Logger = BetterLog.useSpreadsheet(GLOBALS.sheetId);

/**
 * Initializes the League data
 */
function initializeLeagueData() {
  getLeagueData();
  getRosterData();
  getStatKeys();
  getTeams();
  
}

/**
 * Gets the Weekly data for your teams and players
 */
function getWeeklyData() {
  var ss = SpreadsheetApp.openById(GLOBALS.sheetId);
  var menuSheet = ss.getSheetByName("Menu")
  var w = menuSheet.getRange("B8").getValue();
  getMatchups(w);
  getWeeklyPlayerStats(w);
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
  var service = getService();
  var authorized = service.handleCallback(request);
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
