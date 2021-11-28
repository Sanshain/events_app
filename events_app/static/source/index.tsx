import './style.css'

import { h, render } from 'preact'
// import App from './App'
// import App from "./components/app";
import App from './TSApp'

render(<App />, document.getElementById('root') as HTMLElement)
