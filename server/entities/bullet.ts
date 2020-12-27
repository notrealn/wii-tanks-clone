import { Game } from '../game';
import { Vector } from '../vector';
import { Entity } from './entity';
import { Map } from '../world/map';
import { Tile } from '../world/tile';
import { Blocks } from '../world/block';

export class Bullet extends Entity {
  name: string = 'bullet';
  moveSpeed: number;
  accel: Vector;
  bounces: number;

  constructor() {
    super();
    this.moveSpeed = 1;
    this.accel = new Vector(0, 0);
    this.bounces = 0;
  }

  update(state: Game['state'], map: Map) {
    this.vel = this.vel.add(this.accel);
    super.update(state, map);
    if (this.checkMapCollision(map)) {
      this.collide(true)
    }
  }

  collide(other: Entity | Tile | boolean) {
    if (typeof other == 'boolean') {
      this.bounces++;
      return this.applyForce(1, -this.moveSpeed);
    }
  }
}
