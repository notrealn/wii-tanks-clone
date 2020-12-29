import { Entity } from './entities/entity';
import { Player } from './entities/player';
import { Vector } from './vector';
import { Block } from './world/block';

export interface GameState {
  entities: Entity[];
  players: Player[];
}

export interface GamePad {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  mouse: {
    m1: boolean;
    m2: boolean;
    pos: Vector;
  }
}

export interface MapObject {
  blocks: Block[];
}

export type Range = [min: number, max: number];