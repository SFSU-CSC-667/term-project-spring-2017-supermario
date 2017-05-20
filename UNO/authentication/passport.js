// This initializes and implements passport methods
var passport = require( 'passport' );
var LocalStrategy = require( 'passport-local' ).Strategy;
db=require('../database/db');
//var bcrypt = require('bcrypt');
CryptoJS=require('crypto-js');
var SHA256 = require("crypto-js/sha256");
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
	  hash=SHA256(password);
	  //encrypted=hash.toString(CryptoJS.enc.Base64);
	  encrypted=password;
      if ( encrypted !== user.encrypted_password) {
        return done( null, false, { message: 'Wrong password' } );
      };
  //    bcrypt.compare(password, user.encrypted_password).then( (res) => {
    // res == true 
	//	if (res == false) {
    //    	return done( null, false, { message: 'Invalid password' } );
    //    }
        done( null, user );
 //     });

      }).catch( error => {
			console.log(error);
        	return done( null, false, { message: 'Invalid user' } );
	  });
  });

passport.use( 'local', localStrategy );

module.exports=passport
