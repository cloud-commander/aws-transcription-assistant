//@ts-nocheck
/* eslint-disable */


import React from 'react';
// @ts-ignore
import TranscriptionEngine from "./TranscriptionEngine";

export default class LoadHelp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        transcriptData: this.props.transcriptData,
        mediaUrl: this.props.mediaUrl,
        audioTitle: this.props.audioTitle,
        fileName: ""

      };
    }
  render () {
    return (
      <div>
       
        <TranscriptionEngine transcriptData={this.state.transcriptData} mediaUrl={this.state.mediaUrl} audioTitle={this.state.audioTitle}/>

      </div>
    );
  }
}
