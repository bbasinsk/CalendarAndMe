export default class GoogleAuth {

    constructor() {
        // Client ID and API key from the Developer Console
        this.CLIENT_ID = '618010641814-20gpkng07j1juhg1k98c3jlr04dfc22i.apps.googleusercontent.com';
        this.API_KEY = 'AIzaSyATRTervSJWp5ybNMN7uZUzmC4JSG9i6hI';

        // Array of API discovery doc URLs for APIs used by the quickstart
        this.DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

        // Authorization scopes required by the API; multiple scopes can be
        // included, separated by spaces.
        this.SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
    }

    /**
    *  On load, called to load the auth2 library and API client library.
    */
    handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    /**
    *  Initializes the API client library and sets up sign-in state
    *  listeners.
    */
    initClient() {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(() => {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

            // Handle the initial sign-in state.
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            authorizeButton.onclick = handleAuthClick;
            signoutButton.onclick = handleSignoutClick;
        });
    }

    /**
    *  Called when the signed in status changes, to update the UI
    *  appropriately. After a sign-in, the API is called.
    */
    updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            authorizeButton.style.display = 'none';
            signoutButton.style.display = 'block';
            listUpcomingEvents();
        } else {
            authorizeButton.style.display = 'block';
            signoutButton.style.display = 'none';
        }
    }

    /**
    *  Sign in the user upon button click.
    */
    handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }

    /**
    *  Sign out the user upon button click.
    */
    handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }

    /**
    * Append a pre element to the body containing the given message
    * as its text node. Used to display the results of the API call.
    *
    * @param {string} message Text to be placed in pre element.
    */
    appendPre(message) {
        let pre = document.getElementById('content');
        let textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
    }

    /**
    * Print the summary and start datetime/date of the next ten events in
    * the authorized user's calendar. If no events are found an
    * appropriate message is printed.
    */
    listUpcomingEvents() {
        gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 1000,
            'orderBy': 'startTime'
        }).then(function (response) {
            let events = response.result.items;
            console.log(events);
            appendPre('Upcoming events:');

            if (events.length > 0) {
                for (i = 0; i < events.length; i++) {
                    let event = events[i];
                    let when = event.start.dateTime;
                    if (!when) {
                        when = event.start.date;
                    }
                    appendPre(event.summary + ' (' + when + ')')
                }
            } else {
                appendPre('No upcoming events found.');
            }
        });
    }
}