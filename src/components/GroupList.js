import React, { Component } from 'react';

//Material UI Components
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import ContentAddCircle from 'material-ui/svg-icons/content/add-circle'

//Firebase
import firebase from 'firebase/app';

// import { handleClientLoad, handleAuthClick, myEvents } from '../GCalAuth';
import * as Keys from '../gAuth/Keys';
let gapi = window.gapi;


export default class GroupList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      dialogOpen: false
    };
  }

  componentDidMount() {
    // Gets a reference to the firebase events so that when they change, 
    // they also change the current state.
    this.groupsRef = firebase.database().ref('groups');
    this.groupsRef.on('value', (snapshot) => {
      this.setState({ groups: snapshot.val() })
    });
  }

  componentWillUnmount() {
    // Closes the listener when a client is about to leave
    this.groupsRef.off();
  }

  handleDialogOpen() {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose() {
    this.setState({ dialogOpen: false });
  };

  render() {

    //converts groups into an array of group components
    let groupIds = Object.keys(this.state.groups);
    let groupElements = groupIds.map((id) => {
      let group = this.state.groups[id];

      return (<GroupItem
        key={id}
        avatarSrc={group.icon}
        groupName={group.name}
      />);
    });

    return (
      <div>
        <List>
          <Subheader>My Groups</Subheader>
          {groupElements}
          {/* <Divider inset={true} /> */}
          <ListItem primaryText="Create a group" rightIcon={<ContentAddCircle />} />
        </List>

        <Divider />

        <List>
          <Subheader>My Calendars</Subheader>
          <ListItem
            leftAvatar={<Avatar icon={<ActionAssignment />} />}
            primaryText="Google Calendar"
            rightToggle={<Toggle />}
          />
          <ListItem
            primaryText="Add my calendar"
            rightIcon={<ContentAddCircle />}
            onClick={() => this.handleDialogOpen()}
          />
        </List>
        <AddCalendarDialog
          handleClose={() => this.handleDialogClose()}
          handleOpen={() => this.handleDialogOpen()}
          open={this.state.dialogOpen}
          addPersonalCalendar={() => this.props.addPersonalCalendar()}
        />
      </div>
    );
  }
}


class GroupItem extends Component {
  render() {
    return (
      <ListItem
        leftAvatar={<Avatar src={this.props.avatarSrc} />}
        primaryText={this.props.groupName}
      // secondaryText="Jan 9, 2014"
      />
    );
  }
}


class AddCalendarDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    }
  }

  getGCalendar() {
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
      this.listenForAuthStatusChange();
    });
  }

  listenForAuthStatusChange() {
    //  // Listen for sign-in state changes.
     gapi.auth2.getAuthInstance().isSignedIn.listen((listen) => {
      this.updateSigninStatus();
    });

    // Handle the initial sign-in state.
    this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    gapi.auth2.getAuthInstance().signIn();
  }

  updateSigninStatus(isSignedIn) {
    console.log('updating sign in status');
    if (isSignedIn) { 
      this.getUpcomingEvents();
    }
  }

  getUpcomingEvents() {
    let myEvents = [];
  
    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 1000,
      'orderBy': 'startTime'
    }).then((response) => {
      let events = response.result.items;

      let uid = firebase.auth().currentUser.uid;
      let eventsRef = firebase.database().ref('users/' + uid + '/groups/personal/events/');
     
      if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          console.log('event: ' + i);

          let event = events[i];
          eventsRef.push(event)
            .catch((error) => console.log(error));
        }
      } else {
        myEvents = null;
      }
      console.log('events pushed');
      gapi.auth2.getAuthInstance().signOut(); //sign out of gapi
    });
    this.setState({events: myEvents})
  

    return myEvents;
  }

  render() {
    return (
      <div>
        <Dialog
          title="Dialog With Actions"
          actions={[
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={() => this.props.handleClose()}
            />,
            <FlatButton
              label="Submit"
              primary={true}
              onClick={() => {
                this.getGCalendar();
                this.props.handleClose();
              }}
            />,
          ]}
          modal={false}
          open={this.props.open}
          onRequestClose={this.handleClose}
        >
          The actions in this window were passed in as an array of React objects.
          </Dialog>
      </div>
    );
  }
}

