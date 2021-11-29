import { h, Fragment } from 'preact';
import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks'
//@ts-ignore
import style from "./style.css";

import { styled, css, setup } from 'goober';
import Router, { Link } from 'preact-router';
import Events from './Events';
import Login from './Login';
import NewEvent from './NewClaim';
setup(h);

const Title = styled("h1")`
  text-align: center;  
`;

type UserType = {
  id: number,
  is_author: boolean,
  username: string
}

type EventType = {
  id: number,
  name: string,
  occurring_date: string,
  author?: string  // email
}


interface IndexProps { }

const App: FunctionalComponent<IndexProps> = (props) => {

  let [authUser, setAuthUser] = useState<UserType|null>(null);
  let user_id = localStorage.getItem('user_id')

  useEffect(() => {
    user_id && fetch('user/' + user_id, {
      headers: {
        Authorization: "Token " + localStorage.getItem('token')
      }
    }).then(r => r.ok ? r.json() : false).then(r => {
      if (r) {
        console.log(r);
        setAuthUser(r);
      }
    });
  }, [])


  return (
    <div>
      <nav>
        <Link href="/">Events</Link>
        
        {!authUser ? <Fragment><a></a><Link href="/login">Login</Link></Fragment> : <Fragment>
          {authUser.is_author
            ? <Link href='/new_event'>New event</Link>
            : <a href='/claims' onClick={(e) => { alert('todo'); e.preventDefault() }}>Your Claims</a>}
          <Link href='/login' onClick={(e) => { localStorage.removeItem('token'); setAuthUser(null) }}>
            Logout <span style='opacity:0.3'>({authUser.username})</span>
          </Link>
        </Fragment>}
      </nav>
      <main>
        <Router>
          <Events path="/" user={authUser} />
          <Login path="/login" user={authUser} setUser={setAuthUser} />
          <NewEvent path='/new_event' />
          
        </Router>
      </main>
    </div>
  );
};

export default App;
