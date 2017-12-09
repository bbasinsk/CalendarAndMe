import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton';

//Firebase
import firebase from 'firebase/app';

// import { handleClientLoad, handleAuthClick, myEvents } from '../GCalAuth';
import * as Keys from '../../gAuth/Keys';
let gapi = window.gapi;

class AddCalendarDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    }
  }

  componentDidMount() {
    this.handleClientLoad();
  }

  handleClientLoad() {
    gapi.load('client:auth2', () => this.initClient());
  }

  initClient() {
    gapi.client.init({
      apiKey: Keys.API_KEY,
      clientId: Keys.CLIENT_ID,
      discoveryDocs: Keys.DISCOVERY_DOCS,
      scope: Keys.SCOPES
    }).then(() => {
      this.GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      this.GoogleAuth.isSignedIn.listen(() => this.updateSigninStatus());

      // // Listen for sign-in state changes.
      // gapi.auth2.getAuthInstance().isSignedIn.listen(() => this.updateSigninStatus());

      // // Handle the initial sign-in state.
      this.updateSigninStatus(this.GoogleAuth.isSignedIn.get());
    });
  }

  handleAuthClick() {
    this.GoogleAuth.signIn();
  }

  sendAuthorizedApiRequest() {
    if (this.isAuthorized) {
      this.getUpcomingEvents();

    } else {
      this.GoogleAuth.signIn();
    }
  }

  updateSigninStatus(isSignedIn) {
    if (this.GoogleAuth.isSignedIn.get()) {
      this.isAuthorized = true;

      this.sendAuthorizedApiRequest();
    } else {
      this.isAuthorized = false;
    }
  }

  getDate() {
    var d = new Date();
    d.setMonth( d.getMonth() - 1, d.getDate());
    return d;      
}

  getUpcomingEvents() {
    let myEvents = [];

    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (this.getDate()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 1000,
      'orderBy': 'startTime'
    }).then((response) => {
      let events = response.result.items;
      let myEvents = {};

      let uid = firebase.auth().currentUser.uid;
      let eventsRef = firebase.database().ref('users/' + uid + '/groups/personal/events/');

      if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {

          let event = events[i];
          myEvents[event.id] = event;
        }
      } else {
        myEvents = null;
      }
      eventsRef.set(myEvents).catch((error) => {
        console.log(error);
      });

      gapi.auth2.getAuthInstance().signOut(); //sign out of gapi
    });
    this.setState({ events: myEvents })


    return myEvents;
  }

  render() {
    return (
      <div>
        <Dialog
          title="Update Your Google Calendar"
          actions={[
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={() => this.props.handleClose()}
            />,
            <FlatButton
              label="Login"
              primary={true}
              onClick={() => {
                this.handleAuthClick();
                this.props.handleClose();
              }}
            />,
          ]}
          modal={false}
          open={this.props.open}
          onRequestClose={this.handleClose}
        >
          Click login to continue to update your Google Calendar.
            </Dialog>
      </div>
    );
  }
}

export default AddCalendarDialog;
