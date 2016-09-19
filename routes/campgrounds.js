var express = require('express'),
	router = express.Router({mergeParams:true}),
	moment = require('moment'),
	Campground = require('../models/campground'),
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
router.get('/new', isLoggedIn, function(req,res){
	res.render('campgrounds/new');
})

// CREATE ROUTE 
router.post('/', isLoggedIn, function(req,res){

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

	Campground.findById(campgroundId).populate("comments").exec(function(err,campground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground:campground, moment: moment});
		}
	});
});

// EDIT ROUTE
// EDIT PAGE
router.get('/:id/edit', function(req,res){
	var campgroundId = req.params.id;

	Campground.findById(campgroundId).populate("comments").exec(function(err,campground){
		if(err){
			console.log(err);
			res.redirect('/campgrounds/' + campgroundId);
		} else {
			res.render("campgrounds/edit", {campground:campground, moment: moment});
		}
	});
});

// UPDATE ROUTE
router.put('/:id', function(req, res){
	var campgroundId = req.params.id;
	var campground = req.body.campground;
	// var campgroundName = req.body.campground.name;
	// var campgroundImg = req.body.campground.img;
	// var campgroundDescription = req.body.campground.description;
	Campground.findByIdAndUpdate(campgroundId, campground, function(err,updateCampground){
		console.log(updateCampground);
		res.redirect('/campgrounds/' + campgroundId);
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