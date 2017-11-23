import React from 'react';
import ReactDOM from 'react-dom';

import './index.css'; //our css (bundled)

import App from './App';

import firebase from 'firebase/app';
import 'firebase/database';

// Import material theme provider
import { MuiThemeProvider } from 'material-ui/styles';

 // Initialize Firebase
 var config = {
  apiKey: "AIzaSyAfv4kQhbCSCGCvwEd3wRNKIMlUxFN6_-E",
  authDomain: "calendarandme.firebaseapp.com",
  databaseURL: "https://calendarandme.firebaseio.com",
  projectId: "calendarandme",
  storageBucket: "calendarandme.appspot.com",
  messagingSenderId: "102064689248"
};
firebase.initializeApp(config);

const MyApp = () => (
  <MuiThemeProvider >
    <App />
  </MuiThemeProvider>
);

ReactDOM.render(<MyApp />, document.getElementById('root'));
