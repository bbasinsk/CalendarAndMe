import React, { Component } from 'react';
import { css } from 'aphrodite';
import { Redirect } from 'react-router-dom';

import Drawer from 'material-ui/Drawer';

import CalDrawer from './Drawer/CalDrawer';
import NavBar from './NavBar';
import CreateGroupEvent from './CreateGroupEvent';

import firebase from 'firebase/app';
import moment from 'moment';

import styles from '../styles/CalendarStyle';
import $ from 'jquery';
import 'fullcalendar/dist/fullcalendar.css';
import 'fullcalendar/dist/fullcalendar.js';


export default class Calendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      myEvents: [],
      personalGroupEvents: {},
      groupEvents: [],
      myGroupKeys: [],

      drawerOpen: true,
      displayPersonalCal: true,

      newEventDialogOpen: false,
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
        
          let groupKeys = groupNames.map((name) => {
            return myUserGroups[name].key;
          });

          this.setState({ myGroupKeys: groupKeys});

          //If the user is a part of a group, update the group events to that group
          if (groupKeys[0]) {
            this.updateGroupEvents(groupKeys[0]);
            this.setState({currentGroupKey: groupKeys[0]})
          }
        }
      });

    }
  }

  componentWillUnmount() {
    console.log('closing listeners');
    // Closes the listeners when a client is about to leave
    if (this.myEventsRef)
      this.myEventsRef.off();
    if (this.myUserGroupsRef)
      this.myUserGroupsRef.off();
    if (this.myGroupRef) 
      this.myGroupRef.off();
  }

  //Updates the states for the group events (both groupEvents and personalEvents) using the given groupKey
  updateGroupEvents(groupKey) {
    this.myGroupRef = firebase.database().ref('groups/' + groupKey);
    this.myGroupRef.child('/personalEvents').on('value', (snapshot) => {
      this.setState({ 
        personalGroupEvents: snapshot.val(),
        currentGroupKey: groupKey 
      });
    });
    this.myGroupRef.child('/groupEvents').on('value', (snapshot) => {
      this.setState({ groupEvents: snapshot.val() });
    });
  }

  togglePersonalCal() {
    this.setState({
      displayPersonalCal: !this.state.displayPersonalCal
    });
  }

  handleTextInput(event) {
    this.setState({ name: event.target.value });
  }

  handleNewEventDialogOpen(start, end) {
    this.setState({ 
      newEventDialogOpen: true,
      newEventStart: moment(start).format(),
      newEventEnd: moment(end).format()
     });
  }

  handleNewEventDialogClose = () => {
    this.setState({ newEventDialogOpen: false });
  };

  createGroupEvent(start, end) {
    console.log('start: '+ start + 'end: ' + end);
  }

  getMyEvents() {
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
        event.color = '#00BCD4';
        event.rendering = '';
        event.id = id;
        return event;
      });
    }
    return myEvents;
  }

  getPersonalGroupEvents() {
    let allPersonalGroupEvents = [];
    let groupUsersIDs = Object.keys(this.state.personalGroupEvents);
    for (let userID of groupUsersIDs) {
      let userGroupEvents = this.state.personalGroupEvents[userID];
      let eventIds = Object.keys(userGroupEvents);
      let events = eventIds.map((id) => {
        let event = {};
        event.type = 'personalGroup'
        event.start = new Date(userGroupEvents[id].start.dateTime);
        event.end = new Date(userGroupEvents[id].end.dateTime);
        event.color = '#43A047';
        event.rendering = 'background';
        return event;
      });
      allPersonalGroupEvents = allPersonalGroupEvents.concat(events);
    }
    return allPersonalGroupEvents;
  }

  getGroupEvents() {
    //converts events into an array
    let groupEvents = [];
    if (this.state.groupEvents) {
      let eventIds = Object.keys(this.state.groupEvents);
      groupEvents = eventIds.map((id) => {
        let event = {};
        event.type = 'groupEvents'
        event.title = this.state.groupEvents[id].summary;
        event.start = new Date(this.state.groupEvents[id].start);
        event.end = new Date(this.state.groupEvents[id].end);
        event.color = '#263238';
        event.rendering = '';
        return event;
      });
    }
    return groupEvents;
  }
 

  render() {
    if (!this.props.currentUser) {
      return (
        <Redirect to="/landing" />
      );
    }
    
    //Get all events and concatenate them together to pass to fullcalendar
    let myEvents = this.getMyEvents();
    let allPersonalGroupEvents = this.getPersonalGroupEvents();
    let publicGroupEvents = this.getGroupEvents();
    let eventsForCalendar = myEvents.concat(allPersonalGroupEvents, publicGroupEvents);


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

            <CalDrawer 
              togglePersonalCal={() => this.togglePersonalCal()} 
              myGroupKeys={this.state.myGroupKeys}  
              updateGroupEvents={(key) => this.updateGroupEvents(key)}
            />
          </Drawer>
        </div>

        <main className={mainContentClassName} >

          <FullCalendar 
            myEvents={eventsForCalendar}
            createNewEvent={(start, end) => {
              this.handleNewEventDialogOpen(start, end);
            }}
          />

          <CreateGroupEvent 
            open={this.state.newEventDialogOpen}
            start={this.state.newEventStart}
            end={this.state.newEventEnd}
            handleClose={this.handleNewEventDialogClose}
            currentGroupKey={this.state.currentGroupKey}
          />

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
      selectable: true,
      select: (start, end) => {
        this.props.createNewEvent(start, end)
      },
      events: this.props.myEvents,
      defaultView: 'agendaWeek'
    });
  }

  componentDidMount() {
    this.updateCalendar();
  }

  componentDidUpdate() {
    this.updateCalendar();
  }
}

