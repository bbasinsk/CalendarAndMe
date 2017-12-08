import React, { Component } from 'react';

import NewGroupDialog from './NewGroupDialog';
import JoinGroupDialog from './JoinGroupDialog';

//Material UI Components
import { List, ListItem, makeSelectable } from 'material-ui/List';
import PropTypes from 'prop-types';
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

  handleGroupClick(groupKey) {
    this.props.updateGroupEvents(groupKey);
  }

  render() {
    //converts groups into an array of group components

    let groups = this.props.groups;

    let val = 0;
    let groupList = (
      <SelectableList defaultValue={1}>
        {groups.map(group => {
          val = val + 1;
          let avatarSrc = group.imgURL || 'https://www.drupal.org/files/issues/default-avatar.png';
          return (
            React.Children.toArray([
              <ListItem 
                value={val} 
                leftAvatar={<Avatar src={avatarSrc} />}
                primaryText={group.name}
                onClick={() => this.handleGroupClick(group.key)}
              />
            ])
          )
        })}
      </SelectableList>
    );

    return (
      <div>
        <List>
          <Subheader>My Groups</Subheader>
          {groupList}
          
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

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
   return class SelectableList extends Component {
      static propTypes = {
         children: PropTypes.node.isRequired,
         defaultValue: PropTypes.number.isRequired,
      };

      componentWillMount() {
         this.setState({
            selectedIndex: this.props.defaultValue,
         });
      }

      handleRequestChange = (event, index) => {
         this.setState({
            selectedIndex: index,
         });
      };

      render() {
         return (
            <ComposedComponent
               value={this.state.selectedIndex}
               onChange={this.handleRequestChange}
            >
               {this.props.children}
            </ComposedComponent>
         );
      }
   };
}

SelectableList = wrapState(SelectableList);

