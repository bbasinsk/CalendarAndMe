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
      console.log('Logged in, redirecting to /');
      return (<Redirect to={'/'} />);
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
      username: ''
    }
  }

  //A callback function for logging in existing users
  handleSignUp() {
    this.props.handleSignUp(this.state.email,
      this.state.password,
      this.state.username);
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
            <TextField
              floatingLabelText="Username"
              type="username"
              name="username"
              onChange={(event) => this.handleTextInput(event)}
            /><br />
            <TextField
              floatingLabelText="Email"
              type="email"
              name="email"
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
              label="Sign Up"
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