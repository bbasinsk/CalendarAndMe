import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css'; //bootstrap (bundled)
import './index.css'; //our css (bundled)

import App from './App';

import firebase from 'firebase/app';
import 'firebase/database';

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

ReactDOM.render(<App />, document.getElementById('root'));
