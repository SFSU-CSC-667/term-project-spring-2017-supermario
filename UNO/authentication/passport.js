// This initializes and implements passport methods
var passport = require( 'passport' );
var LocalStrategy = require( 'passport-local' ).Strategy;
db=require('../database/db');
var bcrypt = require('bcrypt');
const Users = require('../models/users');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var localStrategy = new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
	  passReqToCallback : true
   },
    function(req, username, password, done) {
      Users.findByEmail(username).then( user => {
	  console.log(user);
      if ( user == null ) {
        return done( null, false, { message: 'Invalid user' } );
      };
      bcrypt.compare(password, user.encrypted_password).then( (res) => {
    // res == true 
		if (res == false) {
        	return done( null, false, { message: 'Invalid password' } );
        }
        done( null, user );
      });

      }).catch( error => {
			console.log(error);
	  });
  });

passport.use( 'local', localStrategy );

module.exports=passport
