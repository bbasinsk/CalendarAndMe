import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import firebase from 'firebase';

import { LoginForm, SignupForm } from './components/UserAuth';
import LandingPage from './components/LandingPage';
import Calendar from './components/Calendar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }

  componentDidMount() {
    this.unregisterFunction = firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) { // someone logged in
        this.setState({
          user: firebaseUser,
          loading: false
        });
      } else { //someone logged out
        this.setState({
          user: null,
          loading: false
        });
      }
    });
  }



  //A callback function for registering new users
  handleSignUp(email, password, username) {
    this.setState({
      errorMessage: null, //clear any old errors
      loading: true      //show loading
    });

    if (username.length === 0) {
      this.setState({
        errorMessage: 'Must provide username',
        loading: false
      });
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((firebaseUser) => {
          let promise = firebaseUser.updateProfile({
            displayName: username
          });


          return promise;
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            error: error,
            loading: false
          });
        });
    }
  }

  //A callback function for logging in existing users
  handleSignIn(email, password) {
    this.setState({
      errorMessage: null,
      loading: true
    }); //clear any old errors

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          errorMessage: error.message,
          loading: false
        });
      });
    
  }

  //A callback function for logging out the current user
  handleSignOut() {
    this.setState({
      errorMessage: null,
      loading: true
    }); //clear any old errors

    firebase.auth().signOut()
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({
          errorMessage: error.message,
          loading: false
        });
      });
  }


  render() {
    return (
      <Switch>
        <Route exact path='/' render={(routerProps) =>
          (<Calendar
            handleSignOut={() => this.handleSignOut()}
            currentUser={this.state.user}
            conversations={this.state.conversations}
            {...routerProps}
          />)}
        />

        <Route path='/landing' render={(routerProps) =>
          (<LandingPage
            {...routerProps}
            currentUser={this.state.user}
          />)}
        />

        <Route path='/login' render={(routerProps) =>
          (<LoginForm
            {...routerProps}
            currentUser={this.state.user}
            handleSignIn={(e, p) => this.handleSignIn(e, p)}
          />)}
        />

        <Route path='/join' render={(routerProps) =>
          (<SignupForm
            {...routerProps}
            currentUser={this.state.user}
            handleSignUp={(e, p, u) => this.handleSignUp(e, p, u)}
          />)}
        />

        <Route render={(routerProps) =>
          (<Redirect to="/"
            {...routerProps}
          />)}
        />        
      </Switch>
    );
  }
}

export default App;