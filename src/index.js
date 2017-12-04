import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';

import firebase from 'firebase/app';
import 'firebase/database'
import 'firebase/auth';

import { BrowserRouter } from 'react-router-dom'; //React router
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Initalizes the app with material-ui theme and routing
const CalApp = () => (
    <BrowserRouter basename={process.env.PUBLIC_URL + '/'}>
        <MuiThemeProvider>
            <App />
        </MuiThemeProvider>
    </BrowserRouter>
);

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

ReactDOM.render(<CalApp />, document.getElementById('root'));
// registerServiceWorker();
