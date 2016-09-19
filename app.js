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
	seedDB = require('./seed'),
	methodOverride = require('method-override');

// require ROUTES
var campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes = require('./routes/comments'),
	authRoutes = require('./routes/authenticate')

// connect to Database
mongoose.connect("mongodb://localhost/yelp_camp");

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// seed database
// seedDB();

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

// add currentUser to all routes
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

// methodOverride POST having ?_method=DELETE 
app.use(methodOverride('_method'))

// ROOT ROUTE
app.get('/', function(req,res){
	res.render('home');
});

// Use Routes
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use(authRoutes);

app.listen(3000, function(res,req){
	console.log("yelp camp v1 server running!")
});