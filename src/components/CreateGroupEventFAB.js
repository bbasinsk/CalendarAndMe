import React, { Component } from 'react';

import firebase from 'firebase/app';

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
    startDate.setFullYear(startDate.getFullYear() - 1);
    startDate.setHours(0, 0, 0, 0);
    endDate.setFullYear(endDate.getFullYear() + 1);
    endDate.setHours(0, 0, 0, 0);

    this.state = {
      startDate: startDate,
      endDate: endDate,
      startTime: null,
      endTime: null,
      eventName: ''
    }
  }

  createGroupEvent() {

    let newEvent = {
      summary: this.state.eventName,
      start: this.state.startDate + this.state.startTime,
      end: this.state.endDate + this.state.endTime
    }

    console.log(newEvent);


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
      <Dialog
        title="Create a New Event"
        actions={[
          <FlatButton
            label="Cancel"
            primary={true}
            onClick={() => this.props.handleClose()}
          />,
          <FlatButton
            label="Create"
            primary={true}
            onClick={() => {
              this.createGroupEvent();
              this.props.handleClose();
            }}
          />,
        ]}
        modal={false}
        open={this.props.dialogOpen}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}
      >
        <h2>Event Details</h2>
        <TextField
          floatingLabelText="Event Name"
          name="eventName"
          onChange={(event) => this.handleTextInput(event)}
        />
        <br/>
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

      </Dialog>
    );
  }
}