import { Sprite, Texture } from 'pixi.js';
import { Tile } from '../../server/world/tile';

const { default: tankbase } = require('../assets/tankbase.png');
const { default: deadtank } = require('../assets/deadtank.png');
const { default: tankturret } = require('../assets/tankturret.png');
const { default: bullet } = require('../assets/bullet.png');
const { default: wall } = require('../assets/wall.png');
const { default: none } = require('../assets/none.png');

export class ClientPlayer extends Sprite {
  id: string;
  bullets: ClientBullet[];

  constructor(id: string) {
    super();
    this.id = id;
    this.texture = Texture.from(tankbase);
    this.anchor.set(0.5);
    this.bullets = [];
  }

  die() {
    this.texture = Texture.from(deadtank)
  }
}

export class ClientTurret extends Sprite {
  id: string;

  constructor(id: string) {
    super();
    this.id = id;
    this.texture = Texture.from(tankturret);
    this.anchor.set(0.5);
    this.zIndex = 3;
  }

  die() {
    this.texture = Texture.from(none);
  }
}

export class ClientBullet extends Sprite {
  constructor() {
    super()
    this.texture = Texture.from(bullet)
    this.anchor.set(0.5)
  }
}

export class ClientWall extends Sprite {
  constructor(x: number, y: number) {
    super()
    this.texture = Texture.from(wall)
    this.x = x
    this.y = y
  }
}

export interface ClientState {
  players: {
    [id: string]: ClientPlayer;
  }
  turrets: {
    [id: string]: ClientTurret;
  }
  bullets: {
    [id: string]: ClientBullet[];
  }
}

export interface ClientMap {
  tiles: Tile[]
  width: number
  height: number
}