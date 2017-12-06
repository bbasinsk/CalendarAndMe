import React, { Component } from 'react';
import { css } from 'aphrodite';
import { Redirect } from 'react-router-dom';

import Drawer from 'material-ui/Drawer';

import GroupList from './GroupList';
import NavBar from './NavBar';

import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import firebase from 'firebase/app';
import moment from 'moment';

import styles from '../styles/CalendarStyle';

class Calendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [],
      drawerOpen: true,
      displayPersonalCal: true
    };
  }

  componentDidMount() {
    // Gets a reference to the firebase events so that when they change, 
    // they also change the current state.
    if (firebase.auth().currentUser) {
      let uid = firebase.auth().currentUser.uid;
      this.eventsRef = firebase.database().ref('users/' + uid + '/groups/personal/events/');
      this.eventsRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          this.setState({ events: snapshot.val() })
        }
      });
    }
  }

  componentWillUnmount() {
    // Closes the listener when a client is about to leave
    if (this.eventsRef)
      this.eventsRef.off();
  }

  togglePersonalCal() {
    this.setState({
      displayPersonalCal: !this.state.displayPersonalCal
    });
  }

  render() {
    if (!this.props.currentUser) {
      return (
        <Redirect to="/landing" />
      );
    }

    //converts events into an array
    let eventIds = Object.keys(this.state.events);
    let events = eventIds.map((id) => {
      let event = {};
      event.title = this.state.events[id].summary;
      event.start = this.state.events[id].start.dateTime;
      event.end = this.state.events[id].end.dateTime;
      event.id = id;
      return event;
    });



    const mainContentClassName = css(
      styles.mainContent,
      this.state.drawerOpen && styles.leftMargin
    );

    BigCalendar.setLocalizer(
      BigCalendar.momentLocalizer(moment)
    );

    for (let item of events) {
      item.end = new Date(item.end);
      item.start = new Date(item.start);
    }

    let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

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

            <GroupList togglePersonalCal={() => this.togglePersonalCal()} />

          </Drawer>
        </div>

        <main className={mainContentClassName} >
          <BigCalendar
            {...this.props}
            events={this.state.displayPersonalCal ? events : []}
            views={allViews}
            step={60}
            defaultDate={new Date(2017, 12, 1)}
          />
        </main>

      </div>
    );
  }
}

export default Calendar;
