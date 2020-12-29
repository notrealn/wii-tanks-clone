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
  freezeFrames: number;
  turretAngle: number;
  dead: boolean;

  constructor(id: string) {
    super();
    this.dead = false;
    this.id = id;
    this.moveSpeed = 2;
    this.turnSpeed = 0.2;
    this.accel = new Vector(0, 0);
    this.size = 24;
    this.bullets = []
    this.maxBullets = 4
    this.freezeFrames = 0;
    this.turretAngle = 0;
  }

  update(state: Game['state'], map: Map) {
    for (let i = 0; i < this.maxBullets; i++) {
      if (!this.bullets[i])
        continue;
      this.bullets[i].update(state, map)
      if (this.bullets[i].delete)
        delete this.bullets[i]
    }

    if (this.dead) return;

    state.players.forEach(player => {
      if (player.id == this.id)
        return;
      if (this.checkCollision(player))
        this.collideEntity(player);
      player.bullets.forEach(bullet => {
        if (this.checkCollision(bullet))
          this.collideEntity(bullet)
      })
    });

    const mapCollideObject = this.checkMapCollision(map)
    if (mapCollideObject)
      this.collideMap(mapCollideObject)

    if (this.freezeFrames > 0) return this.freezeFrames--;

    this.vel = this.vel.add(this.accel);

    super.update(state, map);
    // console.log(this.angle)

  }

  move(gamepad: GamePad) {
    if (this.dead) return;
    this.angle = this.angle < 0 ? Math.PI * 2 + this.angle : this.angle;
    this.angle %= Math.PI * 2;

    this.turretAngle = Math.atan2(gamepad.mouse.pos.x - this.pos.x, this.pos.y - gamepad.mouse.pos.y);

    const foo = new Vector(0, 0);
    if (gamepad.up)
      foo.y++;
    if (gamepad.down)
      foo.y--;
    if (gamepad.left)
      foo.x--;
    if (gamepad.right)
      foo.x++;
    if (gamepad.mouse.m1)
      this.shoot();
    if (foo.x == 0 && foo.y == 0)
      return this.accel = new Vector(0, 0);

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
    for (let i = 0; i < this.maxBullets; i++) {
      if (!this.bullets[i]) {
        this.freezeFrames = 5;

        return this.bullets[i] = new Bullet(this, this.turretAngle)
      }
    }
  }

  collideEntity(other: Entity) {
    switch (other.name) {
      case 'player':
        this.applyForce(Math.atan2(other.pos.x - this.pos.x, this.pos.y - other.pos.y), -this.moveSpeed / 2);
        break;
      case 'bullet':
        this.dead = true
        console.log(this.id + ' died')
    }
  }

  collideMap(tile: Vector) {
    const pushFactor = this.moveSpeed + 1;
    // check if you are left of left side of tile
    if (this.pos.x < tile.x * 32)
      this.applyForce(Math.PI / 2, -pushFactor)
    // check if you are right of right side of tile
    if (this.pos.x > (tile.x + 1) * 32)
      this.applyForce(Math.PI / 2, pushFactor)
    // check if you are above top side of tile
    if (this.pos.y < tile.y * 32)
      this.applyForce(0, pushFactor)
    // check if you are below
    if (this.pos.y > (tile.y + 1) * 32)
      this.applyForce(0, -pushFactor)
  }
}
