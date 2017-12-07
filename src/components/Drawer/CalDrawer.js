import React, { Component } from 'react';

import Groups from './Groups';
import AddCalendarDialog from './AddCalendarDialog';

//Material UI Components
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import ContentAddCircle from 'material-ui/svg-icons/content/add-circle'

import firebase from 'firebase';


export default class CalDrawer extends Component {
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
    window.gapi.auth2.getAuthInstance().signOut();
  };

  render() {
    return (
      <div>
        <Groups groups={this.state.groups} />

        <Divider />

        <List>
          <Subheader>My Calendars</Subheader>
          <ListItem
            leftAvatar={<Avatar icon={<ActionAssignment/>} />} 
            primaryText="Google Calendar"
            rightToggle={<Toggle 
                onClick={() => this.props.togglePersonalCal()}
                defaultToggled={true}
              />}
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