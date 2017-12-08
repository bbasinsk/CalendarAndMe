import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import firebase from 'firebase';

export default class NewGroupDialog extends Component {
    constructor(props) {
      super(props);
      this.state = {}
    }
  
    createNewGroup(groupName, imgURL) {
      this.groupEventsRef = firebase.database().ref('groups');
  
      this.newGroupRef = this.groupEventsRef.push({ name: groupName, imgURL: imgURL || '' });
  
      let groupID = this.newGroupRef.key;
  
      let currentUser = firebase.auth().currentUser;
      let personalEvents = [];
      this.userGroupsRef = firebase.database().ref('users/' + currentUser.uid + '/groups/');
      this.userGroupsRef.child(groupName).set({
        key: groupID
      });
  
      this.userGroupsRef.child('personal/events/').on('value', (snapshot) => {
        personalEvents = snapshot.val();
        this.newGroupRef.child('personalEvents/' + currentUser.uid).set(personalEvents);
        this.newGroupRef.child('users/' + currentUser.uid).set(currentUser.displayName);
      });
  
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
            title="Create a group"
            actions={[
              <FlatButton
                label="Cancel"
                primary={true}
                onClick={() => this.props.handleClose()}
              />,
              <FlatButton
                label="Create"
                primary={true}
                onClick={() => {
                  this.createNewGroup(this.state.groupName, this.state.imgURL);
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
              floatingLabelText="Group Name"
              type="groupName"
              name="groupName"
              onChange={(event) => this.handleTextInput(event)}
            /> <br />
            <TextField
              floatingLabelText="Image URL"
              type="imgURL"
              name="imgURL"
              onChange={(event) => this.handleTextInput(event)}
            />
          </Dialog>
        </div>
      );
    }
  }
  
  