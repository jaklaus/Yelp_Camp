var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser');
	

// Set Up Database

mongoose.connect("mongodb://localhost/yelp_camp");
// set up mongo Schema
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});
// set up mongo model
var Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create({
	
// 	name: 'Red Dawns',
// 	image: 'https://hd.unsplash.com/photo-1434987215074-1caeadb28cf8',
// 	description: 'This is a wonderful campsite'

// }, function(err, campground){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log('campground logged to DB');
// 		console.log(campground);
// 	}
// });

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
	res.render('home');
});

// INDEX ROUTE - SHOW ALL CAMPGROUNDS

app.get('/campgrounds', function(req,res){
	// find all campgrounds from DB
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		} else {
			res.render('index', {campgrounds:campgrounds});
		}
	});
});

// NEW ROUTE
app.get('/campgrounds/new', function(req,res){
	res.render('newCampground');
})

// CREATE ROUTE 
app.post('/campgrounds', function(req,res){

	// retrieve and store form information
	var campgroundName = req.body.campgroundName;
	var campgroundImg = req.body.campgroundImg;
	var campgroundDescription = req.body.campgroundDescription;
	var newCampground = {name: campgroundName, image: campgroundImg, description: campgroundDescription};

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

app.get("/campgrounds/:id", function(req,res){
	var campgroundId = req.params.id;

	Campground.findById(campgroundId, function(err,campground){
		if(err){
			console.log(err);
		} else {
			res.render("show", {campground:campground});
		}
	});

	
})


app.listen(3000, function(res,req){
	console.log("yelp camp v1 server running!")
})