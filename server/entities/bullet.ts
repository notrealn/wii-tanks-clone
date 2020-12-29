import { Game } from '../game';
import { Vector } from '../vector';
import { Entity } from './entity';
import { Map } from '../world/map';
import { Tile } from '../world/tile';
import { Blocks } from '../world/block';
import { Player } from './player';

export class Bullet extends Entity {
  name: string = 'bullet';
  moveSpeed: number;
  accel: Vector;
  bounces: number;
  playerId: string;
  iFrames: number;

  constructor(player: Player, angle: number) {
    super();
    this.playerId = player.id;
    this.pos = player.pos;
    this.angle = angle;
    this.size = 4;
    this.moveSpeed = 5;
    this.accel = new Vector(0, 0);
    this.bounces = 2;
    this.airRes = 1;
    this.iFrames = 0;
    this.applyForce(this.angle, this.moveSpeed)
  }

  update(state: Game['state'], map: Map) {
    if (this.iFrames > 0) this.iFrames--;

    const mapCollideObject = this.checkMapCollision(map)
    if (mapCollideObject)
      this.collideMap(mapCollideObject)

    if (!this.bounces)
      this.delete = true

    state.players.forEach((player) => {
      if (player.id == this.playerId)
        return;
      if (this.checkCollision(player))
        this.delete = true;
      player.bullets.forEach(bullet => {
        if (this.checkCollision(bullet))
          this.delete = true;
      })
    })
    super.update(state, map)
  }

  collideMap(tile: Vector) {
    if (!this.iFrames) {
      this.bounces--;
      this.iFrames = 5;
    }

    const pos = this.pos;

    // check if you are right of left side and left of right side
    if (this.pos.x > tile.x * 32 && this.pos.x < (tile.x + 1) * 32)
      pos.x -= this.vel.x;

    // check if you are below top side and above bottom side
    if (this.pos.y > tile.y * 32 && this.pos.y < (tile.y + 1) * 32)
      pos.y -= this.vel.y;

    // check if you are left of left side of tile
    if (pos.x < tile.x * 32)
      this.vel.x *= -1;
    // check if you are right of right side of tile
    if (pos.x > (tile.x + 1) * 32)
      this.vel.x *= -1;
    // check if you are above top side of tile
    if (pos.y < tile.y * 32)
      this.vel.y *= -1;
    // check if you are below
    if (pos.y > (tile.y + 1) * 32)
      this.vel.y *= -1;
  }
}
