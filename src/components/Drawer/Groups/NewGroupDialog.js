import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import firebase from 'firebase';

export default class NewGroupDialog extends Component {
    constructor(props) {
      super(props);
      this.state = {
        errorMessage: {
          name:null,
          image:null
        }
      }
    }
  
    createNewGroup(groupName, imgURL) {
      if (this.nameCheck(groupName)) {
        if (this.imageCheck(imgURL)) {
          this.groupEventsRef = firebase.database().ref('groups');
      
          this.newGroupRef = this.groupEventsRef.push({ name: groupName, imgURL: imgURL || '' });
      
          let groupID = this.newGroupRef.key;
      
          let currentUser = firebase.auth().currentUser;
          let personalEvents = [];
          this.userGroupsRef = firebase.database().ref('users/' + currentUser.uid + '/groups/');
          this.userGroupsRef.child(groupName).set({
            key: groupID
          });
      
          this.userGroupsRef.child('personal/events/').on('value', (snapshot) => {
            personalEvents = snapshot.val();
            this.newGroupRef.child('personalEvents/' + currentUser.uid).set(personalEvents);
            this.newGroupRef.child('users/' + currentUser.uid).set(currentUser.displayName);
          });
          this.clearErrorMessage();
          this.props.handleClose();
        }
      }
    }

    //Checks that a name is given and doesn't include specific characters that won't
    //create a valid path
    nameCheck(groupName) {
      if (groupName === undefined || groupName === "") {
        this.setState({
          errorMessage:{
            name: "Please enter a group name.",
            image: null
          }
        });
        return false;
      } else if (groupName.includes(".") || groupName.includes("#") || groupName.includes ("$") || groupName.includes ("[") || groupName.includes ("]")){
        this.setState({
          errorMessage:{
            name: 'Group names cannot include ".", "#", "$", "[", or "].',
            image: null
          }
        });
        return false
      } else {
        return true;
      }
    }
  
    //Checks to make sure the url is for a jpg or png image
    imageCheck(imgURL) {
      console.log(imgURL);
      if (imgURL !== undefined && imgURL !== "") {
        let imageType = imgURL.substr(-4);
        if (imageType !== '.jpg' && imageType !== '.png') {
          this.setState({
            errorMessage:{
              name:null,
              image: "Image Urls must be in jpg or png form."
            }
          });
          return false;
        } else {
          return true;
        }
      }
      return true;
    }

    handleTextInput(event) {
      //specify which field to change in the stage
      let newState = {};
      newState[event.target.name] = event.target.value;
      this.setState(newState);
    }

    //CLears the state if the user cancels or a group is created
    clearErrorMessage() {
      this.setState({
        errorMessage:{
          name: null,
          image: null
        }
      });
    }
  
    render() {
      let errorMessage= {
        name: null,
        image: null
      }
      if (this.state.errorMessage.name) {
        errorMessage.name = this.state.errorMessage.name;
      } else if (this.state.errorMessage.image) {
          errorMessage.image = this.state.errorMessage.image;
      }
      return (
        <div>
          <Dialog
            title="Create a group"
            actions={[
              <FlatButton
                label="Cancel"
                primary={true}
                onClick={() => {
                  this.clearErrorMessage()
                  this.props.handleClose()}
                }
              />,
              <FlatButton
                label="Create"
                primary={true}
                onClick={() => {
                  this.createNewGroup(this.state.groupName, this.state.imgURL);
                }}
              />,
            ]}
            modal={false}
            open={this.props.open}
            onRequestClose={this.handleClose}
          >
            Enter a name and optional image for your new group.
            <br />
            <TextField
              floatingLabelText="Group Name"
              type="groupName"
              name="groupName"
              errorText= {errorMessage.name}
              onChange={(event) => this.handleTextInput(event)}
            /> 
            <br />
            <TextField
              floatingLabelText="Image URL"
              type="imgURL"
              name="imgURL"
              errorText= {errorMessage.image}
              onChange={(event) => this.handleTextInput(event)}
            />
          </Dialog>
        </div>
      );
    }
  }
  
  