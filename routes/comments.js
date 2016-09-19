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

	var newComment = { author: {id: req.user._id, username:req.user.username}, body: req.body.commentBody};
	
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

// COMMENT EDIT PAGE
router.get('/:commentId/edit', commentOwnerAuth,  function(req,res){
		Comment.findById(req.params.commentId, function(err, comment){
				res.render('comments/edit', {comment:comment, campground:req.params.id});
		});
});

// COMMENT UPDATE ROUTE
router.put('/:commentId', commentOwnerAuth, function(req, res){
	Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, updatedComment){
			res.redirect('/campgrounds/' + req.params.id);
		
	});
});

// COMMENT DELETE ROUTE

router.delete('/:commentId', commentOwnerAuth, function(req, res){
	Comment.findByIdAndRemove(req.params.commentId, function(err, comment){
		res.redirect('/campgrounds/' + req.params.id);
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

// check ownership
function commentOwnerAuth(req, res, next){
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

module.exports = router;