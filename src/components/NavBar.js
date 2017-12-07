import React, { Component } from 'react';
// import '../styles/NavBar.css';

import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';


export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      menuOpen: false
    };
  }

  handleDrawerToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });

  handleMenuToggle = () => this.setState({ menuOpen: !this.state.menuOpen });

  render() {

    return (
      <div>
        <AppBar
          title={this.props.title}
          showMenuIconButton={this.state.menuOpen}
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
