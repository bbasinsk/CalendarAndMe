import React, { Component } from 'react';

//Material UI Components
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import ContentAddCircle from 'material-ui/svg-icons/content/add-circle'

import firebase from 'firebase';


export default class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false
    }
  }

  handleDialogOpen() {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose() {
    this.setState({ dialogOpen: false });
  };

  render() {
    //converts groups into an array of group components
    let groupElements = '';
    if (this.props.groups) {
      let groupIds = Object.keys(this.props.groups);
      groupElements = groupIds.map((id) => {
        let group = this.props.groups[id];

        return (<GroupItem
          key={id}
          avatarSrc={group.imgURL || 'https://www.drupal.org/files/issues/default-avatar.png'}
          groupName={group.name}
        />);
      });
    }


    return (
      <div>
        <List>
          <Subheader>My Groups</Subheader>
          {groupElements}
          {/* <Divider inset={true} /> */}
          <ListItem
            primaryText="Create a group"
            rightIcon={<ContentAddCircle />}
            onClick={() => this.handleDialogOpen()}
          />
        </List>
        <NewGroupDialog
          handleClose={() => this.handleDialogClose()}
          handleOpen={() => this.handleDialogOpen()}
          open={this.state.dialogOpen}
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

class NewGroupDialog extends Component {
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
    })

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

