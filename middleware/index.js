// all middleware goes here

var Campground = require('../models/campground'),
	Comment = require('../models/comment');

var middlewareObj = {};


// function to check if user is logged in
middlewareObj.isLoggedIn = function (req,res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/login');
	}
}

// check Campground ownership
middlewareObj.checkCampgroundOwner = function (req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err,campground){
			if(err){
				console.log(err);
				res.redirect('back');
			} else {
				if(campground.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});

	} else {
		res.redirect('back');
	}
	}

// check Comment ownership
middlewareObj.checkCommentOwner = function (req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.commentId, function(err,comment){
			if(err){
				console.log(err);
				res.redirect('back');
			} else {
				if(comment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect('back');
				}
			}
		});

	} else {
		res.redirect('back');
	}
	}

module.exports = middlewareObj;