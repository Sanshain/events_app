import './style.css'

import { h } from 'preact';
import render from 'preact-render-to-string';
import App from './App.jsx';

let html = render(<App/>);

const fs = require('fs');
fs.writeFileSync('prerender.html', html);		