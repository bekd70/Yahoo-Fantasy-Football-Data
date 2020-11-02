function testUrl() {
  var service = getService();
  //var service = OAuth2.createService('Yahoo.com');
  if (service.hasAccess()) {
   // var url = 'https://fantasysports.yahooapis.com/fantasy/v2/team/399.l.' + GLOBALS.leagueId + '.t.2/roster';
    //var url = 'https://fantasysports.yahooapis.com/fantasy/v2/league/399.l.' + GLOBALS.leagueId + '/players;player_keys=399.p.27560,399.p.27581/stats;type=week;week=1';
    //var url ='https://fantasysports.yahooapis.com/fantasy/v2/team/399.l.' + GLOBALS.leagueId + '.t.2/roster;type=week;week=1/players';
    //var url = 'https://fantasysports.yahooapis.com/fantasy/v2/league/399.l.' + GLOBALS.leagueId + '/settings';
    //var url ='https://fantasysports.yahooapis.com/fantasy/v2/team/399.l.' + GLOBALS.leagueId + '.t.1/roster;type=week;week=8/players';
    var url = 'https://fantasysports.yahooapis.com/fantasy/v2/league/399.l.' + GLOBALS.leagueId + '/players;player_keys=399.p.32671,399.p.29288,399.p.30197,399.p.30218,399.p.31919/stats;type=week;week=7'
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
    //Logger.log(response)
    var xml = response.getContentText();
    var json = XML_to_JSON(xml);
    //var keys = Object.keys(json.fantasy_content.team);
    Logger.log(JSON.stringify(json))
   
  }
    
  else{
    showSidebar();
  }
  
}