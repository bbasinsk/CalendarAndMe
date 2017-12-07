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
<<<<<<< HEAD
      loading: false
=======
      user: null,
      error: null
>>>>>>> Commiting to pull
    }
  }

  componentWillMount() {
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
  handleSignUp(email, password, confirmPassword, firstName, lastName) {
    this.setState({
      error: null, //clear any old errors
      loading: true      //show loading
    });

    if (firstName.length === 0) {
      let error = {
        code: 'auth/invalid-firstName',
        message: 'The first name is badly formatted or empty.'}
      this.setState({
        error: error,
        loading: false
      });
    } else if (lastName.length === 0) {
      let error = {
        code: 'auth/invalid-lastName',
        message: 'The last name is badly formatted or empty.'}
      this.setState({
        error: error,
        loading: false
      });
    } else if (password !== confirmPassword) {
      let error = {
        code: 'auth/unconfirmed-password',
        message: 'The first and second passwords do not match.'}
      this.setState({
        error: error,
        loading: false
      });
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((firebaseUser) => {
          let promise = firebaseUser.updateProfile({
            displayName: firstName + ' ' + lastName
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
      error: null,
      loading: true
    }); //clear any old errors

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          error: error,
          loading: false
        });
      });
    
  }

  //A callback function for logging out the current user
  handleSignOut() {
    this.setState({
      error: null,
      loading: true
    }); //clear any old errors

    firebase.auth().signOut()
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({
          error: error,
          loading: false
        });
      });
  }

  addPersonalCalendar() {
    let userID = this.state.user.uid;
    
    // var newGroupKey = firebase.database().ref().child('').push().key;

    let users = {};
    users[userID] = {
      displayName: this.state.user.displayName,
      groups: {
        personal: 'noKey'
      }
    };

    this.usersRef = firebase.database().ref('users');
    this.usersRef.update(users)
<<<<<<< HEAD
      .catch(error => console.log(error.message));
    
=======
      .catch(error => console.log(error));


>>>>>>> Commiting to pull
  }


  render() {
    return (
      <Switch>
        <Route exact path='/' render={(routerProps) =>
          (<Calendar
            onMobile={this.mq}
            handleSignOut={() => this.handleSignOut()}
            currentUser={this.state.user}
            conversations={this.state.conversations}
            addPersonalCalendar={() => this.addPersonalCalendar()}
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
            error={this.state.error}
            handleSignIn={(e, p) => this.handleSignIn(e, p)}
          />)}
        />

        <Route path='/join' render={(routerProps) =>
          (<SignupForm
            {...routerProps}
            currentUser={this.state.user}
            error={this.state.error}
            handleSignUp={(e, p, c, f, l) => this.handleSignUp(e, p, c, f, l)}
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