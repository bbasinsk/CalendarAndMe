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

// import '../styles/Calendar.css';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

// temporary
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';

const timesOfDay = [
  'AM',
  'PM',
  'Anytime'
];

const preferredDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];


export default class Calendar extends Component {
  constructor(props) {
    super(props)

    const minDate = new Date();
    const maxDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 1);
    minDate.setHours(0, 0, 0, 0);
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    maxDate.setHours(0, 0, 0, 0);

    this.state = {
      myEvents: [],
      groupEvents: {},
      drawerOpen: true,
      displayPersonalCal: true,

      dialogOpen: false,
      dayValues: [],
      timeValues: [],
      minDate: minDate,
      maxDate: maxDate,

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

  handleOpen() {
    this.setState({ dialogOpen: true });

  }

  handleClose = () => {
    this.setState({ dialogOpen: false });
  };

  handleDayChange = (event, index, dayValues) => this.setState({ dayValues });
  handleTimeChange = (event, index, timeValues) => this.setState({ timeValues });

  dayMenuItems(values) {
    return preferredDays.map((item) => (
      <MenuItem
        key={item}
        insetChildren={true}
        checked={values && values.indexOf(item) > -1}
        value={item}
        primaryText={item}
      />
    ));
  }

  timeMenuItems(values) {
    return timesOfDay.map((item) => (
      <MenuItem
        key={item}
        insetChildren={true}
        checked={values && values.indexOf(item) > -1}
        value={item}
        primaryText={item}
      />
    ));
  }

  handleChangeMinDate = (event, date) => {
    this.setState({
      minDate: date,
    });
  };

  handleChangeMaxDate = (event, date) => {
    this.setState({
      maxDate: date,
    });
  };

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

    const floatingButtonStyle = {
      marginRight: 20,
    };

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

        {/* move this later */}
        <div role="complementary">
          <FloatingActionButton
            style={floatingButtonStyle}
            onClick={() => this.handleOpen()}
          >
            <ContentAdd />
          </FloatingActionButton>
          <Dialog
            title="Create a New Event"
            actions={[
              <FlatButton
                label="Cancel"
                primary={true}
                onClick={() => this.handleClose()}
              />,
              <FlatButton
                label="Create"
                primary={true}
                onClick={() => {
                  {/* this.createNewEvent(this.state.groupName, this.state.imgURL); */ }
                  this.handleClose();
                }}
              />,
            ]}
            modal={false}
            open={this.state.dialogOpen}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
            <h2>Event Details</h2>
            <p>Preferred Day(s):</p>
            <SelectField
              multiple={true}
              hintText="Select preferred day(s)"
              value={this.state.dayValues}
              onChange={this.handleDayChange}
            >
              {this.dayMenuItems(this.state.dayValues)}
            </SelectField>
            <p>Preferred Time of Day:</p>
            <SelectField
              hintText="Select preferred time of day"
              value={this.state.timeValues}
              onChange={this.handleTimeChange}
            >
              {this.timeMenuItems(this.state.timeValues)}
            </SelectField>

            <p>Time Span:</p>
            <DatePicker
              onChange={this.handleChangeMinDate}
              floatingLabelText="Min Date"
              defaultDate={this.state.minDate}
            />
            <DatePicker
              onChange={this.handleChangeMaxDate}
              floatingLabelText="Max Date"
              defaultDate={this.state.maxDate}
            />
            <p>Duration:</p>
            


          </Dialog>
        </div>


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

