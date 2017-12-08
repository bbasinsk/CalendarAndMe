import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class GetGroupKey extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div>
        <Dialog
          title="Share Group Key"
          actions={[
            <FlatButton
              label="Okay"
              primary={true}
              onClick={() => this.props.handleClose()}
            />
          ]}
          modal={false}
          open={this.props.open}
          onRequestClose={() => this.props.handleClose()}
        >
          Give this key to a friend so that they can join your group!
            <br />
          <div>
              <h2>{this.props.currentGroupName}</h2>
              <p>{this.props.groupKey}</p>
          </div>
        </Dialog>
      </div>
    );
  }
}

