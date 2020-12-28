import { Game } from '../game';
import { GamePad } from '../types';
import { Entity } from './entity';
import { Vector } from '../vector';
import { Bullet } from './bullet';
import { Map } from '../world/map';
import { Blocks } from '../world/block';
import { Tile } from '../world/tile';

export class Player extends Entity {
  name: string = 'player';
  id: string;
  moveSpeed: number;
  turnSpeed: number;
  accel: Vector;
  bullets: Bullet[];
  maxBullets: number;

  constructor(id: string) {
    super();
    this.id = id;
    this.moveSpeed = 1;
    this.turnSpeed = 0.2;
    this.accel = new Vector(0, 0);
    this.size = 24;
    this.bullets = []
    this.maxBullets = 4
  }

  update(state: Game['state'], map: Map) {
    this.vel = this.vel.add(this.accel);
    state.players.forEach(other => {
      if (other == this)
        return;
      if (this.checkCollision(other))
        this.collideEntity(other);
    });

    const mapCollideObject = this.checkMapCollision(map)
    if (mapCollideObject)
      this.collideMap(mapCollideObject)

    state.players.forEach(other => {
      for (let i = 0; i < other.bullets.length; i++) {
        if (other.bullets[i].bounces > 1) {
          delete other.bullets[i];
        }
      }
    });
    super.update(state, map);
    // console.log(this.angle)

  }

  move(gamepad: GamePad) {
    this.angle = this.angle < 0 ? Math.PI * 2 + this.angle : this.angle;
    this.angle %= Math.PI * 2;

    const foo = new Vector(0, 0);
    if (gamepad.up)
      foo.y++;
    if (gamepad.down)
      foo.y--;
    if (gamepad.left)
      foo.x--;
    if (gamepad.right)
      foo.x++;
    if (foo.x == 0 && foo.y == 0)
      return this.accel = new Vector(0, 0);
    if (gamepad.m1)
      this.shoot();

    // angle we want to be
    const angle = Math.atan2(-foo.y, foo.x) + Math.PI / 2;

    const a = angle - this.angle;
    const b = a + Math.PI * 2;
    const c = a - Math.PI * 2;

    // angle we want to turn by 
    let turnAngle = Math.abs(a) < Math.abs(b) ? a : b;
    turnAngle = Math.abs(turnAngle) < Math.abs(c) ? turnAngle : c;

    this.angle += Math.abs(turnAngle) < this.turnSpeed ? turnAngle : Math.sign(turnAngle) * this.turnSpeed;

    this.accel = new Vector(
      Math.cos(this.angle - Math.PI / 2) * this.moveSpeed,
      Math.sin(this.angle - Math.PI / 2) * this.moveSpeed
    );
  }

  shoot() {
    if (this.bullets.length >= this.maxBullets){
      let temp = new Bullet();
      temp.pos = this.pos;
      temp.vel = this.vel;
      this.bullets.push(temp);
    }

  }

  collideEntity(other: Entity) {
    switch (other.name) {
      case 'player':
        this.applyForce(Math.atan2(other.pos.y - this.pos.y, other.pos.x - this.pos.x), -this.moveSpeed / 2);
    }
  }

  collideMap(tile: Vector) {
    const pushFactor = this.moveSpeed + 1;
    // check if you are left of left side of tile
    if (this.pos.x < tile.x * 32)
      this.applyForce(Math.PI, pushFactor)
    // check if you are right of right side of tile
    if (this.pos.x > (tile.x + 1) * 32)
      this.applyForce(Math.PI, -pushFactor)
    // check if you are above top side of tile
    if (this.pos.y < tile.y * 32)
      this.applyForce(Math.PI / 2, -pushFactor)
    // check if you are below
    if (this.pos.y > (tile.y + 1) * 32)
      this.applyForce(Math.PI / 2, pushFactor)
    // else this.applyForce(Math.atan2(tile.y - this.pos.y, tile.x - this.pos.x), -this.moveSpeed);
  }
}
