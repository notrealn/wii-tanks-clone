import React from 'react';
import io from 'socket.io-client';

import { renderApp } from '../../src/util';

import './style.scss';

const socket = io();

const App = (props: {}) => {
  return (
    <>
      <div>
        play the video game
      </div>
    </>
  );
};

renderApp(
  <App />
);
