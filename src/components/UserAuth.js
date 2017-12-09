import React, { Component } from 'react';
import '../styles/UserAuth.css';
import { Redirect, Link } from 'react-router-dom'; //React router

import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';

export class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }


  //A callback function for logging in existing users
  handleSignIn() {
    this.props.handleSignIn(this.state.email, this.state.password);
  }

  handleTextInput(event) {
    //specify which field to change in the stage
    let newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleSignIn();
    }
  }

  render() {
    if (this.props.currentUser) {
      return (<Redirect to={'/'} />);
    }

    
    let errorMessage= null;
    
    if (this.props.error !== null) {
      let errorCode = this.props.error.code;
      if (errorCode === "auth/wrong-password" || errorCode === "auth/user-not-found") {
        errorMessage = "The email/password combination provided was invalid.";
      }else if (errorCode === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      }
    }
    
    


    return (
      <div>
        <AppBar
          title={"Calendar & Me"}
          iconElementLeft={<Link to='/'><IconButton><ArrowBackIcon color='white' /></IconButton></Link>}
          iconElementRight={<AppBarButton link='join' />}
        />
        <div className='login-form content'>
          <Paper className='auth-card' zDepth={2}>
            <h2 className='auth-title'>Log In</h2>
            <TextField
              floatingLabelText="Email"
              type="email"
              name="email"
              errorText= {errorMessage} 
              onChange={(event) => this.handleTextInput(event)}
            /> <br />
            <TextField
              floatingLabelText="Password"
              type="password"
              name="password"
              onKeyPress={(event) => this.handleKeyPress(event)}
              onChange={(event) => this.handleTextInput(event)}
            /><br />
            <RaisedButton
              className='auth-button'
              label="Log in"
              primary={true}
              onClick={() => this.handleSignIn()} />
          </Paper>
        </div>
      </div>
    );
  }
}


export class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    }
  }

  //A callback function for logging in existing users
  handleSignUp() {
    this.props.handleSignUp(this.state.email,
      this.state.password,
      this.state.confirmPassword,
      this.state.firstName, 
      this.state.lastName);
  }

  handleTextInput(event) {
    //specify which field to change in the stage
    let newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleSignUp();
    }
  }

  render() {
    if (this.props.currentUser) {
      return (<Redirect to={'/'} />);
    }

    console.log(this.props.error);
    let errorMessage= {
      email:null,
      password:null
    };
    if (this.props.error !== null) {
      let errorCode = this.props.error.code;
      if (errorCode === "auth/weak-password") {
        errorMessage.password = "The password must be at least 6 characters long.";
      } else  if (errorCode === "auth/unconfirmed-password") {
        errorMessage.password = "The entered passwords must match each other.";
      }else if (errorCode === "auth/email-already-in-use") {
        errorMessage.email = "This email address is already registered with an account.";
        // let email = this.state.email;
        // errorMessage.email = this.state.email + " is already registered with an account.";
      }else if (errorCode === "auth/invalid-email") {
        errorMessage.email = "Please enter a valid email address.";
      }else if (errorCode === "auth/invalid-firstName") {
        errorMessage.firstName = "Please enter a valid first name.";
        // errorMessage.firstName = "Please enter a valid";
        // errorMessage.lastName = "first name.";
      } else if (errorCode === "auth/invalid-lastName") {
        errorMessage.lastName = "Please enter a valid last name.";
      }
    }

    return (
      <div>
        <AppBar
          title={"Calendar & Me"}
          iconElementLeft={<Link to='/'><IconButton><ArrowBackIcon color='white' /></IconButton></Link>}
          iconElementRight={<AppBarButton link='login' />}
        />
        <div className="login-form content">
          <Paper className='auth-card' zDepth={2}>
            <h2 className='auth-title' >Sign Up</h2>
            <div>
              <TextField
                floatingLabelText="First Name"
                type="firstName"
                name="firstName"
                style={{width: 120, marginRight: 8, verticalAlign: 'text-top'}}
                errorText={errorMessage.firstName}
                onChange={(event) => this.handleTextInput(event)}
              />
              <TextField
                floatingLabelText="Last Name"
                type="lastName"
                name="lastName"
                style={{width: 120, marginLeft:8, verticalAlign: 'text-top'}}
                errorText={errorMessage.lastName}
                onChange={(event) => this.handleTextInput(event)}
              />
            </div>
           
            <TextField
              floatingLabelText="Email"
              type="email"
              name="email"
              errorText={errorMessage.email}
              onChange={(event) => this.handleTextInput(event)}
            /> <br />
            <TextField
              floatingLabelText="Password"
              type="password"
              name="password"
              errorText= {errorMessage.password}
              onKeyPress={(event) => this.handleKeyPress(event)}
              onChange={(event) => this.handleTextInput(event)}
            /><br />
            <TextField
              floatingLabelText="Confirm Password"
              type="password"
              name="confirmPassword"
              onKeyPress={(event) => this.handleKeyPress(event)}
              onChange={(event) => this.handleTextInput(event)}
            /><br />
            <RaisedButton
              className='auth-button'
              label="Submit"
              primary={true}
              onClick={() => this.handleSignUp()} />
          </Paper>
        </div>
      </div>
    );
  }
}


export class AppBarButton extends Component {

  static muiName = 'FlatButton';

  render() {
    let link = this.props.link.replace(/\s/g, '');

    return (
      <Link to={'/' + link}>
        <FlatButton {...this.props}
          label={this.props.link}
        />
      </Link>
    );
  }
}