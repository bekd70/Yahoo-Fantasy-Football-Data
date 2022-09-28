# Yahoo-Fantasy-Football-Data
Download Yahoo Fantasy Football data for your League to Google Apps Script

These scripts utilize OAuth2 to authenticate to Yahoo API to download the data from your league to a Google Spreadsheet.

Replace the GLOBALS variables to match your environment. 

This Script uses the OAuth2 and BetterLog libraries. OAuth2 is required but betterLog is not Comment out Logger =  BetterLog.useSpreadsheet(GLOBALS.sheetId); to use the standard Stackdriverlogging

Go to Resources and add the following two libraries:
* OAuth2: 1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF, https://github.com/googleworkspace/apps-script-oauth2
* BetterLog: 1DSyxam1ceq72bMHsE6aOVeOl94X78WCwiYPytKi7chlg4x5GqiNXSw0l

I have switched this repo to using [Clasp](https://github.com/google/clasp).  So all existing pages have had their extension changed from .gs to .js.

You will need to obtain Yahoo API client ID & Secretto use the scripts.  In the process of creating your API credentials you will need to enter https://script.google.com/macros/d/{YOUR SCRIPT ID}/usercallback into the redirect URi form. Once entered and you have entered the key and secret below, you will need to run initializeLeagueData() function.  You will get a URL in a sidebar that will open.  Click on the link to go to it.  It should return "Success".  Once that is done, you will not need to do it again.

You can view downloaded data at https://docs.google.com/spreadsheets/d/11pMlfiHCAtTR1qGK6recZliVYyybCQwX462l3681L5Q/edit?usp=sharing
