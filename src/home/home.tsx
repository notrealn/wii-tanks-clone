import React from 'react';
import { renderApp } from '../../src/util';
import './style.scss';



const App = (props: {}) => {
  return (
    <>
      <div>
        <h1>Wii Tanks Clone!!!</h1>
        The controls are wsad to move and click to shoot.
        <button><a href="play">Play</a></button>
      </div>
    </>
  );
};

renderApp(
  <App />
);
