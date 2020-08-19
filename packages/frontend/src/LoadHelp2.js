//@ts-nocheck
/* eslint-disable */

import React, { Component } from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import TranscriptionEngine from "./TranscriptionEngine";
import PropTypes from "prop-types";
import axios from 'axios';

export default class LoadHelp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        transcriptData: null,
        mediaUrl: this.props.mediaUrl,
        audioTitle: this.props.audioTitle,
        fileName: "",
        open: false

      };
    }


  closeConfigShow = (closeOnEscape, closeOnDimmerClick) => () => {
    this.setState({ closeOnEscape, closeOnDimmerClick, open: true });
  };

  close = () => this.setState({ open: false });

  componentDidMount() {
    axios.get(this.props.transcriptData)
    .then(response => {
            console.log("RESPONSE DATA" + response.data);
            this.setState({
                transcriptData: response.data,
            });
        })
    .catch(error => {
      console.log(error);
    });
  }

  render () {
    const { open, closeOnEscape, closeOnDimmerClick } = this.state;
    console.log(this.state.transcriptData);
    return (
      <div>
        <Button onClick={this.closeConfigShow(true, false)}>
        View
        </Button>

        <Modal
          open={open}
          closeOnEscape={closeOnEscape}
          closeOnDimmerClick={closeOnDimmerClick}
          size={"large"}
          //dimmer={"blurring"}
          onClose={this.close}
        >
          <Modal.Header>My Message: {this.state.audioTitle}</Modal.Header>
          <Modal.Content>
            <TranscriptionEngine transcriptData={this.state.transcriptData} mediaUrl={this.state.mediaUrl} audioTitle={this.state.audioTitle}/>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={this.close}
              positive
              color="red"
              labelPosition="right"
              icon="close"
              content="Close"
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}


LoadHelp.propTypes = {
  audioTitle: PropTypes.string,
  mediaUrl: PropTypes.string,
  fileName: PropTypes.string,
  transcriptData: PropTypes.object
};
