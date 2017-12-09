import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { StyleSheet, css } from 'aphrodite';
import ReactGoogleAuth from 'react-google-auth';
import NavBar from './NavBar';

import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

//Firebase
import firebase from 'firebase/app';

import * as Keys from '../gAuth/Keys';

let gapi = window.gapi;


class GetEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      done: false
    }
  }

  componentDidMount() {
    this.getUpcomingEvents();
  }

  getUpcomingEvents() {
    let myEvents = [];

    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': new Date().toISOString(),
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

      this.props.googleLoggedIn();
      this.props.signOut();
    });
    this.setState({
      events: myEvents,
      done: true
    });

    return myEvents;
  }

  render() {
    if (this.state.done) {
      return <Redirect to="/" />
    }

    return (
      <div>
        Waiting for authorization...
      </div>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    textAlign: 'center'
  }
});


function Authentication(props) {
  return (
    <GetEvents
      signOut={() => props.onSignOutClick()}
      googleLoggedIn={() => props.googleLoggedIn()}
    />
  );
}

function Loader(props) {
  return <div>Loading...</div>;
}

function SignIn(props) {
  if (props.initializing) {
    return <div className="Text Text-emphasis">Initializing...</div>;
  }
  if (props.error) {
    console.log('Error', props.error);
    return <div className="Text Text-strong">Error!</div>;
  }
  return (
    <div>
      <NavBar signOut={() => props.handleSignOut()} title={'Calendar & Me'} />

      <div className={css(styles.center)}>
        <h2 className='auth-title'>Log In To Your Google Calendar</h2>
        <br />
        <RaisedButton
          label="Log in"
          primary={true}
          onClick={props.onSignInClick} />
      </div>

      {props.signingIn && <CircularProgress />}
    </div >
  );
}

export default ReactGoogleAuth({
  clientId: "102064689248-o3qlmteieihkoglbuune10e4gl6a85gq.apps.googleusercontent.com",
  discoveryDocs: Keys.DISCOVERY_DOCS,
  loader: Loader,
  scope: "https://www.googleapis.com/auth/calendar",
  signIn: SignIn
})(Authentication);
