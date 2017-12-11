import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import firebase from 'firebase';

export default class JoinGroupDialog extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      errorMessage: ''
    }
  }

  joinGroup(groupKey) {
    let currentUser = firebase.auth().currentUser;
    let personalEvents = [];
    this.userGroupsRef = firebase.database().ref('users/' + currentUser.uid + '/groups/');
    this.groupToJoinRef = firebase.database().ref('groups/' + groupKey);

    //Get group name
    let groupName = '';
    this.groupToJoinRef.child('name').on('value', (snapshot) => {
      if (snapshot.val()) {
        groupName = snapshot.val();

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
        this.clearErrorMessage();
        this.props.handleClose();
      } else {
        this.setState({
          errorMessage: "No group was found under that group key."
        });
      }
    });
  }

  handleTextInput(event) {
    //specify which field to change in the stage
    let newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  clearErrorMessage() {
    //specify which field to change in the stage
    this.setState({
      errorMessage: ''
    });
  }

  render() {
    let errorMessage = '';
    if (this.state.errorMessage) {
      errorMessage = "No group was found under that group key."
    }
    return (
      <div>
        <Dialog
          title="Join a group"
          actions={[
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={() => {
                this.clearErrorMessage()
                this.props.handleClose()
              }}
            />,
            <FlatButton
              label="Join"
              primary={true}
              onClick={() => {
                this.joinGroup(this.state.groupKey);
                
              }}
            />,
          ]}
          modal={false}
          open={this.props.open}
          onRequestClose={this.handleClose}
        >
          Get the group key from a current member and enter it below.
            <br />
          <TextField
            floatingLabelText="Group Key"
            type="groupKey"
            name="groupKey"
            errorText= {errorMessage}
            onChange={(event) => this.handleTextInput(event)}
          />
        </Dialog>
      </div>
    );
  }
}

