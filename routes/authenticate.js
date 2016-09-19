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
			req.flash('error', 'Username already registered.');
			res.redirect("/register")
		} else {
			passport.authenticate('local')(req, res, function(){
				req.flash('success', 'Thanks for Signing up!');
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
		failureRedirect: "/login",
		failureFlash: true,
		successFlash: 'Successfully logged in'

	}), function(req,res){
});

// LOGOUT
router.get('/logout', function(req,res){
	req.logout();
	req.flash('success', 'Logged Out')
	res.redirect('/campgrounds');
});

module.exports = router;