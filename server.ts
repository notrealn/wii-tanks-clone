// basic HTTP server for development
// use nginx or similar in production for mega speed
import dotenv from 'dotenv';
import express from 'express';
// import { createServer } from "http";
import path from 'path';
// import { Server, Socket } from "socket.io";
import webpack from 'webpack';
import middleware, { Options } from 'webpack-dev-middleware';
import hotmiddleware from 'webpack-hot-middleware';

import { Game } from './server/game';
import webpackConfig from './webpack.config';

dotenv.config();

// const app = express();
const game = new Game();
game.app.use(express.static(path.resolve(__dirname, 'dist')));

const compiler = webpack(webpackConfig);
// game.app.use(middleware(compiler, {
//   publicPath: '/'
// }));

// game.app.use(require('webpack-hot-middleware')(compiler));

game.app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

game.app.get('/play', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/play.html'));
});

game.app.use((req, res, next) => {
  res.status(404).send("404 bruh moment");
})