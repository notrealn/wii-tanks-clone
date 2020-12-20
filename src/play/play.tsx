import React from 'react';
import io from 'socket.io-client';
import { Application, Graphics, Loader, Sprite, Texture, utils } from "pixi.js";
import { renderApp } from '../../src/util';

import { KeyHandler } from './keyhandler'
import { GameState } from '../../server/types';
import './style.scss';
import { Player } from '../../server/entities/player';

const App = (props: {}) => {
  return (
    <>
      <div id="game"></div>
    </>
  );
};

renderApp(<App />);

const socket = io('ws://192.168.86.35:3000', { transports: ['websocket'] });

socket.on("connect", () => {
  console.log(`connected, socket id is ${socket.id}`);
});

const keyhandler = new KeyHandler();

const app = new Application({
  width: 512,
  height: 384,
  autoDensity: true,
});
app.view.style.removeProperty('height');
app.view.style.removeProperty('width');
document.querySelector('#game')?.appendChild(app.view);

const { default: bgimg } = require('../assets/background.png')
const { default: tankbase } = require('../assets/tankbase.png')
const background = Sprite.from(bgimg);
app.stage.addChild(background)

const clientState: ClientState = {
  players: {}
};

socket.on('tick', (state: GameState) => {
  for (const player of state.players) {
    const p = clientState.players[player.id];
    if (p == null) {
      console.log('adding player ' + player.id)
      clientState.players[player.id] = new ClientPlayer(player.id);
      app.stage.addChild(clientState.players[player.id]);
    }
    clientState.players[player.id].x = player.pos.x;
    clientState.players[player.id].y = player.pos.y;
    clientState.players[player.id].rotation = player.angle;
    // console.log(clientState);
  }
})

socket.on('remove', (id: string) => {
  console.log('removing player ' + id)
  app.stage.removeChild(clientState.players[id])
  delete clientState.players[id];
});

setInterval(() => {
  socket.emit('input', keyhandler.gamepad);
}, 1000 / 24);

class ClientPlayer extends Sprite {
  id: string
  constructor(id: string) {
    super();
    this.id = id;
    this.texture = Texture.from(tankbase)
    this.anchor.set(0.5);
  }
}

interface ClientState {
  players: {
    [id: string]: ClientPlayer;
  }
}