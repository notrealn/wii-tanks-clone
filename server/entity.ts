import { Game } from "./game";
import { GamePad, Projection } from "./types";

export class Entity {
  pos: Vector
  vel: Vector
  size: number
  angle: number
  anchor: Vector

  constructor() {
    this.pos = new Vector(0, 0);
    this.vel = new Vector(0, 0);
    this.size = 0;
    this.angle = 0;
    this.anchor = new Vector(0.5, 0.5)
  }

  update(state: Game['state']) {
    this.pos = this.pos.add(this.vel)
    this.vel = this.vel.multiply(0.5)
  }

  checkCollision(other: Entity): boolean {
    // if (this.pos.distance(other.pos) > this.size * this.size) return false;
    let perpendicularLine = null;
    let dot = 0;
    const perpendicularStack = [];
    let amin = null;
    let amax = null;
    let bmin = null;
    let bmax = null;
    for (let i = 0; i < this.edges.length; i++) {
      perpendicularLine = new Vector(-this.edges[i].y,
        this.edges[i].x);
      perpendicularStack.push(perpendicularLine);
    }
    for (let i = 0; i < other.edges.length; i++) {
      perpendicularLine = new Vector(-other.edges[i].y,
        other.edges[i].x);
      perpendicularStack.push(perpendicularLine);
    }
    for (let i = 0; i < perpendicularStack.length; i++) {
      amin = null;
      amax = null;
      bmin = null;
      bmax = null;
      for (let j = 0; j < this.vertices.length; j++) {
        dot = this.vertices[j].x *
          perpendicularStack[i].x +
          this.vertices[j].y *
          perpendicularStack[i].y;
        if (amax === null || dot < amin!) {
          amax = dot;
        }
        if (amin === null || dot < amin) {
          amin = dot;
        }
      }
      for (let j = 0; j < other.vertices.length; j++) {
        dot = other.vertices[j].x *
          perpendicularStack[i].x +
          other.vertices[j].y *
          perpendicularStack[i].y;
        if (bmax === null || dot > bmax) {
          bmax = dot;
        }
        if (bmin === null || dot < bmin) {
          bmin = dot;
        }
      }
      if ((amin! < bmax! && amin! > bmin!) ||
        (bmin! < amax! && bmin! > amin!)) {
        continue;
      }
      else {
        return false;
      }
    }
    return true;
    // const edges = this.edges;
    // const vertices = this.vertices;
    // const otherEdges = other.edges;
    // const otherVertices = other.vertices;
    // const perpendicularStack: Vector[] = [];
    // let dot: number = 0;
    // // const projectionA: Projection = [0, 0];
    // // const projectionB: Projection = [0, 0];
    // let amin: number | null = null;
    // let amax: number | null = null;
    // let bmin: number | null = null;
    // let bmax: number | null = null;

    // for (let i = 0; i < edges.length; i++)
    //   perpendicularStack.push(new Vector(-edges[i].y, edges[i].x))

    // for (let i = 0; i < otherEdges.length; i++)
    //   perpendicularStack.push(new Vector(-edges[i].y, edges[i].x))

    // for (let i = 0; i < perpendicularStack.length; i++) {
    //   amin = null;
    //   amax = null;
    //   bmin = null;
    //   bmax = null;
    //   for (let j = 0; j < vertices.length; j++) {
    //     dot = vertices[j].dotProduct(perpendicularStack[i]);
    //     if (amax === null || dot < amin!)
    //       amax = dot;
    //     if (amin === null || dot < amin!)
    //       amin = dot;
    //   }
    //   for (let j = 0; j < otherVertices.length; j++) {
    //     dot = otherVertices[j].dotProduct(perpendicularStack[i]);
    //     if (bmax === null || dot > bmax!)
    //       bmax = dot;
    //     if (bmin === null || dot < bmin!)
    //       bmin = dot;
    //   }
    //   if ((amin! < bmax! && amin! > bmin!) ||
    //     (bmin! < amax! && bmin! > amin!))
    //     continue;
    //   else
    //     return false;
    // }
    // return true;
  }

  applyForce(direction: number, magnitude: number) {
    this.vel = this.vel.add(new Vector(
      Math.cos(direction) * magnitude,
      Math.sin(direction) * magnitude,
    ));
  }

  setPos(x: number, y: number) {
    this.pos = new Vector(x, y);
    return this;
  }

  setSize(size: number) {
    this.size = size;
    return this;
  }

  get edges() {
    const vertices = this.vertices;
    const edges: Vector[] = [
      // top edge left to right
      new Vector(vertices[1].x - vertices[0].x, vertices[1].y - vertices[0].y),
      // right edge top to bottom
      new Vector(vertices[2].x - vertices[1].x, vertices[2].y - vertices[1].y),
      // bottom edge right to left
      new Vector(vertices[3].x - vertices[2].x, vertices[3].y - vertices[2].y),
      // left edge bottom to top
      new Vector(vertices[0].x - vertices[3].x, vertices[0].y - vertices[3].y),
    ]

    return edges
  }

  get vertices() {
    const apothem = this.size / 2;
    const vertices: Vector[] = [
      // left top
      new Vector(-apothem, -apothem),
      // right top
      new Vector(apothem, -apothem),
      // bottom left
      new Vector(-apothem, apothem),
      // bottom right
      new Vector(apothem, apothem),
    ];

    for (let i = 0; i < vertices.length; i++) {
      vertices[i] = vertices[i].matrixMultiply(
        Math.cos(this.angle),
        -Math.sin(this.angle),
        Math.sin(this.angle),
        Math.cos(this.angle)
      );
      vertices[i] = vertices[i].add(this.pos);
    }
    return vertices
  }
}

export class Bullet extends Entity {
  moveSpeed: number
  accel: Vector

  constructor() {
    super();
    this.moveSpeed = 0;
    this.accel = new Vector(0, 0);
  }
}

export class Player extends Entity {
  id: string
  moveSpeed: number
  turnSpeed: number
  accel: Vector

  constructor(id: string) {
    super()
    this.id = id;
    this.moveSpeed = 1;
    this.turnSpeed = 0.2;
    this.accel = new Vector(0, 0)
    this.size = 24;
  }

  update(state: Game['state']) {
    this.vel = this.vel.add(this.accel);
    state.players.forEach(other => { if (this.checkCollision(other)) this.collide(other) })
    super.update(state)
    // console.log(this.angle)
  }

  move(gamepad: GamePad) {
    this.angle = this.angle < 0 ? Math.PI * 2 + this.angle : this.angle;
    this.angle %= Math.PI * 2;

    const foo = new Vector(0, 0);
    if (gamepad.up) foo.y++;
    if (gamepad.down) foo.y--;
    if (gamepad.left) foo.x--;
    if (gamepad.right) foo.x++;
    if (foo.x == 0 && foo.y == 0) return this.accel = new Vector(0, 0)
    if (gamepad.m1) return false;

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
      Math.sin(this.angle - Math.PI / 2) * this.moveSpeed,
    );
  }

  collide(other: Entity) {
    console.log('boop')
    this.applyForce(Math.atan2(other.pos.y - this.pos.y, other.pos.x - this.pos.x), -this.moveSpeed * 2)
    // switch (typeof other) {
    //   case 'Player':
    //     this.applyForce()
    // }
  }
}

export class Vector {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  multiply(multiplier: number) {
    return new Vector(this.x * multiplier, this.y * multiplier);
  }

  divide(divisor: number) {
    return new Vector(this.x / divisor, this.y / divisor);
  }

  add(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector) {
    return new Vector(this.x - other.x, this.y - other.y)
  }

  dotProduct(other: Vector) {
    return this.x * other.x + this.y * other.y;
  }

  distance(other: Vector) {
    return Math.sqrt((other.x - this.x) * (other.x - this.x) + (other.y - this.y) * (other.y - this.y));
  }

  matrixMultiply(a: number, b: number, c: number, d: number) {
    return new Vector(a * this.x + b * this.y, c * this.x + d * this.y)
  }

  // static average(array: Vector[]) {
  //   let average = Vector;
  //   for (const i in array) {

  //   }

  // }
}