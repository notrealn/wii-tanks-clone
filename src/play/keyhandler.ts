import { Vector } from '../../server/entity';
import { GamePad } from '../../server/types';

export class KeyHandler {
  keys: { [key: string]: boolean }
  mouse: {
    m1: boolean,
    m2: boolean,
    pos: Vector
  }

  constructor() {
    this.keys = {}
    this.mouse = {
      m1: false,
      m2: false,
      pos: new Vector(0, 0)
    }

    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });
    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    document.addEventListener('mousedown', (e) => {
      this.mouse.m1 = true;
    });

    document.addEventListener('mouseup', (e) => {
      this.mouse.m1 = false;
    });

    document.addEventListener('mousemove', (e) => {
      this.mouse.pos.x = e.offsetX;
      this.mouse.pos.y = e.offsetY;
    });
  }

  get gamepad(): GamePad {
    return {
      up: this.keys.w,
      down: this.keys.s,
      left: this.keys.a,
      right: this.keys.d,
      m1: false,
      m2: false,
    }
  }
}
