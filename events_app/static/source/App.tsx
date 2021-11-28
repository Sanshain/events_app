import { h } from 'preact'
import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks'
//@ts-ignore
import style from "./style.css";

import { styled, css, setup } from 'goober';
import Router, { Link } from 'preact-router';
import Events from './Events';
import Login from './Login';
setup(h);

const Title = styled("h1")`
  text-align: center;  
`;


type EventType = {
  id: number,
  name: string,
  occurring_date: string,
  author?: string  // email
}


interface IndexProps { }

const App: FunctionalComponent<IndexProps> = (props) => {

  return (
    <div>
      <nav>
        <Link href="/">Events</Link>
        <Link href="/login">Login</Link>
        {/* <Link href="/claim">Claim</Link> */}
      </nav>
      <main>
        <Router>
          <Events path="/" />
          <Login path="/login" />
        </Router>
      </main>
    </div>
  );
};

export default App;
