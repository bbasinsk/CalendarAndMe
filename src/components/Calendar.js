import React, { Component } from 'react';
import { css } from 'aphrodite';
import { Redirect } from 'react-router-dom';

import Drawer from 'material-ui/Drawer';

import CalDrawer from './Drawer/CalDrawer';
import NavBar from './NavBar';

import firebase from 'firebase/app';

import styles from '../styles/CalendarStyle';
import $ from 'jquery';
import 'fullcalendar/dist/fullcalendar.css';
import 'fullcalendar/dist/fullcalendar.js';


export default class Calendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      myEvents: [],
      groupEvents: {},
      drawerOpen: true,
      displayPersonalCal: true
    };
  }

  componentDidMount() {
    if (firebase.auth().currentUser) {
      let uid = firebase.auth().currentUser.uid;
      this.myEventsRef = firebase.database().ref('users/' + uid + '/groups/personal/events/');
      this.myEventsRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          this.setState({ myEvents: snapshot.val() })
        }
      });

      console.log(uid);

      this.myUserGroupsRef = firebase.database().ref('users/' + uid + '/groups');
      this.myUserGroupsRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          let myUserGroups = snapshot.val()
          delete myUserGroups.personal;

          // get groupKeys from each group in myUserGroups users
          let groupNames = Object.keys(myUserGroups);
          console.log(groupNames);

          //If the user is a part of a group, set state.groupEvents = the group events
          if (myUserGroups[groupNames[0]]) {
            let groupKey = myUserGroups[groupNames[0]].key;

            this.myGroupRef = firebase.database().ref('groups/' + groupKey + '/personalEvents');
            this.myGroupRef.on('value', (snapshot) => {
              this.setState({ groupEvents: snapshot.val() });
            });
          }
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
    let myEvents = [];
    if (this.state.displayPersonalCal) {
      let eventIds = Object.keys(this.state.myEvents);
      myEvents = eventIds.map((id) => {
        let event = {};
        event.type = 'personalCal'
        event.title = this.state.myEvents[id].summary;
        event.start = new Date(this.state.myEvents[id].start.dateTime);
        event.end = new Date(this.state.myEvents[id].end.dateTime);
        event.color = '#00838F';
        event.rendering = '';
        event.id = id;
        return event;
      });
    }
    console.log(myEvents[0]);

    let allPersonalGroupEvents = [];
    let groupUsersIDs = Object.keys(this.state.groupEvents);
    for (let userID of groupUsersIDs) {
      let userGroupEvents = this.state.groupEvents[userID];
      let eventIds = Object.keys(userGroupEvents);
      let events = eventIds.map((id) => {
        let event = {};
        event.type = 'personalGroup'
        event.start = new Date(userGroupEvents[id].start.dateTime);
        event.end = new Date(userGroupEvents[id].end.dateTime);
        event.color = '#43A047';
        event.rendering = 'background';
        // event.id = id;
        return event;
      });
      allPersonalGroupEvents = allPersonalGroupEvents.concat(events);
    }
    console.log(allPersonalGroupEvents[0]);

    if (myEvents[0] && allPersonalGroupEvents[0]) {
      let mEvents = [myEvents[0], myEvents[1]];
      let pEvents = [allPersonalGroupEvents[0], allPersonalGroupEvents[1]];

      let concated = mEvents.concat(pEvents);
      console.log(concated);
    }


    // console.log('All personal Group events: ' + allPersonalGroupEvents[0].type);
    // console.log('My Events: ' + myEvents[0].type);

    let publicGroupEvents = [];

    // let eventsForCalendar = [...myEvents, ...allPersonalGroupEvents, ...publicGroupEvents];
    let eventsForCalendar = myEvents.concat(allPersonalGroupEvents, publicGroupEvents);

    console.log(eventsForCalendar);


    const mainContentClassName = css(
      styles.mainContent,
      this.state.drawerOpen && styles.leftMargin
    );

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

          <FullCalendar myEvents={eventsForCalendar} groupPersonalEvents={allPersonalGroupEvents} />

        </main>

      </div>
    );
  }
}

class FullCalendar extends Component {
  render() {
    return <div id="calendar"></div>;
  }

  updateCalendar() {
    $('#calendar').fullCalendar('destroy');
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'agendaWeek,agendaDay'
      },
      events: this.props.myEvents,
      editable: true,
      defaultView: 'agendaWeek',
      droppable: true, // this allows things to be dropped onto the calendar
      drop: function () {
        // is the "remove after drop" checkbox checked?
        if ($('#drop-remove').is(':checked')) {
          // if so, remove the element from the "Draggable Events" list
          $(this).remove();
        }
      }
    });
    // $('#calendar').fullCalendar( 'renderEvents', this.props.groupPersonalEvents );
  }

  componentDidMount() {
    this.updateCalendar();
  }

  componentDidUpdate() {
    this.updateCalendar();
  }
}

