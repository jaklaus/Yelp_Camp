var express = require('express'),
	router = express.Router({mergeParams:true}),
	moment = require('moment'),
	Campground = require('../models/campground'),
	middlewareObj = require('../middleware/index'),
	Comment = require('../models/comment');

// INDEX ROUTE - SHOW ALL CAMPGROUNDS

router.get('/', function(req,res){
	// find all campgrounds from DB
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		} else {
			res.render('campgrounds/index', {campgrounds:campgrounds});
		}
	});
});

// NEW ROUTE
router.get('/new', middlewareObj.isLoggedIn, function(req,res){
	res.render('campgrounds/new');
})

// CREATE ROUTE 
router.post('/', middlewareObj.isLoggedIn, function(req,res){

	// retrieve and store form information
	var campgroundName = req.body.campgroundName;
	var campgroundImg = req.body.campgroundImg;
	var campgroundDescription = req.body.campgroundDescription;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: campgroundName, image: campgroundImg, description: campgroundDescription, author:author};

	// add to campgrounds DB
	Campground.create(newCampground, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
	});
})

// SHOW ROUTE

router.get("/:id", function(req,res){
	var campgroundId = req.params.id;
	var user = req.user;

	Campground.findById(campgroundId).populate("comments").exec(function(err,campground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground:campground, user:user,  moment: moment});
		}
	});
});

// EDIT ROUTE
// EDIT PAGE
router.get('/:id/edit', middlewareObj.checkCampgroundOwner, function(req,res){
	Campground.findById(req.params.id, function(err,campground){
				res.render("campgrounds/edit", {campground:campground});
		});
	});

// UPDATE ROUTE
router.put('/:id', middlewareObj.checkCampgroundOwner,  function(req, res){
	var campground = req.body.campground;
	Campground.findByIdAndUpdate(req.params.id, campground, function(err,updateCampground){
		res.redirect('/campgrounds/' + req.params.id);
	});

});

// DELETE ROUTE
router.delete('/:id', middlewareObj.checkCampgroundOwner, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router;