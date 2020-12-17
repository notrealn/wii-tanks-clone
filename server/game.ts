
import express from 'express';
import { Server, Socket } from 'socket.io';
import { GamePad, GameState } from './types';
import { createServer, Server as HttpServer } from 'http';
import { Entity, Player } from './entity';
// import { Point } from 'pixi.js';

export class Game {
  state: GameState;
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

    setInterval(() => {
      this.state.entities.forEach((entity: Entity) => entity.update(this.state));
      this.state.players.forEach((player: Player) => player.update(this.state));
      this.io.emit('tick', this.state);
    }, 1000 / 24);
  }

  private listen(): void {
    const listener = this.app.listen(process.env.PORT, () => {
      console.log('Listening at http://localhost:' + this.port);
    });

    this.io.on('connection', (socket: Socket) => {
      this.state.players.push(new Player(socket.id).setPos(100, 100));
      console.log(`${socket.id} joined`);

      socket.on('disconnect', () => {
        this.state.players = this.state.players.filter(player => player.id != socket.id);
        socket.emit('remove', socket.id)
        console.log(`${socket.id} left`);
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
