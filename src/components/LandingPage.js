import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Link } from 'react-router-dom'; //React router

import { AppBarButton } from './UserAuth';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import styles from './styles';

export default class LandingPage extends Component {
  render() {

    const styles = StyleSheet.create({
      center: {
        textAlign: 'center'
      }
    });


    return (
      <div>
        <AppBar
          title={"Calendar & Me"}
          showMenuIconButton={false}
          iconElementRight={<AppBarButton link='login' />}
        />
        <div className={css(styles.center)}>
          <h1 style={styles.h1}>Get organized and stay on schedule</h1>

          <Divider />

          <p>Easily manage meetings and plan group events all in one place!</p>
          <Link to='/join' >
            <RaisedButton
              label="Get Started"
              primary={true} />
          </Link>

        </div>
      </div>
    );
  }
}
