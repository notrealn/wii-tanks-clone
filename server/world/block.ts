import { Vector } from '../vector';

export class Block {
  name: string
  solid!: boolean

  constructor(name: string) {
    this.name = name;
  }
}

export class Wall extends Block {
  constructor(name: string) {
    super(name)
    this.solid = true;
  }
}

export class Floor extends Block {
  constructor(name: string) {
    super(name)
    this.solid = false;
  }
}

export class Blocks {
  static air = new Floor('air')
  static wall = new Wall('wall')
}

// export class Block {
//   pos: Vector;
//   x: number;
//   y: number;
//   size = 32;
//   type: BlockType;

//   constructor(x: number, y: number, type: BlockType) {
//     this.x = x;
//     this.y = y;
//     this.type = type;
//     this.pos = new Vector(x, y)
//   }

//   get vertices() {
//     const apothem = this.size / 2;
//     // points start from top left and go clockwise
//     const vertices: Vector[] = [
//       new Vector(-apothem, -apothem),
//       new Vector(apothem, -apothem),
//       new Vector(apothem, apothem),
//       new Vector(-apothem, apothem),
//     ];

//     for (let i = 0; i < vertices.length; i++) {
//       vertices[i] = vertices[i].matrixMultiply(
//         Math.cos(0),
//         -Math.sin(0),
//         Math.sin(0),
//         Math.cos(0)
//       );
//       vertices[i] = vertices[i].add(this.pos);
//     }
//     return vertices
//   }

//   get normals() {
//     const edges = this.edges;
//     const normals: Vector[] = [];
//     for (let i = 0; i < edges.length; i++) {
//       normals[i] = new Vector(edges[i].y, -edges[i].x)
//     }
//     return normals;
//   }

//   get edges() {
//     const vertices = this.vertices;
//     // points start from top left and go clockwise
//     const edges: Vector[] = [
//       new Vector(vertices[1].x - vertices[0].x, vertices[1].y - vertices[0].y),
//       new Vector(vertices[2].x - vertices[1].x, vertices[2].y - vertices[1].y),
//       new Vector(vertices[3].x - vertices[2].x, vertices[3].y - vertices[2].y),
//       new Vector(vertices[0].x - vertices[3].x, vertices[0].y - vertices[3].y),
//     ]

//     return edges
//   }
// }

