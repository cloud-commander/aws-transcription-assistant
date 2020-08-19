import * as React from 'react';

import './App.css';
import { UploadAudio } from './components/UploadAudio';
import { AudioRecordTable } from './components/AudioRecordTable';
//import LoadHelp from './LoadHelp';
import { withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';


const App = () => (
        <div className="App">
            <header className="App-header">
            
                <h1 className="App-title"> <img src="https://d0.awsstatic.com/logos/powered-by-aws-white.png" alt="Powered by AWS Cloud Computing" height="45"/>&nbsp;&nbsp;&nbsp;Transcription Assistant</h1>
            </header>
            <div className="App-body">
                <UploadAudio />
                <AudioRecordTable />
                
            </div>
            
            <AmplifySignOut />
        </div>
    );
export default withAuthenticator(App);

