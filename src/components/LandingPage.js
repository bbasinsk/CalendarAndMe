import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Link } from 'react-router-dom'; //React router

import { AppBarButton } from './UserAuth';

import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import img1 from '../imgs/carousel1.jpg'
import img2 from '../imgs/carousel2.jpg'
import img3 from '../imgs/carousel3.jpg'
import img4 from '../imgs/carousel4.jpg'

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
        height: 300
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

          <Carousel infiniteLoop={true} autoPlay={true} >
            <div>
              <img src={img1} alt='Manage Your Personal Life' className={css(styles.carouselImg)} />

            </div>
            <div>
              <img src={img2} alt='Plan. Collaberate. Execute.' className={css(styles.carouselImg)} />

            </div>
            <div>
              <img src={img3} alt='Safe & Secure' className={css(styles.carouselImg)} />

            </div>
            <div>
              <img src={img4} alt='Get More Done, Faster.' className={css(styles.carouselImg)} />

            </div>
          </Carousel>

          <h1>{'Calendar & Me'}</h1>

          <Divider />

          <p>Easily schedule meetings and plan group events all in one place!</p>
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
