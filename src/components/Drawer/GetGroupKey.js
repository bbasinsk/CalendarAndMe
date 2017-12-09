import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ContentCopy from 'material-ui/svg-icons/content/content-copy'

import CopyToClipboard from 'react-copy-to-clipboard';

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
            <h2>Group: {this.props.currentGroupName}</h2>
            <p>Key: {this.props.groupKey}</p>
            <CopyToClipboard text={this.props.groupKey} onCopy={() => this.props.handleCopiedOpen()}>
              <FlatButton
                label='Copy to clipboard'
                labelPosition="before"
                primary={true}
                icon={<ContentCopy />}
              />
            </CopyToClipboard>
          </div>
          
        </Dialog>
      </div>
    );
  }
}

