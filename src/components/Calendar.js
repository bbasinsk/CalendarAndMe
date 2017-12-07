import React, { Component } from 'react';
import { css } from 'aphrodite';
import { Redirect } from 'react-router-dom';

import Drawer from 'material-ui/Drawer';

import CalDrawer from './Drawer/CalDrawer';
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
      myEvents: [],
      drawerOpen: true,
      displayPersonalCal: true
    };
  }

  componentDidMount() {
    // Gets a reference to the firebase events so that when they change, 
    // they also change the current state.
    if (firebase.auth().currentUser) {
      let uid = firebase.auth().currentUser.uid;
      this.myEventsRef = firebase.database().ref('users/' + uid + '/groups/personal/events/');
      this.myEventsRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          this.setState({ myEvents: snapshot.val() })
        }
      });
    }
  }

  componentWillUnmount() {
    // Closes the listener when a client is about to leave
    if (this.myEventsRef)
      this.myEventsRef.off();
  }

  togglePersonalCal() {
    this.setState({
      displayPersonalCal: !this.state.displayPersonalCal
    });
  }

  createGroupEvent(eventInfo) {
    console.log(eventInfo);
  }

  render() {
    if (!this.props.currentUser) {
      return (
        <Redirect to="/landing" />
      );
    }

    //converts events into an array
    let eventIds = Object.keys(this.state.myEvents);
    let myEvents = eventIds.map((id) => {
      let event = {};
      event.title = this.state.myEvents[id].summary;
      event.start = new Date(this.state.myEvents[id].start.dateTime);
      event.end = new Date(this.state.myEvents[id].end.dateTime);
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

    let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

    return (
      <div>
        <NavBar
          title={'Calendar & Me'}
          handleDrawerToggle={() => this.handleDrawerToggle()}
          handleSignOut={() => this.props.handleSignOut()}
        />


        <div className={'drawer'} style={{ top: '64px', position: 'fixed' }} > {/* Pushes drawer below AppBar */}
          <Drawer open={this.state.drawerOpen} >

            {/* Pushes drawer content down so that the appbar doesn't cover it */}
            <div style={{ height: '64px' }} ></div>

            <CalDrawer togglePersonalCal={() => this.togglePersonalCal()} />

          </Drawer>
        </div>


        <main className={mainContentClassName} >
          <BigCalendar
            {...this.props}
            selectable
            events={this.state.displayPersonalCal ? myEvents : []}
            views={allViews}
            step={60}
            defaultDate={new Date()}
            onSelectSlot={(slotInfo) => this.createGroupEvent(slotInfo)}
          />
        </main>

      </div>
    );
  }
}

export default Calendar;
