
var express = require( 'express' );
var router=express.Router();
const passport = require('../authentication/passport')

router.get('/', function(req, res, next) { // This function is called when receive request " GET / " 
      
  if(req.isAuthenticated()){   // If the request contains session of user information
       res.render('lobby', {title: 'Authenticated', username: req.user.username}); // Will display a page from index.pug, assign title="Express"
  } else {
       res.render('index', { title: 'Express'}); // Will display a page from index.pug, assign title="Express"
  }
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

module.exports = router;
