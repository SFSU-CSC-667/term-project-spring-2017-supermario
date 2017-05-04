var express = require( 'express' );
var router=express.Router();
const passport = require('../authentication/passport')
db=require('../database/db')
const Users = require('../models/users')
const Games = require('../models/games')
const Players = require('../models/players')


router.get('/', function(req, res, next) { // This function is called when receive request " GET / " 
      
  if(req.isAuthenticated()){   
       res.render('lobby', {auth_stat: 'Authenticated', email: req.user.email}); 
  } else {
       res.render('index', { title: 'UNO'});
  }
});


router.get('/create_game', function(req, res, next) {
	console.log(req.user.email);
	Users.findByEmail(req.user.email).then( user => {
		console.log(user.id);
		Games.create(user.id).then( game => {
			console.log(game.id);
			console.log(user.id);
			var player = {
				game_id: game.id,
				user_id: user.id,
				seat_number: 1,
			};
			Players.create(player).then( player => {
				console.log(player);
				res.redirect('game/'+game.id);
			}).catch(error => {
				console.log(error);
			});
		});
		
	}).catch( error => {
		console.log(error);
		res.render('lobby', {auth_stat: 'Authenticated', email: req.user.email});
	});

});


module.exports = router;
