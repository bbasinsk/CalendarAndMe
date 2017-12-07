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
              console.log(snapshot.val());
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
        event.title = this.state.myEvents[id].summary;
        event.start = new Date(this.state.myEvents[id].start.dateTime);
        event.end = new Date(this.state.myEvents[id].end.dateTime);
        event.color = '#03A9F4';
        event.id = id;
        return event;
      });
    }


    

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

          <FullCalendar events={myEvents} />

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
        right: 'month,agendaWeek,agendaDay'
      },
      events: this.props.events,
      editable: true,
      droppable: true, // this allows things to be dropped onto the calendar
      drop: function () {
        // is the "remove after drop" checkbox checked?
        if ($('#drop-remove').is(':checked')) {
          // if so, remove the element from the "Draggable Events" list
          $(this).remove();
        }
      }
    });
  }
  componentDidMount() {
    this.updateCalendar();
  }

  componentDidUpdate() {
    this.updateCalendar();
  }
}

