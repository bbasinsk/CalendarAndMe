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
                this.props.addPersonalCalendar();
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