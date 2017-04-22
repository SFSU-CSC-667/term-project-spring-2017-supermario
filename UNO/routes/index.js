
var express = require( 'express' );
var router=express.Router();
const passport = require('../authentication/passport')
//const pgp = require( 'pg-promise' );

//db=pgp.connect()

router.get('/', function(req, res, next) { // This function is called when receive request " GET / " 
      
  if(req.isAuthenticated()){   // If the request contains session of user information
       res.render('lobby', {title: 'Authenticated', username: req.user.username}); // Will display a page from index.pug, assign title="Express"
  } else {
       res.render('index', { title: 'Express'}); // Will display a page from index.pug, assign title="Express"
  }
});


/*
router.post('/signup', (req, res, next) => {
	
    db.none('INSERT INTO users(email, password, nick_name) VALUES(${email}, ${password}, ${nick_name})', user)
    .then(() => {
		res.render('lobby', {title: 'Authenticated', username: user.nickname});
    })
    .catch(error => {
        // error; 
    });
});
*/

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
	res.render('login_form', { title: 'Login' });
});

router.get('/lobby', function(req, res, next) { // This function is called when receive request " GET /lobby " 
	if (req.isAuthenticated()){
	res.render('lobby', { auth_stat: 'Authenticated', username: req.user.username });
	} else {
	res.render('lobby', { auth_stat: 'Unauthenticated'});
	}
    
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
