const Koa = require('koa');
const static = require('koa-static');
const path = require('path');

const app = new Koa();

const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/musicDB");

require('./db')

// route index
const router = require('./routers/index');

app.use(static(path.join(__dirname, "public")));

app.use(router.routes()).use(router.allowedMethods());

// 建立 server
const server = require('http').createServer(app.callback());

// wss
// const wss = require('./wss');
// wss(server);

server.listen(8964);

