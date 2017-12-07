import React, { Component } from 'react';

import NewGroupDialog from './NewGroupDialog';
import JoinGroupDialog from './JoinGroupDialog';

//Material UI Components
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import ContentAddCircle from 'material-ui/svg-icons/content/add-circle';


export default class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newGroupDialogOpen: false,
      joinGroupDialogOpen: false
    }
  }

  handleNewGroupDialogOpen() {
    this.setState({ newGroupDialogOpen: true });
  };

  handleNewGroupDialogClose() {
    this.setState({ newGroupDialogOpen: false });
  };

  handleJoinGroupDialogOpen() {
    this.setState({ joinGroupDialogOpen: true });
  };

  handleJoinGroupDialogClose() {
    this.setState({ joinGroupDialogOpen: false });
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
            onClick={() => this.handleNewGroupDialogOpen()}
          />
          <ListItem
            primaryText="Join a group"
            rightIcon={<ContentAddCircle />}
            onClick={() => this.handleJoinGroupDialogOpen()}
          />
        </List>
        <NewGroupDialog
          handleClose={() => this.handleNewGroupDialogClose()}
          handleOpen={() => this.handleNewGroupDialogOpen()}
          open={this.state.newGroupDialogOpen}
        />
        <JoinGroupDialog
          handleClose={() => this.handleJoinGroupDialogClose()}
          handleOpen={() => this.handleJoinGroupDialogOpen()}
          open={this.state.joinGroupDialogOpen}
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

