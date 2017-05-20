var express = require('express');
var router = express.Router();
const Messages = require('../models/messages');
router.get('/:id', function(req, res, next) {
	if(req.isAuthenticated()){
	console.log(req.params.id);
	console.log(Messages);
	game_id=req.params.id;
    Messages.listMsgByGameId(game_id).then( msgs => {
  		res.render('game', { game_id:req.params.id, messages: msgs, email: req.user.email, user_id: req.user.id, nick_name:req.user.nick_name});
		//res.render('game', { game_id: game_id });
	}).catch(error => {
		console.log("error");
		console.log(error);
	});
	}else{
		res.redirect('/login');
	}
});

module.exports = router;
