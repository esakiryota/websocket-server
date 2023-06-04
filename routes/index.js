var express = require('express');
var router = express.Router();
const Redis = require('ioredis');
const redis = new Redis({
  host: 'localhost', // Redisサーバーのホスト名
  port: 6379, // Redisサーバーのポート番号
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'WebsocketServer'});
});

module.exports = router;
