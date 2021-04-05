import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './app';
import { installServiceWorker } from './service-worker/install';

installServiceWorker();

ReactDOM.render(<App />, document.getElementById('root'));
