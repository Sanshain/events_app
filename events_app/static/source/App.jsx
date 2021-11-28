import { h, Fragment } from 'preact'
import { useState } from 'preact/hooks'

import { styled, css, setup } from 'goober';

setup(h);

const Title = styled("h1")`
  text-align: center;
  color: red;
`;

const BtnClassName = css`
  background-color: lightgray;
`;

const App = props => {
  const [message] = useState('Preact App')

  return <>
    <header />
    <main class={BtnClassName}>
      <h1 class='title'>{message}</h1>
    </main>
	 <Title>789</Title>	 
  </>
}

export default App
