// This initializes and implements passport methods
var passport = require( 'passport' );
var LocalStrategy = require( 'passport-local' ).Strategy;

// Test users
var users = {
  test: {
    username: 'test',
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
      usernameField: 'username',
      passwordField: 'password',
    },
    function(username, password, done) {
      user = users[ username ];

      if ( user == null ) {
        return done( null, false, { message: 'Invalid user' } );
      };

      if ( user.password !== password ) {
        return done( null, false, { message: 'Invalid password' } );
      };

      done( null, user );
    }
  )

passport.use( 'local', localStrategy );

module.exports=passport
