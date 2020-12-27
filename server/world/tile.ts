import { Vector } from '../vector';
import { Block, Blocks } from './block';

export class Tile {
  name!: string
  block: Block;
  pos: Vector;
  size = 32;

  constructor(x: number, y: number, block: Block = Blocks.air) {
    this.pos = new Vector(x, y);
    this.block = block;
  }
}