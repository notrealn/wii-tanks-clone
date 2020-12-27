
import express from 'express';
import { Server, Socket } from 'socket.io';
import { GamePad, GameState } from './types';
import { createServer, Server as HttpServer } from 'http';
import { Entity } from './entities/entity';
import { Player } from './entities/player';
import { Map } from './world/map';
import { Blocks } from './world/block';
import { Tile } from './world/tile';

export class Game {
  state: GameState;
  map: Map;
  public static readonly PORT: number = 6969;
  private _app: express.Application;
  private server: HttpServer;
  private io: Server;
  private port: string | number;

  constructor() {
    this._app = express();
    this.port = process.env.PORT || Game.PORT;
    this.server = createServer(this._app).listen(3000);
    this.io = new Server(this.server);
    this.listen();
    this.state = {
      entities: [],
      players: [],
    };
    this.map = new Map().setTile(1, 1, Blocks.wall).setTile(15, 11, Blocks.wall);

    setInterval(() => {
      this.state.entities.forEach((entity: Entity) => entity.update(this.state, this.map));
      this.state.players.forEach((player: Player) => player.update(this.state, this.map));
      this.io.emit('tick', this.state);
    }, 1000 / 24);
  }

  private listen(): void {
    const listener = this.app.listen(process.env.PORT, () => {
      console.log('Listening at http://localhost:' + this.port);
    });

    this.io.on('connection', (socket: Socket) => {
      this.state.players.push(new Player(socket.id).setPos(100, 100));
      this.io.to(socket.id).emit('map', this.map)
      console.log(`${socket.id} joined`);

      socket.on('disconnect', () => {
        this.state.players = this.state.players.filter(player => player.id != socket.id);
        console.log(`${socket.id} left`);
        this.io.emit('remove', socket.id)
      });

      socket.on('input', (gamepad: GamePad) => {
        const player = this.state.players.find(player => player.id == socket.id);
        if (player) player.move(gamepad)
        else console.log('a')
        // console.log(socket.id + ' ' + JSON.stringify(this.state.players))
      });
    });

    // this.io.on(ChatEvent.CONNECT, (socket: any) => {
    //   console.log('Connected client on port %s.', this.port);

    //   socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
    //     console.log('[server](message): %s', JSON.stringify(m));
    //     this.io.emit('message', m);
    //   });

    //   socket.on(ChatEvent.DISCONNECT, () => {
    //     console.log('Client disconnected');
    //   });
    // });
  }

  get app(): express.Application {
    return this._app;
  }
}
