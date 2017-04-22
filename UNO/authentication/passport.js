// This initializes and implements passport methods
var passport = require( 'passport' );
var LocalStrategy = require( 'passport-local' ).Strategy;
const pgp = require( 'pg-promise' )({
});
connection = "postgres://localhost:5432/UNO"
db=pgp(connection);

// Test users
var users = {
  test: {
    email: 'test',
    password: 'test',
    id: 1,
  },
}

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
      db.one('SELECT * FROM users where email like $1 ', username).then(
       user => {
	  console.log(username)
      console.log(user)
      /*if ( user == null ) {
        return done( null, false, { message: 'Invalid user' } );
      };

      if ( user.encrypted_password !== password ) {
        return done( null, false, { message: 'Invalid password' } );
      };*/

      done( null, user );
      })
       .catch(error => {
        // error; 
 		 console.log(error);
      });
   }
  )

passport.use( 'local', localStrategy );

module.exports=passport
