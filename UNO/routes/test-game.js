var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('test-game', { title: 'Test Game' , game_id:1, user_id:req.user.id});
});

module.exports = router;
