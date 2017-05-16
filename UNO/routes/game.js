var express = require('express');
var router = express.Router();
const Messages = require('../models/messages');
router.get('/:id', function(req, res, next) {
	console.log(req.params.id);
	console.log(Messages);
	game_id=req.params.id; 
    Messages.listMsgByGameId(game_id).then( msgs => {
  		res.render('game', { game_id:req.params.id, messages: msgs, email: req.user.email});
		//res.render('game', { game_id: game_id });
	}).catch(error => {
		console.log("error");
		console.log(error);
	});
});

module.exports = router;
