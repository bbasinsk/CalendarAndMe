import * as Keys from './gAuth/Keys';
let gapi = window.gapi;

// Client ID and API key from the Developer Console
var CLIENT_ID = Keys.CLIENT_ID;
var API_KEY = Keys.API_KEY;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

export var myEvents = [];

/**
 *  On load, called to load the auth2 library and API client library.
 */
export function handleClientLoad() {
  if (!gapi.auth2) { //if a google account is not logged in
    
    gapi.load('client:auth2', initClient);
  }
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function (promise) {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    handleAuthClick();
    return promise;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) { 
    getUpcomingEvents();
  }
}

/**
 *  Sign in the user upon button click.
 */
export function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function getUpcomingEvents() {
  myEvents = [];

  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 1000,
    'orderBy': 'startTime'
  }).then((response) => {
    let events = response.result.items;
   
    if (events.length > 0) {
      for (let i = 0; i < events.length; i++) {
        let event = events[i];
        myEvents.push(event);
      }
    } else {
      myEvents = null;
    }
  });

  return myEvents;
}
