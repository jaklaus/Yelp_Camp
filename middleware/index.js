var Campground = require('../models/campground'),
	Comment = require('../models/comment');

// all middleware goes here
var middlewareObj = {};


// function to check if user is logged in
middlewareObj.isLoggedIn = function (req,res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error', 'Please Log In');
		res.redirect('/login');
	}
}

// check Campground ownership
middlewareObj.checkCampgroundOwner = function (req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err,campground){
			if(err){
				req.flash('error', 'Campground not found.');
				res.redirect('back');
			} else {
				if(campground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'You are not the author of this post.')
					res.redirect('back');
				}
			}
		});

	} else {
		req.flash('error', 'Please Log In');
		res.redirect('back');
	}
	}

// check Comment ownership
middlewareObj.checkCommentOwner = function (req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.commentId, function(err,comment){
			if(err){
				req.flash('error', 'Campground not found.');
				res.redirect('back');
			} else {
				if(comment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'You are not the author of this post.')
					res.redirect('back');
				}
			}
		});

	} else {
		req.flash('error', 'Please Log In');
		res.redirect('back');
	}
	}

module.exports = middlewareObj;