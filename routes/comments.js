var express = require('express'),
	router = express.Router({mergeParams:true}),
	Campground = require('../models/campground'),
	middlewareObj = require('../middleware/index'),
	Comment = require('../models/comment');

// NEW COMMENT ROUTE
router.get('/new', middlewareObj.isLoggedIn,  function(req,res){
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
router.post('/', middlewareObj.isLoggedIn, function(req,res){
	var campgroundId = req.params.id;

	var newComment = { author: {id: req.user._id, username:req.user.username}, body: req.body.commentBody};
	
	Campground.findById(campgroundId, function(err, campground){
		if(err){
			console.log(err);
		} else {
			Comment.create(newComment, function(err, comment){
				if(err){
					req.flash('error', 'Comment could not be created');
				} else {
					campground.comments.push(comment);
					campground.save();
					req.flash('success', 'Successfully created comment.');
					res.redirect('/campgrounds/'+ campground._id);
				}
			});
		}
	});
});

// COMMENT EDIT PAGE
router.get('/:commentId/edit', middlewareObj.checkCommentOwner,  function(req,res){
		Comment.findById(req.params.commentId, function(err, comment){
				res.render('comments/edit', {comment:comment, campground:req.params.id});
		});
});

// COMMENT UPDATE ROUTE
router.put('/:commentId', middlewareObj.checkCommentOwner, function(req, res){
	Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, updatedComment){
			req.flash('success', 'Comment successfully edited.');
			res.redirect('/campgrounds/' + req.params.id);
		
	});
});

// COMMENT DELETE ROUTE

router.delete('/:commentId', middlewareObj.checkCommentOwner, function(req, res){
	Comment.findByIdAndRemove(req.params.commentId, function(err, comment){
		req.flash('success', 'Comment successfully deleted.');
		res.redirect('/campgrounds/' + req.params.id);
	});
});

module.exports = router;