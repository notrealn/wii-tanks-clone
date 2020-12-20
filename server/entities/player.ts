import { Game } from "../game";
import { EntityType, GamePad } from "../types";
import { Entity } from "./entity";
import { Vector } from "../vector";


export class Player extends Entity {
  entityType: EntityType = 'Player';
  id: string;
  moveSpeed: number;
  turnSpeed: number;
  accel: Vector;

  constructor(id: string) {
    super();
    this.id = id;
    this.moveSpeed = 1;
    this.turnSpeed = 0.2;
    this.accel = new Vector(0, 0);
    this.size = 24;
  }

  update(state: Game['state']) {
    this.vel = this.vel.add(this.accel);
    state.players.forEach(other => {
      if (other == this)
        return;
      if (this.checkCollision(other))
        this.collide(other);
    });
    super.update(state);
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
      return false;

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

  collide(other: Entity) {
    switch (other.entityType) {
      case 'Player':
        this.applyForce(Math.atan2(other.pos.y - this.pos.y, other.pos.x - this.pos.x), -this.moveSpeed / 2);
    }
  }
}
