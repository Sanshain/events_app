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


type SignUpType = {
  username?: string[],
  password?: string[],
  email?: string[],
}


const Title = styled("h1")`
  text-align: center;  
`;


interface IndexProps {}

const NewEvent: FunctionalComponent<IndexProps> = (props) => {

  const claimForm = useRef<HTMLFormElement>(null);    
  const [errors, setErrors] = useState<SignUpType>({})
  const titleInput = useRef(null);
  // const user = useStore(currentUser)


  function newEvent(event: Event) {
    if ((event as KeyboardEvent).key && (event as KeyboardEvent).key !== 'Enter') return;
    else {
      // авторизуемся
      fetch('events_list', {
        method: 'POST',
        body: new FormData(claimForm.current),
        headers: {
          //@ts-ignore
          'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value,
          Authorization: "Token " + localStorage.getItem('token')
        }
      }).then(r => r.ok ? r.json() : false).then(r => {
        if (r) {
          console.log(r);
          setErrors({});
          titleInput.current.value = '';
          alert('Congratulations!')          
        }
        else {
          alert('Введие полное имя и укажите дату')
        }
      })

      event.preventDefault()
      return false;
    }
  }

  return <div>
    <Title>New Event</Title>

    <form className={style.new_event} ref={claimForm}>
      <label htmlFor="title">Title:</label>
      <input name='name' id='title' type="text" placeholder='name' ref={titleInput} autoComplete="false" />
      <label htmlFor="date_id">Occuring Date:</label>
      <input name='occurring_date' type="date" placeholder='' id='date_id' autoComplete="false" />
      <label htmlFor="">Is Claim:
        <input name='is_claim' id='is_claim' type="checkbox" placeholder='' autoComplete="false" />
      </label>
      <button onClick={newEvent}>Sign Up</button>
    </form>

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

};

export default NewEvent;
