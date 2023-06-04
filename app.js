var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messageRouter = require('./routes/message');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/message', messageRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var Redis = require('ioredis');

const redisClientPublisher = new Redis();

const connections = new Set();

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8083 });
  
  wss.on('connection', (ws, req) => {
    const roomId = req.url;

    const redisClientSubscriber = new Redis();

    connections.add(ws);

    redisClientSubscriber.subscribe(`room:${roomId}`, (err, count) => {
      if (err) {
        console.error('Redisのサブスクリプションエラー:', err);
        return;
      }
      redisClientPublisher.publish(`room:${roomId}`, JSON.stringify({type: "subscribe", msg: "subscribe"}));
    });

    redisClientSubscriber.on('message', (channel, message) => {
      if (channel === `room:${roomId}`) {
        ws.send(message);
      }
    });

    ws.on('message', (message) => {
      redisClientPublisher.publish(`room:${roomId}`, message.toString('utf-8'));
  });
  
    ws.on('close', () => {
      connections.delete(ws);

      // Redisのサブスクライバーを解放
      redisClientSubscriber.unsubscribe();
      redisClientSubscriber.quit();
    });
  });


module.exports = app;
