import React, { Component } from 'react';

//Material UI Components
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import ActionInfo from 'material-ui/svg-icons/action/info';
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
            groups: []
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
        this.eventsRef.off();
    }


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
                    <Subheader rightIcon={<ActionInfo />} >My Groups</Subheader>
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
                </List>
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