var express = require( 'express' );
var app=express();
var router=express.Router();
const passport = require('../authentication/passport');
var db=require('../database/db');
//var bcrypt = require('bcrypt');
const Users = require('../models/users')
const Avatars = require('../models/avatars')
const Games = require('../models/games')
const Messages = require('../models/messages')
const Players = require('../models/players')
CryptoJS=require('crypto-js');
var SHA256 = require("crypto-js/sha256");


router.get('/', function(req, res, next) { // This function is called when receive request " GET / "

  if(req.isAuthenticated()){   // If the request contains session of user information
       res.redirect('lobby');
  } else {
       res.render('index', { title: 'UNO'});
  }
});


router.post('/signup', (req, res, next) => {
    Users.emailNotUsed(req.body.email).then( one => {
    	//bcrypt.hash(req.body.password, saltRounds).then( (hash) => {
			user=req.body;
			hash=SHA256(user.password)
			//user.encrypted_password=hash.toString(CryptoJS.enc.Base64)
			user.encrypted_password=user.password
	  		console.log(user.encrypted_password)
    		Users.createFromSignUp(user)
    		.then(() => {
  				console.log(user);	
				res.redirect('signup_success');
    		})
    		.catch(error => {
        		// error;
 		 		console.log(error);
    		});
		//});
	}).catch( error => {
		Avatars.findAll().then( ats => {
			res.render('signup_form', { err_msg: 'email is already used', avatars:ats}); 
    	});
	});

});

router.get('/signup', function(req, res, next) {
	Avatars.findAll().then( ats => {
		res.render('signup_form', { title: 'Sign Up' , avatars:ats});
	}).catch(error => {
		console.log(error);
	})
});

router.get('/signup_success', function(req, res, next) {
	res.render('login_form',{message:"Successfully Signed Up!"});
});

router.post(
  '/login',
  passport.authenticate( 'local', { session: true,
        successRedirect : '/lobby', // redirect to the lobby
        failureRedirect : '/login', // redirect back to the index if error
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
			Messages.listLobbyMsg().then( msgs => {
			res.render('lobby', { auth_stat: 'Authenticated', email: req.user.email, games: games, user: req.user, messages:msgs});
			});
		}).catch( error => {
			games={};
			console.log(error);
			res.render('lobby', { auth_stat: 'Authenticated', email: req.user.email, games: games, user: req.user});
		});
	} else {
		res.redirect('login');
	}

});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
/*
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

});*/
module.exports = router;
