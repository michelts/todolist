import React from 'react';
import { render } from 'react-dom';
import Index from './components/Index';

import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('app');

render(<Index />, container);
