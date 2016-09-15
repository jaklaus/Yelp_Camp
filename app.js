var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	moment = require('moment'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	expressSession = require('express-session'),
	User = require('./models/user'),
	seedDB = require('./seed');

// connect to Database
mongoose.connect("mongodb://localhost/yelp_camp");

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// seed database
seedDB();
// add moment js
moment().format();

// PASSPORT CONFIG
app.use(expressSession({
	secret: 'KlausHaus',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ROOT ROUTE
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
			res.render('campgrounds/index', {campgrounds:campgrounds});
		}
	});
});

// NEW ROUTE
app.get('/campgrounds/new', function(req,res){
	res.render('campgrounds/new');
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

	Campground.findById(campgroundId).populate("comments").exec(function(err,campground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground:campground, moment: moment});
		}
	});
});
//  =============
// COMMENT ROUTES
//  =============
// NEW COMMENT ROUTE
app.get('/campgrounds/:id/comments/new', function(req,res){
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
app.post('/campgrounds/:id/comments', function(req,res){
	var campgroundId = req.params.id;
	var newComment = req.body.comment;
	
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

// ====
// AUTH ROUTES
// ====

app.get('/register', function(req,res){
	res.render('authenticate/register');
});

app.post('/register', function(req,res){
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

app.listen(3000, function(res,req){
	console.log("yelp camp v1 server running!")
})