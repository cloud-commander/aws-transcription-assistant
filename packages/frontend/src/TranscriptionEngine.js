/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import TranscriptEditor from "./packages/components/transcript-editor";
import SttTypeSelect from "./select-stt-json-type";
import ExportFormatSelect from "./select-export-format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import style from "./index.module.scss";


/*
import {
  loadLocalSavedData,
  isPresentInLocalStorage,
  localSave
} from "./local-storage.js";

*/

import axios from 'axios';

//import DEMO_TRANSCRIPT from "./sample-data/AWS-Transcribe-Sample.json";


const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);


export default class TranscriptionEngine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transcriptJSONBlob: null,
      transcriptJSON: this.props.transcriptJSON,
      mediaUrl: this.props.mediaUrl,
      isTextEditable: true,
      spellCheck: false,
      sttType: "amazontranscribe",
      analyticsEvents: [],
      title: this.props.audioTitle,
      fileName: "",
      autoSaveData: {},
      autoSaveContentType: "MS Word",
      autoSaveExtension: "docx"
    };

    console.log("1 Transcript JSON: " + this.props.transcriptJSON);
    //console.log("1 Transcript Blob: " + this.state.transcriptJSONBlob);
    //console.log(JSON.stringify(this.state.transcriptJSONBlob));
    console.log("1 Media URL: " + this.state.mediaUrl);
    console.log("1 Title " + this.state.title);

    this.transcriptEditorRef = React.createRef();
}

    componentDidMount() {
        axios.get(this.state.transcriptJSON)
        .then(response => {
                console.log("RESPONSE DATA" + response.data);
                console.log(JSON.stringify(response.data));
                this.setState({
                    transcriptJSONBlob: response.data,
                });
            })
        .catch(error => {
        console.log(error);
        });
    }

/*
loadDemo = () => {
  if(isPresentInLocalStorage(this.props.mediaUrl)){
    const transcriptDataFromLocalStorage = loadLocalSavedData(this.props.mediaUrl)
    this.setState({
      transcriptData: transcriptDataFromLocalStorage,
      mediaUrl: this.props.mediaUrl,
      title: this.props.audioTitle,
      sttType: 'amazontranscribe'
    });
  }
  else{
     this.setState({
      transcriptData: DEMO_TRANSCRIPT,
      mediaUrl: this.props.mediaUrl,
      title: this.props.audioTitle,
      sttType: "amazontranscribe"
    });
  }

};

// https://stackoverflow.com/questions/8885701/play-local-hard-drive-video-file-with-html5-video-tag
handleLoadMedia = files => {
  const file = files[0];
  const videoNode = document.createElement("video");
  const canPlay = videoNode.canPlayType(file.type);

  if (canPlay) {
    const fileURL = URL.createObjectURL(file);
    this.setState({
      transcriptData: DEMO_TRANSCRIPT,
      mediaUrl: fileURL,
      fileName: file.name
    });
  } else {
    alert("Select a valid audio or video file.");
  }
};

handleLoadMediaUrl = () => {
  const fileURL = prompt("Paste the URL you'd like to use here:");

  this.setState({
    transcriptData: DEMO_TRANSCRIPT,
    mediaUrl: fileURL
  });
};

handleLoadTranscriptJson = files => {
  const file = files[0];

  if (file.type === "application/json") {
    const fileReader = new FileReader();

    fileReader.onload = event => {
      this.setState({
        transcriptData: JSON.parse(event.target.result)
      });
    };

    fileReader.readAsText(file);
  } else {
    alert("Select a valid JSON file.");
  }
};

handleIsTextEditable = e => {
  this.setState({
    isTextEditable: e.target.checked
  });
};

handleSpellCheck = e => {
  this.setState({
    spellCheck: e.target.checked
  });
};

// https://stackoverflow.com/questions/21733847/react-jsx-selecting-selected-on-selected-select-option
handleSttTypeChange = event => {
  this.setState({ [event.target.name]: event.target.value });
};

handleChangeTranscriptName = value => {
  this.setState({ fileName: value });
};

clearLocalStorage = () => {
  localStorage.clear();
  console.info("Cleared local storage.");
};

handleAnalyticsEvents = event => {
  this.setState({ analyticsEvents: [...this.state.analyticsEvents, event] });
};


handleChangeTranscriptTitle = newTitle => {
  this.setState({
    title: newTitle
  });
};


handleAutoSaveChanges = newAutoSaveData => {
  console.log("handleAutoSaveChanges", newAutoSaveData);
  const { data, ext } = newAutoSaveData;
  this.setState({ autoSaveData: data, autoSaveExtension: ext });
  // Saving to local storage
  localSave(this.state.mediaUrl, this.state.fileName, data);
};


*/

handleExportFormatChange = event => {
  console.log("EXPORT METHOD");
  console.log(event.target.name, event.target.value);
  this.setState({ [event.target.name]: event.target.value });
};

exportTranscript = () => {
  console.log("export");
  // eslint-disable-next-line react/no-string-refs
  const { data, ext } = this.transcriptEditorRef.current.getEditorContent(
    this.state.exportFormat
  );
  let tmpData = data;
  if (ext === "json") {
    tmpData = JSON.stringify(data, null, 2);
  }
  if (ext !== "docx") {
    this.download(tmpData, `${this.state.mediaUrl}.${ext}`);
  }
};

// https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
download = (content, filename, contentType) => {
  console.log("download");
  const type = contentType || "application/octet-stream";
  const link = document.createElement("a");
  const blob = new Blob([content], { type: type });

  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  // Firefox fix - cannot do link.click() if it's not attached to DOM in firefox
  // https://stackoverflow.com/questions/32225904/programmatical-click-on-a-tag-not-working-in-firefox
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



  render() {

    return (

      <div className={style.container}>

                <TranscriptEditor
                  transcriptJSONBlob={this.state.transcriptJSONBlob}
                  fileName={""}
                  mediaUrl={this.state.mediaUrl}
                  isEditable={true}
                  spellCheck={false}
                  sttJsonType={this.state.sttType}
                  //handleAnalyticsEvents={false}
                  title={this.state.title}
                  ref={this.transcriptEditorRef}
                  //handleAutoSaveChanges={this.handleAutoSaveChanges}
                  autoSaveContentType={"MS Word"}
                  mediaType={ 'audio' }
                />
      </div>
    );
  }
}

TranscriptEditor.propTypes = {
  title: PropTypes.string,
  mediaUrl: PropTypes.string,
  fileName: PropTypes.string,
  transcriptJSON: PropTypes.string,
  transcriptJSONBlob: PropTypes.object
};
