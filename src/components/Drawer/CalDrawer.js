import React, { Component } from 'react';

import Groups from './Groups/Groups';
import AddCalendarDialog from './AddCalendarDialog';
import GetGroupKey from './GetGroupKey';

//Material UI Components
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import Subheader from 'material-ui/Subheader';
import ActionEvent from 'material-ui/svg-icons/action/event';
import Cached from 'material-ui/svg-icons/action/cached';
import ActionSearch from 'material-ui/svg-icons/action/search'
import {cyan500} from 'material-ui/styles/colors';

import firebase from 'firebase';


export default class CalDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      addCalendarDialogOpen: false,
      groupKeyDialogOpen: false
    };
  }

  componentDidMount() {
    // Gets a reference to the firebase events so that when they change, 
    // they also change the current state.
    this.groupsRef = firebase.database().ref('groups');
    this.updateGroupKeys();
  }

  componentWillReceiveProps(props) {
    this.updateGroupKeys(props.myGroups);
  }

  componentWillUnmount() {
    // Closes the listener when a client is about to leave
    this.groupsRef.off();
  }

  updateGroupKeys(myGroupsProp) {
  
    let groupKeys = [];
    if (myGroupsProp) {
      let groupsNames = Object.keys(myGroupsProp);
      groupKeys = groupsNames.map((groupName) => {
        return myGroupsProp[groupName].key;
      });
    }
    
    let myGroups = [];
    for (let i = 0; i < groupKeys.length; i++) {
      let key = groupKeys[i];
      
      let group;
      this.groupsRef.child(key).on('value', (snapshot) => { 
        
        if (snapshot.hasChild('name')) {
          group = snapshot.val();
          group.key = key;
        }
        if (group) {
          myGroups.push(group);
          this.setState({ groups: myGroups });
        }
      });
    }

    // this.setState({ groups: myGroups });
  }

  handleAddCalendarDialogOpen() {
    this.setState({ addCalendarDialogOpen: true });
  };

  handleAddCalendarDialogClose() {
    this.setState({ addCalendarDialogOpen: false });
    window.gapi.auth2.getAuthInstance().signOut();
  };

  handleGroupKeyDialogOpen() {
    this.setState({ groupKeyDialogOpen: true });
  };

  handleGroupKeyDialogClose() {
    this.setState({ groupKeyDialogOpen: false });
  };

  render() {
    
    return (
      <div>
        <Groups 
          groups={this.state.groups} 
          updateGroupEvents={(key) => this.props.updateGroupEvents(key)}
        />

        <Divider />

        <List>
          <Subheader>My Calendars</Subheader>
          <ListItem
            leftIcon={<ActionEvent color={cyan500}/>} 
            primaryText="G Calendar"
            rightToggle={<Toggle 
                onClick={() => this.props.togglePersonalCal()}
                defaultToggled={true}
              />}
          />
          <ListItem
            primaryText="Update My Calendar"
            rightIcon={<Cached />}
            onClick={() => this.handleAddCalendarDialogOpen()}
          />
        </List>
        <AddCalendarDialog
          handleClose={() => this.handleAddCalendarDialogClose()}
          handleOpen={() => this.handleAddCalendarDialogOpen()}
          open={this.state.addCalendarDialogOpen}
          addPersonalCalendar={() => this.props.addPersonalCalendar()}
        />
        <Divider />
        <List>
          <Subheader>Share My Group</Subheader>
          <ListItem
          primaryText="Get Group Key"
          rightIcon={<ActionSearch />}
          onClick={() => this.handleGroupKeyDialogOpen()}
        />
        </List>
        <GetGroupKey 
          groupKey={this.props.groupKey}
          open={this.state.groupKeyDialogOpen}
          handleClose={() => this.handleGroupKeyDialogClose()}
          handleOpen={() => this.handleGroupKeyDialogOpen()}
          currentGroupName={this.props.currentGroupName}
          handleCopiedOpen={() => this.props.handleCopiedOpen()}
        />
      </div>
    );
  }
}