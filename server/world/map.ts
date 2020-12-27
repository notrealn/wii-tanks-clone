import { Vector } from '../vector';
import { Block, Blocks } from './block'
import { Tile } from './tile';

export class Map {
  tiles: Tile[]
  width = 16
  height = 12

  constructor() {
    this.tiles = []
    for (let i = 0; i < this.width * this.height; i++) {
      this.tiles[i] = new Tile(i % this.width, Math.floor(i / this.width));
    }
  }

  setTile(x: number, y: number, block: Block) {
    this.tiles[y * this.width + x] = new Tile(x, y, block);
    return this;
  }

  inBounds(vector: Vector) {
    if (vector.x < 0 || vector.x > this.width - 1) return false;
    if (vector.y < 0 || vector.y > this.height - 1) return false;
    return true;
  }

  // static fromJSON(json: any) {
  //   const object = JSON.parse(json)
  //   return new Map(object.blocks)
  // }
}