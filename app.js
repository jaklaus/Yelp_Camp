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
	middlewareObj = require('./middleware/index'),
	flash = require('connect-flash');
	methodOverride = require('method-override');

// require ROUTES
var campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes = require('./routes/comments'),
	authRoutes = require('./routes/authenticate');

// connect to Database
mongoose.connect("mongodb://heroku_yelpcamp:hcamp@ds035856.mlab.com:35856/heroku_yelpcampv2");

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(flash());

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
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
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

app.listen(port, function(res,req){
	console.log("yelp camp server running on port " + port)
});