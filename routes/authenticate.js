var express = require('express'),
	router = express.Router(),
	Campground = require('../models/campground'),
	passport = require('passport'),
	User = require('../models/user');

// REGISTER
router.get('/register', function(req,res){
	res.render('authenticate/register');
});

router.post('/register', function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("authenticate/register")
		} else {
			passport.authenticate('local')(req, res, function(){
				console.log(user);
				res.redirect('/campgrounds');
			});
		}
	});
});

// LOGIN

router.get('/login', function(req,res){
	res.render('authenticate/login');
});

router.post('/login', passport.authenticate('local', 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"

	}), function(req,res){
});

// LOGOUT
router.get('/logout', function(req,res){
	req.logout();
	res.redirect('/campgrounds');
});

// function to check if user is logged in
function isLoggedIn(req,res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/login');
	}
}

module.exports = router;