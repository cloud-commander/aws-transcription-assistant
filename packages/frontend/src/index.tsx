import * as React from 'react';
import * as ReactDOM from 'react-dom';

import 'semantic-ui-css/semantic.min.css';
import './index.css';

import Amplify from 'aws-amplify';

import  App from './App';

import registerServiceWorker from './registerServiceWorker';

/** Amplify config */
import awsconfig from './aws-exports';

/** Configure amplify */
Amplify.configure(awsconfig);


ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
