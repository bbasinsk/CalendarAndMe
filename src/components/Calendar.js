import React, { Component } from 'react';
import { css } from 'aphrodite';
import { Redirect } from 'react-router-dom';

import Drawer from 'material-ui/Drawer';

import GroupList from './GroupList';
import NavBar from './NavBar';

import firebase from 'firebase/app';

import styles from '../styles/CalendarStyle';

class Calendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: {},
      drawerOpen: true
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

  render() {
    if (!this.props.currentUser) {
      return(
        <Redirect to="/landing"/>
      );
    }

    //converts events into an array
    let eventIds = Object.keys(this.state.events);
    let events = eventIds.map((id) => {
      let event = this.state.events[id];
      event.id = id;
      return event;
    });

    const mainContentClassName = css(
      styles.mainContent,
      this.state.drawerOpen && styles.leftMargin
    );

    return (
      <div>
        <NavBar
          title={'Calendar & Me'}
          handleSignOut={() => this.props.handleSignOut()}
        />

        <div className={'drawer'} style={{ top: '64px', position: 'fixed' }} > {/* Pushes drawer below AppBar */}
          <Drawer open={this.state.drawerOpen} >

            {/* Pushes drawer content down so that the appbar doesn't cover it */}
            <div style={{ height: '64px' }} ></div>

            <GroupList addPersonalCalendar={() => this.props.addPersonalCalendar()} />

          </Drawer>
        </div>


        <main className={mainContentClassName} >
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
      return (<Event key={event.id} summary={event.summary} />)
    });

    return (
      <ul>
        {eventItemsArray}
      </ul>
    );
  }
}

class Event extends Component {
  render() {
    return (
      <li>{this.props.summary}</li>
    );
  }
}

export default Calendar;
