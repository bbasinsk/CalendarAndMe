import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';

import firebase from 'firebase';

export default class NewEventDialog extends Component {
    constructor(props) {
      super(props);
      this.state = {}
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
                  {/* this.createNewEvent(this.state.groupName, this.state.imgURL); */}
                  this.props.handleClose();
                }}
              />,
            ]}
            modal={false}
            open={this.props.open}
            onRequestClose={this.handleClose}
          >
            Enter a name for your new group.
            <br />
            <TextField
              floatingLabelText="Event Name"
              type="eventName"
              name="eventName"
              onChange={(event) => this.handleTextInput(event)}
            /> <br />
            <Subheader>Meeting Details</Subheader>
            
            
          </Dialog>
        </div>
      );
    }
  }
  