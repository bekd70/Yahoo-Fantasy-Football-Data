/******
 * This is used to test various urls and logs the data to the Logger
 * It is not needed, but here to test things
 */
function testUrl() {
  let teamKey = `${yearId}.l.${GLOBALS.leagueKey}.t.2`
  let service = getService();
  if (service.hasAccess()) {
    let response
    //let url = "https://fantasysports.yahooapis.com/fantasy/v2/leagues"
    //let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${GLOBALS.leagueKey}/standings;week=1`
    //let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}`;
    //let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster;type=week;week=2/players`
    //let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${yearId}.l.${GLOBALS.leagueKey}/players;player_keys=${yearId}.p.27560/stats;type=week;week=1`;
    //let url = `https://fantasysports.yahooapis.com/fantasy/v2/player/stats;player_keys=${yearId}.p.27560,${yearId}.p.24788;weeks=1`
    //let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${yearId}.l.${GLOBALS.leagueKey}/draftresults`
    //let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/matchups;weeks=1`;
    let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${yearId}.l.${GLOBALS.leagueId}.t.2/matchups;weeks=2`
    //let url =`https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/teams`;
    //let url = `https://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys=${teamKey}/matchups;type=week;week=1`;
    //let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster;type=week;week=2/players`;
    //let url = `https://fantasysports.yahooapis.com/fantasy/v2/player/stat_categories`;
    //let url =`https://fantasysports.yahooapis.com/fantasy/v2/team/${yearId}.l.${GLOBALS.leagueKey}.t.1/roster;type=week;week=8/players`;
    //let url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${yearId}.l.${GLOBALS.leagueKey}/players;player_keys=${yearId}.p.32671,${yearId}.p.29288,${yearId}.p.30197,${yearId}.p.30218,${yearId}.p.31919/stats;type=week;week=7`
    //let url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/metadata`
    try{
      response = UrlFetchApp.fetch(url, {
        muteHttpExceptions: true,
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
   
  }
  else{
    showSidebar();
  }
  
}