import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Link } from 'react-router-dom'; //React router

import { AppBarButton } from './UserAuth';

import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import img1 from '../imgs/carousel1.jpg'

export default class LandingPage extends Component {
  render() {

    const styles = StyleSheet.create({
      center: {
        textAlign: 'center'
      },
      padding: {
        padding: 50
      },
      carouselImg: {
        maxWidth: '100%',
        maxHeight: '100%'
      },
      imgContainer: {
        height: '300px'
      }
    });


    return (
      <div>
        <div role={'banner'}>
          <AppBar
            title={"Calendar & Me"}
            showMenuIconButton={false}
            iconElementRight={<AppBarButton link='log In' />}
          />
        </div>

        <div role={'main'} className={css(styles.center, styles.padding)}>

          <div className={css(styles.imgContainer)}>
           <img src={img1} alt='Manage Your Personal Life' className={css(styles.carouselImg)} />
          </div>
        
          <h1>{'Calendar & Me'}</h1>

          <Divider />

          <p>Easily schedule meetings and plan group events all in one place!</p>
          <Link to='/join' >
            <RaisedButton
              label="Sign Up"
              primary={true} />
          </Link>

        </div>
      </div>
    );
  }
}
