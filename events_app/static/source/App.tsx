import { h } from 'preact'
import { FunctionalComponent } from 'preact';
import { useState, useEffect } from 'preact/hooks'


import { styled, css, setup } from 'goober';

setup(h);

const Title = styled("h1")`
  text-align: center;
  color: red;
`;

type EventType = {
  id: number,
  name: string,
  author? : string  // email
}

interface IndexProps { }

const App: FunctionalComponent<IndexProps> = () => {  
  
  let [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    //@ts-ignore
    fetch(restRoutes.eventsList).then(r => r.ok ? r.json() : false).then(r => {
      if (r) {        
        setEvents(r)
      }
    })
  });

  return (
    <div>
      <main>
        <h2>Events:</h2>
        <ul>
           
        </ul>
      </main>
    </div>
  );
};

export default App;
