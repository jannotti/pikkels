import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Pikkels from './pikkels';

import 'bootstrap/dist/css/bootstrap.css';
import './pikkels.css';

ReactDOM.render(<MuiThemeProvider><Pikkels/></MuiThemeProvider>,
                document.getElementById('root'));

