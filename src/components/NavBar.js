import React, { Component } from 'react';
// import '../styles/NavBar.css';

import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { Redirect } from 'react-router-dom';

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      redirect: false
    };
  }

  handleDrawerToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });

  render() {
    
    if (this.state.redirect) {
      return (<Redirect to="/conversations/" />);
    }

    return (
      <div>
        <AppBar
          title={this.props.title}
          showMenuIconButton={false}
          // onLeftIconButtonTouchTap={() => this.handleDrawerToggle()}
          iconElementRight={<LoggedMenu handleSignOut={() => { this.props.handleSignOut() }} />}
        />
      </div>
    );
  }
}

class LoggedMenu extends Component {

  render() {
    return (
      <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon color='white' /></IconButton>}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem
          primaryText="Sign out"
          onClick={() => this.props.handleSignOut()} />
      </IconMenu>
    );
  }
}
