import React from 'react';
import io from 'socket.io-client';
import { Application, Graphics, Loader, Sprite, Texture, utils } from 'pixi.js';
import { renderApp } from '../../src/util';

import { KeyHandler } from './keyhandler'
import { GameState } from '../../server/types';
import './style.scss';
import { Player } from '../../server/entities/player';
import { Tile } from '../../server/world/tile';
import { Map } from '../../server/world/map';
import { Client } from 'socket.io/dist/client';
import { ClientBullet, ClientPlayer, ClientState, ClientMap, ClientWall, ClientTurret } from './client-class';
import { Wall } from '../../server/world/block';

const App = (props: {}) => {
  return (
    <>
      <div id='game'></div>
    </>
  );
};

renderApp(<App />);

const socket = io('ws://192.168.86.35:3000', { transports: ['websocket'] });

socket.on('connect', () => {
  console.log(`connected, socket id is ${socket.id}`);
});

const app = new Application({
  width: 512,
  height: 384,
  autoDensity: true,
  // antialias: true,
  resolution: 8
});
app.view.style.removeProperty('height');
app.view.style.removeProperty('width');
document.querySelector('#game')?.appendChild(app.view);

const keyhandler = new KeyHandler(app.view);

const { default: bgimg } = require('../assets/background.png')

const background = Sprite.from(bgimg);
background.zIndex = 0;
app.stage.addChild(background)

const clientState: ClientState = {
  players: {},
  bullets: {},
  turrets: {}
};

const map: ClientMap = {
  tiles: [],
  width: 0,
  height: 0,
}

socket.on('map', (req: Map) => {
  map.tiles = req.tiles;
  map.width = req.width;
  map.height = req.height;
  for (const tile of map.tiles) {
    if (tile.block.name == 'air') continue;
    if (tile.block.name == 'wall') {
      const wall = new ClientWall(tile.pos.x * 32, tile.pos.y * 32)
      app.stage.addChild(wall)
    }
  }
});

socket.on('tick', (state: GameState) => {
  for (const player of state.players) {
    const p = clientState.players[player.id];
    if (!p) {
      console.log('adding player ' + player.id)
      clientState.players[player.id] = new ClientPlayer(player.id);
      clientState.turrets[player.id] = new ClientTurret(player.id);
      app.stage.addChild(clientState.players[player.id]);
      app.stage.addChild(clientState.turrets[player.id]);
    }
    if (player.dead) {
      clientState.players[player.id].die()
      clientState.turrets[player.id].die()
    }
    clientState.players[player.id].x = player.pos.x;
    clientState.players[player.id].y = player.pos.y;
    clientState.players[player.id].rotation = player.angle;
    clientState.turrets[player.id].x = player.pos.x;
    clientState.turrets[player.id].y = player.pos.y;
    clientState.turrets[player.id].rotation = player.turretAngle;
    // console.log(clientState);
    for (let i = 0; i < player.maxBullets; i++) {
      if (!clientState.bullets[player.id]) clientState.bullets[player.id] = []
      if (!player.bullets[i]) {
        if (clientState.bullets[player.id][i]) {
          app.stage.removeChild(clientState.bullets[player.id][i]);
          delete clientState.bullets[player.id][i];
        }
        continue;
      }
      const b = clientState.bullets[player.id][i]
      if (!b) {
        clientState.bullets[player.id][i] = new ClientBullet()
        app.stage.addChild(clientState.bullets[player.id][i])
      }
      clientState.bullets[player.id][i].x = player.bullets[i].pos.x;
      clientState.bullets[player.id][i].y = player.bullets[i].pos.y;
    }
  }
})
// app.stage.addChild(new ClientBullet())
socket.on('remove', (id: string) => {
  console.log('removing player ' + id)
  app.stage.removeChild(clientState.players[id])
  app.stage.removeChild(clientState.turrets[id])
  clientState.bullets[id].forEach(bullet => app.stage.removeChild(bullet))
  delete clientState.players[id];
  delete clientState.turrets[id];
  delete clientState.bullets[id];
});

setInterval(() => {
  socket.emit('input', keyhandler.gamepad);
}, 1000 / 24);

