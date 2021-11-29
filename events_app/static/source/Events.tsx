import { h } from 'preact'
import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks'
//@ts-ignore
import style from "./style.css";

import { styled, css, setup } from 'goober';
import OrderBy from "./SVG/OrderBy";
import { route } from 'preact-router';
setup(h);

const Title = styled("h1")`
  text-align: center;  
`;


const claim_button = (props) => css`    
    /* visibility: ${props.claimed ? 'hidden' : 'visible'}; */
    opacity: ${props.claimed ? '0.5' : '1'};
    pointer-events: ${props.claimed ? 'none' : 'auto'};
    width: 5em;
    cursor: pointer;
`;


type EventType = {
  id: number,
  name: string,
  is_claim: Boolean,
  occurring_date: string,
  
  author?: string,  // email
  claimed?: boolean,
}

type UserType = {}

interface IndexProps {
  user: any
}

let order = false;

const App: FunctionalComponent<IndexProps> = (props) => {

  const [commonEvents, setEvents] = useState<EventType[]>([]);  

  useEffect(() => {
    //@ts-ignore
    // user = authUser;
    //@ts-ignore
    fetch(restRoutes.eventsList, {
      headers: {
        Authorization: "Token " + localStorage.getItem('token')
      }
    }).then(r => r.ok ? r.json() : false).then(r => {
      if (r) {
        setEvents(r)
      }
    })
  }, [props.user]);

  const claimCreate = (event: Event) => {
    // route('/claim')
    let index = +(event.currentTarget as HTMLElement).getAttribute('data-id');
    let selectedEvent = commonEvents[index];

    console.log(index);
    console.log(commonEvents);
    console.log(selectedEvent);
    
    let target = event.target as HTMLElement;

    if (selectedEvent.is_claim) {

      if (!(event.target as HTMLInputElement).files.length)
      {
        alert('Недействительная картинка. Попробуйте еще раз')
        return;
      }      

      var reader = new FileReader();
      reader.onloadend = function () {

        let base64Img = (reader.result as string)  // .replace(/^data:image\/(png|jpg);base64,/, "");
        console.log('RESULT', base64Img)

        fetch('claim_create/' + + selectedEvent.id.toString(), {
          method: 'POST',
          body: JSON.stringify({
            image: base64Img,
            event: selectedEvent.id.toString()
          }),
          headers: {
            //@ts-ignore
            'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value,
            "Content-Type": 'application/json',
            Authorization: "Token " + localStorage.getItem('token')
          }
        }).then(r => r.ok ? r.json() : false).then(r => {
          console.log(r);
          commonEvents[index].claimed = true;
          setEvents(commonEvents)
          target.style.opacity = '.5'
          target.style.pointerEvents = 'none'
          alert('Congratulations!')
        })
      }
      reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
    }
    else fetch('claim_create', {
      method: 'POST',
      body: JSON.stringify({ event: selectedEvent.id.toString() }),
      headers: {
        //@ts-ignore
        "Content-Type": 'application/json',
        //@ts-ignore
        'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value,
        Authorization: "Token " + localStorage.getItem('token')
      }
    }).then(r => r.ok ? r.json() : false).then(r => {
      console.log(r);
      commonEvents[index].claimed = true;      
      setEvents(commonEvents)

      target.style.opacity = '.5'
      target.style.pointerEvents = 'none'

      alert('Congratulations!')
    })
  }


  function debounce(func, delay) {

    let isCooldown = false;
    return function (event: Event, story)
    {
      if (isCooldown) return;

      let r = func(event, story);

      isCooldown = true;
      setTimeout(() => isCooldown = false, delay);

      return r;
    };

  }

  function filter(event:Event, story) {
       
    let target = event.target as HTMLInputElement

    const uri = 'events_list?search=' + encodeURIComponent(target.value)

    console.log(333);

    fetch(uri, { headers: { Authorization: "Token " + localStorage.getItem('token')}}).then(r => r.json()).then(r => {
      
      console.log(r);
      setEvents(r)      
    })
  }
  
  function orderBy(event: Event) {
    const uri = `events_list?ordering=${order ? '' : '-'}occurring_date`
    fetch(uri, { headers: { Authorization: "Token " + localStorage.getItem('token') } }).then(r => r.json()).then(r => {

      console.log(r);
      order = !order;
      console.log(order);
      
      setEvents(r)
    })
  }

  let debounceFilter = debounce(filter, 400);

  return (
    <div>      

      <main>
        <Title>Events:</Title>

        <input type="search" name="" id={style.search} placeholder='enter event name'
          onInput={event => debounceFilter(event, false)}
          onChange={(event) => filter(event, true)} />
        <OrderBy className={style.sort} styles={`transform:rotate(${order ? '18': ''}0deg)`} onClick={orderBy} />

        <ul className={style.events}>
          {commonEvents.map((event, i) => {
            return <li>
              <div className={style.row}>
                <span>{event.name}</span>
                <span>{event.occurring_date}</span>
                <span>{event.author}</span>
                {event.is_claim ? <label class={claim_button({ claimed: event.claimed })} for={"claim_" + i}>
                  {event.claimed ? 'claimed' : 'Claim'}
                </label> : ''}
                
                {
                  event.is_claim
                    ? <input class={claim_button({claimed:event.claimed})} id={"claim_" + i} type="file" data-id={i} accept="image/*,image/jpeg" onChange={claimCreate} />
                    : <input class={claim_button({ claimed: event.claimed })} id={"claim_" + i} type="submit" data-id={i} onClick={claimCreate} value={event.claimed ? 'claimed' : 'react'} />
                }
                
              </div>
            </li>
          })}
        </ul>
      </main>
    </div>
  );
};

export default App;
