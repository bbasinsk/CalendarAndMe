import React, { Component } from 'react';

import moment from 'moment';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import firebase from 'firebase';

export default class CreateGroupEventCAL extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  createNewEvent() {
    let newEvent = {
      summary: this.state.eventName,
      start: this.props.start,
      end: this.props.end
    }
    if (newEvent.summary === undefined || newEvent.summary === '' ||newEvent.summary === null) {
      this.setState({
        errorMessage: "Please enter an event name.",
        eventName: null
      });
    } else {
      this.myGroupRef = firebase.database().ref('groups/' + this.props.currentGroupKey);
      this.myGroupRef.child('/groupEvents').push(newEvent);
      this.clearState();
      this.props.handleClose();
    }
  }

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
        <Dialog
          title="New Group Event"
          actions={[
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={() => {
                this.clearState()
                this.props.handleClose()
              }}
            />,
            <FlatButton
              label="Create"
              primary={true}
              onClick={() => {
                this.createNewEvent();
              }}
            />,
          ]}
          modal={false}
          open={this.props.open}
          onRequestClose={this.handleClose}
        > 
          
          Start: {moment(this.props.start).calendar()} <br />
          <br />
          End: {moment(this.props.end).calendar()} <br />
          
          <TextField
            floatingLabelText="Event Name"
            type="eventName"
            name="eventName"
            errorText={errorMessage}
            onChange={(event) => this.handleTextInput(event)}
          />
        </Dialog>
      </div>
    );
  }
}

