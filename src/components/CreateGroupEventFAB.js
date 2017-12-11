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

    const startDate = new Date();
    const endDate = new Date();
    startDate.setFullYear(startDate.getFullYear());
    startDate.setHours(0, 0, 0, 0);
    endDate.setFullYear(endDate.getFullYear());
    endDate.setHours(0, 0, 0, 0);

    this.state = {
      startDate: startDate,
      endDate: endDate,
      startTime: null,
      endTime: null,
      eventName: '',
      dialogOpen: false,
    }
  }

  createGroupEvent() {
    let startYear = moment(this.state.startDate).get('year');
    let startMonth = moment(this.state.startDate).get('month') + 1;
    let startDate = moment(this.state.startDate).get('date');
    let startHour = moment(this.state.startTime).get('hour');
    let startMinute = moment(this.state.startTime).get('minute');
    let startSecond = moment(this.state.startTime).get('second');
    let endYear = moment(this.state.endDate).get('year');
    let endMonth = moment(this.state.endDate).get('month') + 1;
    let endDate = moment(this.state.endDate).get('date');
    let endHour = moment(this.state.endTime).get('hour');
    let endMinute = moment(this.state.endTime).get('minute');
    let endSecond = moment(this.state.endTime).get('second');
    let startDateTime = startYear + '-' + startMonth + '-' + startDate + 'T' + startHour + ':' + startMinute + ':' + startSecond;
    let endDateTime = endYear + '-' + endMonth + '-' + endDate + 'T' + endHour + ':' + endMinute + ':' + endSecond;

    let newEvent = {
      summary: this.state.eventName,
      start: startDateTime,
      end: endDateTime
    }
    if (newEvent.summary === undefined || newEvent.summary === '' || newEvent.summary === null) {
      this.setState({
        errorMessage: "Please enter an event name.",
        eventName: null
      });
    // } else if () {
    //   this.setState({
    //     errorMessage: "Please enter an event name.",
    //     eventName: null
    //   });
    }else {
    this.myGroupRef = firebase.database().ref('groups/' + this.props.currentGroupKey);
    this.myGroupRef.child('/groupEvents').push(newEvent);
    this.clearState();
    this.props.handleDialogClose();
    }
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

  //CLears the state if the user cancels or an event is created
  clearState() {
    this.setState({
      errorMessage: null,
      eventName: null
    });
  }

  render() {
    let errorMessage= '';
    if (this.state.errorMessage && this.state.errorMessage !== null) {
      errorMessage = this.state.errorMessage;
    }
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
              onClick={() => {
                this.clearState();
                this.handleDialogClose()
              }}
            />,
            <FlatButton
              label="Create"
              primary={true}
              onClick={() => {
                this.createGroupEvent();
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
            errorText={errorMessage}
            onChange={(event) => this.handleTextInput(event)}
          />
          <br />

          <span>
            <DatePicker
              onChange={this.handleChangeStartDate}
              floatingLabelText="Start Date"
              defaultDate={new Date()}
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