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

// import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

// temporary
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
// import Slider from 'material-ui/Slider';
import TimePicker from 'material-ui/TimePicker';

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

    const startDate = new Date();
    const endDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    startDate.setHours(0, 0, 0, 0);
    endDate.setFullYear(endDate.getFullYear() + 1);
    endDate.setHours(0, 0, 0, 0);

    this.state = {
      myEvents: [],
      personalGroupEvents: {},
      groupEvents: [],
      myGroupKeys: [],

      drawerOpen: true,
      displayPersonalCal: true,

      dialogOpen: false,
      // dayValues: [],
      // timeValues: [],
      startDate: startDate,
      endDate: endDate,
      durationTime: 0,
      startTime: null,
      endTime: null,
      name: '',

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
      this.setState({ personalGroupEvents: snapshot.val() });
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

  createGroupEvent(eventInfo) {
    let start = {};
    
    
    let newEvent = {
      name: this.state.name,

    }

    //get key of current group
    let groupKey;

    let groupEventRef = firebase.database().ref('groups/' + groupKey + '/groupEvents');
     
    //push new event into this 
    let groupEventKey = groupEventRef.push().key;;


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

  handleChangeStartDate = (event, date) => {
    this.setState({
      startDate: date,
    });
  };

  handleChangeEndDate = (event, date) => {
    this.setState({
      endDate: date,
    });
  };

  handleChangeStartTimePicker = (event, date) => {
    this.setState({ startTime: date });
  };

  handleChangeEndTimePicker = (event, date) => {
    this.setState({ endTime: date });
  };

  handleTextInput(event) {
    this.setState({ name: event.target.value });
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
        event.start = new Date(this.state.groupEvents[id].start.dateTime);
        event.end = new Date(this.state.groupEvents[id].end.dateTime);
        event.color = '#00BCD4';
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

    
    let myEvents = this.getMyEvents();
    let allPersonalGroupEvents = this.getPersonalGroupEvents();
    let publicGroupEvents = this.getGroupEvents();

    let eventsForCalendar = myEvents.concat(allPersonalGroupEvents, publicGroupEvents);


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

            <CalDrawer 
              togglePersonalCal={() => this.togglePersonalCal()} 
              myGroupKeys={this.state.myGroupKeys}  
              updateGroupEvents={(key) => this.updateGroupEvents(key)}
            />
          </Drawer>
        </div>

        <main className={mainContentClassName} >

          <FullCalendar myEvents={eventsForCalendar} />

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
            <TextField
            floatingLabelText="Event Name"
            name="eventName"
            onChange={(event) => this.handleTextInput(event)}
          />
            Date
            <DatePicker
              onChange={this.handleChangeStartDate}
              floatingLabelText="Start Date"
              defaultDate={new Date()}
            />
            <DatePicker
              onChange={this.handleChangeEndDate}
              floatingLabelText="End Date"
              defaultDate={new Date()}
            />
            <p>Time</p>
            <TimePicker
              format="ampm"
              hintText="Start Time"
              value={this.state.startTime}
              minutesStep={5}
              onChange={this.handleChangeStartTimePicker}
            />
            <TimePicker
              format="ampm"
              hintText="End Time"
              value={this.state.endTime}
              minutesStep={5}
              onChange={this.handleChangeEndTimePicker}
            />




            {/* <p>Preferred Day(s):</p>
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


            <p>Duration:</p>
            <Slider
              min={0}
              max={12}
              step={0.5}
              value={this.state.durationTime}
              onChange={this.handleSecondSlider}
            />
            <span>{'The value of this slider is: '}</span>
            <span>{this.state.durationTime}</span> */}

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

