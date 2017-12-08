import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import firebase from 'firebase';

export default class JoinGroupDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  joinGroup(groupKey) {
    let currentUser = firebase.auth().currentUser;
    let personalEvents = [];
    this.userGroupsRef = firebase.database().ref('users/' + currentUser.uid + '/groups/');
    this.groupToJoinRef = firebase.database().ref('groups/' + groupKey);

    //Get group name
    let groupName = '';
    this.groupToJoinRef.child('name').on('value', (snapshot) => {
      groupName = snapshot.val();
    });

    //Add group and key to user
    //                       |---- groups
    this.userGroupsRef.child(groupName + '/key').set(groupKey);

    this.userGroupsRef.child('personal/events/').on('value', (snapshot) => {
      personalEvents = snapshot.val();
      console.log(personalEvents);

      this.groupToJoinRef.child('personalEvents/' + currentUser.uid).set(personalEvents);
      this.groupToJoinRef.child('users/' + currentUser.uid).set(currentUser.displayName);
    });

    this.userGroupsRef.off();
    this.groupToJoinRef.off();
  }

  handleTextInput(event) {
    //specify which field to change in the stage
    let newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <Dialog
          title="Join a group"
          actions={[
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={() => this.props.handleClose()}
            />,
            <FlatButton
              label="Join"
              primary={true}
              onClick={() => {
                this.joinGroup(this.state.groupKey);
                this.props.handleClose();
              }}
            />,
          ]}
          modal={false}
          open={this.props.open}
          onRequestClose={this.handleClose}
        >
          Enter a name for your new group.
            <br />
          <TextField
            floatingLabelText="Group Key"
            type="groupKey"
            name="groupKey"
            onChange={(event) => this.handleTextInput(event)}
          />
        </Dialog>
      </div>
    );
  }
}

