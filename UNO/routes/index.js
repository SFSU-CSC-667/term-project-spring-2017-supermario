var express = require( 'express' );
var router=express.Router();
const passport = require('../authentication/passport');
var db=require('../database/db');
//var bcrypt = require('bcrypt');
const Users = require('../models/users')
const Games = require('../models/games')
const Players = require('../models/players')
const saltRounds = 10;


router.get('/', function(req, res, next) { // This function is called when receive request " GET / "

  if(req.isAuthenticated()){   // If the request contains session of user information
       res.render('lobby', {auth_stat: 'Authenticated', email: req.user.email});
  } else {
       res.render('index', { title: 'UNO'});
  }
});



router.post('/signup', (req, res, next) => {
    Users.emailNotUsed(req.body.email).then( one => {
    	//bcrypt.hash(req.body.password, saltRounds).then( (hash) => {
			user=req.body;
			user.encrypted_password=user.password
			//user.encrypted_password=hash;
    		Users.createFromSignUp(user)
    		.then(() => {
				res.render('lobby', {auth_stat: 'Authenticated', email: req.body.email});
    		})
    		.catch(error => {
        		// error;
 		 		console.log(error);
    		});
		//});
	}).catch( error => {
		res.render('signup_form', { msg: 'email is already used'});
	});

});

router.get('/signup', function(req, res, next) {
	res.render('signup_form', { title: 'Sign Up' });
});


router.post(
  '/login',
  passport.authenticate( 'local', { session: true,
        successRedirect : '/lobby', // redirect to the lobby
        failureRedirect : '/', // redirect back to the index if error
        failureFlash : true // allow flash messages } ),
  })
);


router.get('/login', function(req, res, next) {

	if (req.isAuthenticated()){
	res.render('lobby', { auth_stat: 'Authenticated', email: req.user.email });
	} else {
	res.render('login_form', { title: 'Login' });
	}
});

router.get('/lobby', function(req, res, next) { // This function is called when receive request " GET /lobby "
	if (req.isAuthenticated()){
		Games.listJoinables().then( games=> {
			res.render('lobby', { auth_stat: 'Authenticated', email: req.user.email, games: games, user: req.user});
		}).catch( error => {
			games={};
			console.log(error);
			res.render('lobby', { auth_stat: 'Authenticated', email: req.user.email, games: games, user: req.user});
		});
	} else {
	res.render('lobby', { auth_stat: 'Unauthenticated'});
	}

});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
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
				//res.redirect('game/'+game.id);
				res.redirect('lobby');

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
