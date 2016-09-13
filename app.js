var express = require('express'),
	app = express(),
	bodyParser = require('body-parser');

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
	res.render('home');
});

// CAMPGROUNDS PAGE
var campgrounds = [
	{
		name: 'Hopeful Rest',
		image: 'https://hd.unsplash.com/photo-1455496231601-e6195da1f841'
	},
	{
		name: 'Underground Streams',
		image: 'https://hd.unsplash.com/photo-1463749438585-e1618d0ba6b0'
	},
	{
		name: 'Blissful Heights',
		image: 'https://hd.unsplash.com/photo-1434987215074-1caeadb28cf8'
	}
];
app.get('/campgrounds', function(req,res){
	res.render('campgrounds', {campgrounds:campgrounds});
});

app.get('/campgrounds/new', function(req,res){
	res.render('newCampground');
})

app.post('/campgrounds', function(req,res){
	
	// retrieve and store form information
	var campgroundName = req.body.campgroundName;
	var campgroundImg = req.body.campgroundImg;

	// push to campgrounds array
	campgrounds.push(
		{
			name: campgroundName, 
			image: campgroundImg
		}
	);

	// redirect to campgrounds page
	res.redirect('/campgrounds');
})


app.listen(3000, function(res,req){
	console.log("yelp camp v1 server running!")
})