var express = require('express'),
	router = express.Router({mergeParams:true}),
	Campground = require('../models/campground'),
	Comment = require('../models/comment');

// NEW COMMENT ROUTE
router.get('/new', isLoggedIn,  function(req,res){
	var campgroundId = req.params.id;

	Campground.findById(campgroundId, function(err, campground){
		if(err){
			throw err;
		} else {
			res.render("comments/new", {campground:campground});
		}
	});
});

// COMMENT POST ROUTE
router.post('/', isLoggedIn, function(req,res){
	var campgroundId = req.params.id;

	var newComment = { author: req.user.username, body: req.body.commentBody};
	
	Campground.findById(campgroundId, function(err, campground){
		if(err){
			console.log(err);
		} else {
			Comment.create(newComment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/'+ campground._id);
				}
			});
		}
	});
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