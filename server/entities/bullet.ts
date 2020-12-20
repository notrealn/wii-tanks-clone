import { EntityType } from "../types";
import { Vector } from "../vector";
import { Entity } from "./entity";


export class Bullet extends Entity {
  entityType: EntityType = 'Bullet';
  moveSpeed: number;
  accel: Vector;

  constructor() {
    super();
    this.moveSpeed = 0;
    this.accel = new Vector(0, 0);
  }
}
