import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';
import { FlatButton } from 'material-ui';


export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    return (
      <div>
        <AppBar
          role='banner'
          title={this.props.title}
          showMenuIconButton={!this.props.onGLogin && this.props.mobile}
          onLeftIconButtonTouchTap={() => this.props.handleDrawerToggle()}
          iconElementRight={
              this.props.onGLogin !== true && <FlatButton label={'Sign Out'} onClick={() => { this.props.handleSignOut() }} />
          }
        />
      </div>
    );
  }
}

