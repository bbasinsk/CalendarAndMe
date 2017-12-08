import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import firebase from 'firebase';

export default class CreateGroupEvent extends Component {
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
    console.log(newEvent);
    console.log(this.props.currentGroupKey);

    this.myGroupRef = firebase.database().ref('groups/' + this.props.currentGroupKey);
    this.myGroupRef.child('/groupEvents').push(newEvent);
  }

  handleTextInput(event) {
    //specify which field to change in the stage
    let newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  render() {

    return (
      <div>
        <Dialog
          title="Create an event"
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
                this.createNewEvent();
                this.props.handleClose();
              }}
            />,
          ]}
          modal={false}
          open={this.props.open}
          onRequestClose={this.handleClose}
        >
          Enter a name for your event.
          <br />
          
          <TextField
            floatingLabelText="Event Name"
            type="eventName"
            name="eventName"
            onChange={(event) => this.handleTextInput(event)}
          />
        </Dialog>
      </div>
    );
  }
}

