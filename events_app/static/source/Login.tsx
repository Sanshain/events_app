import { h } from 'preact'
import { FunctionalComponent } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks'
//@ts-ignore
import style from "./style.css";

import { styled, css, setup } from 'goober';
import { Link, route } from 'preact-router';
import Events from './Events';

import { Tabs, Tab } from 'preact-hashtabs'
// import { currentUser } from './store';
import { useStore } from '@nanostores/preact';

setup(h);

const Title = styled("h1")`
  text-align: center;
  /* visibility: hidden; */
`;


type SignUpType = {
  username?: string[],
  password?: string[],
  email?: string[],
}


interface IndexProps {
  user: any,
  setUser?: Function
 }

const Login: FunctionalComponent<IndexProps> = (props) => {

  const loginForm = useRef<HTMLFormElement>(null);
  const signupForm = useRef(null);
  const [signupState, setSignupState] = useState<Boolean>(false)
  const [errors, setErrors] = useState<SignUpType>({})
  // const user = useStore(currentUser)

  function login(event: Event) {

    if ((event as KeyboardEvent).key && (event as KeyboardEvent).key !== 'Enter') return;
    else {
      // авторизуемся
      let form = new FormData(loginForm.current);
      fetch('api-token-auth', {
        method: 'POST',
        body: new FormData(loginForm.current),
        headers: {
          //@ts-ignore 
          'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value,
          // Authorization: "Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
        }
      }).then(r => r.ok ? r.json() : false).then(r => {
        if (r) {
          console.log(r);
          localStorage.setItem('token', r.token)
          localStorage.setItem('user_id', r.user_id)
          props.setUser({
            username: r.username
          })
          // currentUser.set({ username: form.get('username').toString()})
          route('/')

          // user.username = form.get('username').toString()
          // setUser({ username: '' })
          // let u = user;
        }
        else {
          alert('Неверный логин и пароль')
        }
      })

      event.preventDefault()
    }

  }

  function signUp(event: Event) {
    if ((event as KeyboardEvent).key && (event as KeyboardEvent).key !== 'Enter') return;
    else {
      // авторизуемся
      fetch('user_sign_up', {
        method: 'POST',
        body: new FormData(loginForm.current),
        headers: {
          //@ts-ignore
          'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value,
        }
      }).then(r => r.ok ? r.json() : (async function ()
      {
        alert('Проверьте данные')
        const someErrors = await r.json();
        setErrors(someErrors);
        
        return false;
      })()).then(r => {
        if (r) {
          console.log(r);
          setErrors({});
          alert('Congratulations!')
          setSignupState(!signupState)
        }
      })

      event.preventDefault()
      return false;
    }
  }


  return (

    <div>
      <Title>{!signupState ? 'Sign In' : 'Sign Up'}</Title>
      <div className={style.switch} onClick={() => setSignupState(!signupState)}>{signupState ? 'Sign In' : 'Sign Up'}</div>

      {/*  + ' ' + style.active */}

      {
        !signupState ? <form className={style.sign_in} ref={loginForm}>
          <input name='username' type="text" placeholder='Login' />
          <input name='password' type="password" placeholder='Password' onKeyDown={login} autoComplete="false" />
          <button onClick={login}>Login</button>
        </form> :
        <form className={style.sign_up}>
          <input name='username' type="text" placeholder='Login' ref={signupForm} autoComplete="false" />
          <input name='password' type="password" placeholder='Password' autoComplete="false"/>
          <input name='password2' type="password" placeholder='Password' autoComplete="false"/>
          <input name='email' type="e-mail" placeholder='email' onKeyDown={signUp} />
          <button onClick={signUp}>Sign Up</button>
        </form>
      }

      <ul class={style.errors}>
        {
          Object.entries(errors).map(([field, fieldErrors]) => {
            return <li>
              <div style="text-align:center">{field}</div>
              <ul>
                {fieldErrors.map(_error => <li>{_error}</li>)}
              </ul>
            </li>
          })
        }
      </ul>

    </div>
  );
};

export default Login;
