import { Vector } from '../../server/vector';
import { GamePad } from '../../server/types';

export class KeyHandler {
  keys: { [key: string]: boolean }
  mouse: {
    m1: boolean,
    m2: boolean,
    pos: Vector
  }

  constructor(canvas: Element) {
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

    canvas.addEventListener('mousemove', (e) => {
      // we need to convert their on screen pixels into the in game pixels
      // divide their x by width of canvas and multiply by width of game
      this.mouse.pos.x = (e as MouseEvent).offsetX / canvas.clientWidth * 512;
      this.mouse.pos.y = (e as MouseEvent).offsetY / canvas.clientHeight * 384;
      // console.log(`canvas width: ${canvas.clientWidth}, offsetx: ${(e as MouseEvent).offsetX}, mousex: ${this.mouse.pos.x}`)
    });
  }

  get gamepad(): GamePad {
    return {
      up: this.keys.w,
      down: this.keys.s,
      left: this.keys.a,
      right: this.keys.d,
      mouse: this.mouse
    }
  }
}
