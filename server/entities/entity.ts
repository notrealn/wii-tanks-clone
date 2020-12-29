import { Game } from '../game';
import { Block } from '../world/block';
import { Map } from '../world/map'
import { Vector } from '../vector';
import { Tile } from '../world/tile';

export class Entity {
  name: string = 'entity'
  pos: Vector
  vel: Vector
  airRes!: number
  size: number
  angle: number
  anchor: Vector
  delete!: boolean

  constructor() {
    this.pos = new Vector(0, 0);
    this.vel = new Vector(0, 0);
    this.size = 0;
    this.angle = 0;
    this.anchor = new Vector(0.5, 0.5)
  }

  update(state: Game['state'], map: Map) {
    this.pos = this.pos.add(this.vel)
    this.vel = this.vel.multiply(this.airRes | 0.5)
  }

  checkCollision(other: Entity): boolean {
    const aPoints = this.vertices;
    const aNormals = this.normals;
    const bPoints = other.vertices;
    const bNormals = other.normals;

    // If any of the edge normals of A is a separating axis, no intersection.
    for (let i = 0; i < aPoints.length; i++) {
      const rangeA = Vector.flattenPointsOn(aPoints, aNormals[i])
      const rangeB = Vector.flattenPointsOn(bPoints, aNormals[i])

      if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
        return false;
      }
    }
    // If any of the edge normals of B is a separating axis, no intersection.
    for (let i = 0; i < bPoints.length; i++) {
      const rangeA = Vector.flattenPointsOn(aPoints, bNormals[i])
      const rangeB = Vector.flattenPointsOn(bPoints, bNormals[i])

      if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
        return false;
      }
    }

    return true;
  }

  checkMapCollision(map: Map): Vector | false {
    for (const vertex of this.vertices) {
      const x = Math.floor(vertex.x / 32)
      const y = Math.floor(vertex.y / 32)
      if (!map.inBounds(new Vector(x, y))) {
        return new Vector(x, y);
      }

      if (map.tiles[x + y * map.width].block.solid) {
        return map.tiles[x + y * map.width].pos;
      }
    }
    return false;
  }

  applyForce(direction: number, magnitude: number) {
    return this.vel = this.vel.add(new Vector(
      Math.cos(direction - Math.PI / 2) * magnitude,
      Math.sin(direction - Math.PI / 2) * magnitude,
    ));
  }

  setPos(x: number, y: number) {
    this.pos = new Vector(x, y);
    return this;
  }

  setVel(x: number, y: number) {
    this.vel = new Vector(x, y);
    return this;
  }

  setSize(size: number) {
    this.size = size;
    return this;
  }

  get edges() {
    const vertices = this.vertices;
    // points start from top left and go clockwise
    const edges: Vector[] = [
      new Vector(vertices[1].x - vertices[0].x, vertices[1].y - vertices[0].y),
      new Vector(vertices[2].x - vertices[1].x, vertices[2].y - vertices[1].y),
      new Vector(vertices[3].x - vertices[2].x, vertices[3].y - vertices[2].y),
      new Vector(vertices[0].x - vertices[3].x, vertices[0].y - vertices[3].y),
    ]

    return edges
  }

  get vertices() {
    const apothem = this.size / 2;
    // points start from top left and go clockwise
    const vertices: Vector[] = [
      new Vector(-apothem, -apothem),
      new Vector(apothem, -apothem),
      new Vector(apothem, apothem),
      new Vector(-apothem, apothem),
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

  get normals() {
    const edges = this.edges;
    const normals: Vector[] = [];
    for (let i = 0; i < edges.length; i++) {
      normals[i] = new Vector(edges[i].y, -edges[i].x)
    }
    return normals;
  }
}


