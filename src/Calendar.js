import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import firebase from 'firebase/app';

class Calendar extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      events: {}, 
      drawerOpen: false
    };
  }

  componentDidMount() {
    // Gets a reference to the firebase events so that when they change, 
    // they also change the current state.

    this.eventsRef = firebase.database().ref('events');
    this.eventsRef.on('value', (snapshot) => {
      this.setState({ events: snapshot.val() })
    });
  }

  componentWillUnmount() {
    // Closes the listener when a client is about to leave
    this.eventsRef.off();
  }

  handleDrawerToggle = () => this.setState({drawerOpen: !this.state.drawerOpen});

  render() {
    const mainContentStyle = {  transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)' };
    if (this.state.drawerOpen) {
      mainContentStyle.marginLeft = 256;
    }
    const drawerStyle = {
      top: '64px',
      position: 'fixed'
    };

    let eventIds = Object.keys(this.state.events);
    let events = eventIds.map((id) => {
      let event = this.state.events[id];
      event.id = id;
      return event;
    });

    return (
      <div>
        <AppBar 
            title={'Calendar & Me'}
            onLeftIconButtonTouchTap={this.handleDrawerToggle}
        />

        <div className={'drawer'} style={drawerStyle} >
          <Drawer open={this.state.drawerOpen} style={drawerStyle} >

            <div style={{height: '64px'}} ></div> {/* Creates space past the app bar */}
            <List>
              <ListItem primaryText="My first group" />
              <ListItem primaryText="My Second group" />
              <ListItem primaryText="My third group" />
            </List>
            <Divider />
            <List>
              <ListItem primaryText="Create Group" />
            </List>
          </Drawer>
        </div>
        
        
        <main style={mainContentStyle} >
        
          <p>My events</p>
          <EventList
            events={events}
          />
        </main>
        
      </div>
    );
  }
}

class EventList extends Component {
  render() {

    if (this.props.events == null) {
      return (
        <p>You don't have any events</p>
      );
    }

    //Create the array of event items using <Event> Components
    let eventItemsArray = this.props.events.map((event) => {
      return (<Event
        key={event.id}
        summary={event.summary} />
      );
    });

    return (
      <ol>
        {eventItemsArray}
      </ol>
    );
  }
}

class Event extends Component {

  render() {
    return (
      <li>
        {this.props.summary}
      </li>
    );
  }
}

export default Calendar;
