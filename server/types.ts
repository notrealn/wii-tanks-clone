import { Entity, Player } from "./entity";

export interface GameState {
  entities: Entity[];
  players: Player[];
}

export interface GamePad {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  m1: boolean;
  m2: boolean;
}

export type Projection = [min: number, max: number];