var express = require('express');
var router = express.Router();

router.get('/:roomId', function(req, res, next) {
  res.render('message', { roomId: req.params.roomId });
});

module.exports = router;