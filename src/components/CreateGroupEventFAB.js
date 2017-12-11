import React, { Component } from 'react';

import firebase from 'firebase/app';

import moment from 'moment';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

export default class CreateGroupEventFAB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventName: '',
      dialogOpen: false,
    }
  }

  createGroupEvent() {
    let startYear = moment(this.state.startDate).get('year');
    let startMonth = moment(this.state.startDate).get('month') + 1;
    startMonth = startMonth >= 10 ? startMonth : '0' + startMonth;
    let startDate = moment(this.state.startDate).get('date');
    startDate = startDate >= 10 ? startDate : '0' + startDate;
    let startHour = moment(this.state.startTime).get('hour');
    startHour = startHour >= 10 ? startHour : '0' + startHour;
    let startMinute = moment(this.state.startTime).get('minute');
    startMinute = startMinute >= 10 ? startMinute : '0' + startMinute;

    let endYear = moment(this.state.endDate).get('year');
    let endMonth = moment(this.state.endDate).get('month') + 1;
    endMonth = endMonth >= 10 ? endMonth : '0' + endMonth;
    let endDate = moment(this.state.endDate).get('date');
    endDate = endDate >= 10 ? endDate : '0' + endDate;
    let endHour = moment(this.state.endTime).get('hour');
    endHour = endHour >= 10 ? endHour : '0' + endHour;
    let endMinute = moment(this.state.endTime).get('minute');
    endMinute = endMinute >= 10 ? endMinute : '0' + endMinute;

    let startDateTime = startYear + '-' + startMonth + '-' + startDate + 'T' + startHour + ':' + startMinute + ':00';
    let endDateTime = endYear + '-' + endMonth + '-' + endDate + 'T' + endHour + ':' + endMinute + ':00';

    let newEvent = {
      summary: this.state.eventName,
      start: startDateTime,
      end: endDateTime
    }


    this.myGroupRef = firebase.database().ref('groups/' + this.props.currentGroupKey);
    this.myGroupRef.child('/groupEvents').push(newEvent);

  }

  handleDialogOpen() {
    this.setState({ dialogOpen: true });
  }

  handleDialogClose() {
    this.setState({ dialogOpen: false });
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
    //specify which field to change in the stage
    let newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  render() {

    return (
      <div>
        <FloatingActionButton
          secondary={true}
          style={{ position: 'fixed', right: 30, bottom: 30 }}
          onClick={() => this.handleDialogOpen()}
        >
          <ContentAdd />
        </FloatingActionButton>


        {/* Dialog box for a new event */}
        <Dialog
          title="Create a New Event"
          actions={[
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={() => this.handleDialogClose()}
            />,
            <FlatButton
              label="Create"
              primary={true}
              onClick={() => {
                this.createGroupEvent();
                this.handleDialogClose();
              }}
            />,
          ]}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={() => this.handleDialogClose()}
          autoScrollBodyContent={true}
        >
          <h2>Event Details</h2>
          <TextField
            floatingLabelText="Event Name"
            name="eventName"
            onChange={(event) => this.handleTextInput(event)}
          />
          <br />

          <span>
            <DatePicker
              onChange={this.handleChangeStartDate}
              floatingLabelText="Start Date"
              defaultDate={new Date()}
              locale="en-US"
              firstDayOfWeek={0}
            />
            <TimePicker
              format="ampm"
              hintText="Start Time"
              //value={this.state.startTime}
              minutesStep={5}
              onChange={this.handleChangeStartTimePicker}
            />
          </span>

          <span>
            <DatePicker
              onChange={this.handleChangeEndDate}
              floatingLabelText="End Date"
              defaultDate={new Date()}
              locale="en-US"
              firstDayOfWeek={0}
            />
            <TimePicker
              format="ampm"
              hintText="End Time"
              //value={this.state.endTime}
              minutesStep={5}
              //defaultTime={new Date()}
              onChange={this.handleChangeEndTimePicker}
            />
          </span>



        </Dialog>
      </div>
    );
  }
}