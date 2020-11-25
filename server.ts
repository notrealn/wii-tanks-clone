// basic HTTP server for development
// use nginx or similar in production for mega speed
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';
// import * as socketIo from 'socket.io';
import webpack from 'webpack';
import middleware, { Options } from 'webpack-dev-middleware';

import webpackConfig from './webpack.config';

dotenv.config();

const app = express();
const io = require('socket.io')(http.createServer());
app.use(express.static(path.resolve(__dirname, 'dist')));

const compiler = webpack(webpackConfig);
app.use(middleware(compiler, { headers: webpackConfig.devServer?.headers }));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

app.get('/play', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/play.html'));
});

app.use(function (req, res, next) {
  res.status(404).send("404 bruh moment")
})

io.on('connection', (socket: { on: (arg0: string, arg1: (msg: any) => void) => void; }) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Listening at http://localhost:' + process.env.PORT);
});