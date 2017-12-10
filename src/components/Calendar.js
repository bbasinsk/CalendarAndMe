import React, { Component } from 'react';
import { css } from 'aphrodite';
import { Redirect } from 'react-router-dom';

import Drawer from 'material-ui/Drawer';
import Snackbar from 'material-ui/Snackbar';

import CalDrawer from './Drawer/CalDrawer';
import NavBar from './NavBar';
import CreateGroupEventCAL from './CreateGroupEventCAL';
import CreateGroupEventFAB from './CreateGroupEventFAB';

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
      myGroups: [],

      drawerOpen: true,
      copied: false,
      displayPersonalCal: true,

      newEventDialogOpen: false,
    };
  }


  componentDidMount() {
    if (this.props.currentUser) {
      let uid = this.props.currentUser.uid;
      this.myUserGroupsRef = firebase.database().ref('users/' + uid + '/groups');
      this.myEventsRef = firebase.database().ref('users/' + uid + '/groups/personal/events/');

      // users/uid/groups/personal/events/
      this.myEventsRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          this.setState({ myEvents: snapshot.val() })
        }
      });

      // users/uid/groups/
      this.myUserGroupsRef.on('value', (snapshot) => {

        let myUserGroups = snapshot.val();
        if (myUserGroups) {
          delete myUserGroups.personal;
        }

        this.setState({ myGroups: myUserGroups });

        //If the user is a part of a group, update the group events to that group
        if (myUserGroups) {
          let groupNames = Object.keys(myUserGroups);
          let groupKeys = groupNames.map((name) => {
            return myUserGroups[name].key;
          });

          if (groupKeys && groupKeys.length >= 1) {
            this.updateGroupEvents(groupKeys[0]);
            this.setState({ 
              currentGroupKey: groupKeys[0],
              currentGroupName: groupNames[0]
            })
          }
        }
      });
    }
  }

  componentWillMount() {
    window.addEventListener('resize', () => this.handleWindowSizeChange());
    
    if (window.innerWidth < 750) {
      this.setState({drawerOpen: false, mobile: true});
    } else {
      this.setState({drawerOpen: true, mobile: false});
    }
  }

  componentWillUnmount() {
    // Closes the listeners when a client is about to leave
    if (this.myEventsRef)
      this.myEventsRef.off();
    if (this.myUserGroupsRef)
      this.myUserGroupsRef.off();
    if (this.myGroupRef)
      this.myGroupRef.off();

    window.removeEventListener('resize', () => this.handleWindowSizeChange());
  }

  //Updates the states for the group events (both groupEvents and personalEvents) using the given groupKey
  updateGroupEvents(groupKey) {
    this.setState({currentGroupKey: groupKey})

    this.myGroupRef = firebase.database().ref('groups/' + groupKey);
    this.myGroupRef.child('/name').on('value', (snapshot) => {
      this.setState({
        currentGroupName: snapshot.val()
      });
    });
    this.myGroupRef.child('/personalEvents').on('value', (snapshot) => {
      this.setState({
        personalGroupEvents: snapshot.val(),
      });
    });
    this.myGroupRef.child('/groupEvents').on('value', (snapshot) => {
      this.setState({ groupEvents: snapshot.val() });
    });
  }

  handleWindowSizeChange() {
    if (window.innerWidth) {
      if (window.innerWidth < 750) {
        this.setState({mobile: true, drawerOpen: false});
      } else {
        this.setState({mobile: false, drawerOpen: true});
      }
    }
  };

  handleDrawerToggle() {
    this.setState({drawerOpen: !this.state.drawerOpen});
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

  handleNewEventDialogClose() {
    this.setState({ newEventDialogOpen: false });
  }

  handleCopiedOpen() {
    this.setState({copied: true});
  }

  handleCopiedClose() {
    this.setState({copied: false});
  }

  createGroupEvent(start, end) {
    console.log('start: ' + start + 'end: ' + end);
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
  
    if (this.state.personalGroupEvents) {
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
      styles.topPadding,
      !this.state.mobile && styles.padding,
      !this.state.mobile && this.state.drawerOpen && styles.leftMargin
    );

    return (
      <div>
        <NavBar
          title={'Calendar & Me'}
          handleDrawerToggle={() => this.handleDrawerToggle()}
          handleSignOut={() => this.props.handleSignOut()}
          mobile={this.state.mobile}
        />

        <div className={'drawer'} style={{ top: '64px', position: 'fixed', zIndex: 2 }} > {/* Pushes drawer below AppBar */}
          <Drawer open={this.state.drawerOpen} containerStyle={{backgroundColor: 'white' }} >

            {/* Pushes drawer content down so that the appbar doesn't cover it */}
            <div style={{ height: '64px' }} ></div>

            <CalDrawer
              togglePersonalCal={() => this.togglePersonalCal()}
              myGroups={this.state.myGroups}
              updateGroupEvents={(key) => this.updateGroupEvents(key)}
              groupKey={this.state.currentGroupKey}
              currentGroupName={this.state.currentGroupName}
              handleCopiedOpen={() => this.handleCopiedOpen()}
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

          <CreateGroupEventCAL
            open={this.state.newEventDialogOpen}
            start={this.state.newEventStart}
            end={this.state.newEventEnd}
            handleClose={() => this.handleNewEventDialogClose()}
            currentGroupKey={this.state.currentGroupKey}
          />

          <CreateGroupEventFAB 
            currentGroupKey={this.state.currentGroupKey}
          />

        </main>

        <Snackbar
          open={this.state.copied}
          message="Group key copied to clipboard"
          autoHideDuration={3000}
          onRequestClose={() => this.handleCopiedClose()}
        />

      </div>
    );
  }
}

class FullCalendar extends Component {
  render() {
  return <div id="calendar"style={{position: 'relative', zIndex: 0}}></div>;
  }

  updateCalendar() {
    $('#calendar').fullCalendar('destroy');
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'agendaWeek,agendaDay'
      },
      height: window.innerHeight - 100,
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

