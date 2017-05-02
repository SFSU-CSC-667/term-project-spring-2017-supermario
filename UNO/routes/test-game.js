var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('test-game', { title: 'Test Game' });
});

module.exports = router;