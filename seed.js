var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment')

var data = [
	{
		name: "Cloud's Rest",
		image: "https://hd.unsplash.com/photo-1455496231601-e6195da1f841",
		description: "Clouds are here."
	},
	{
		name: "Rising Tide",
		image: "https://hd.unsplash.com/photo-1436285122087-89584a1d9398",
		description: "Tides rise and fall."
	},
	{
		name: "Light's Guide",
		image: "https://hd.unsplash.com/photo-1437382944886-45a9f73d4158",
		description: "Light is guided here."
	}
]

function seedDB(){
	Campground.remove({}, function(err){
	// 	if(err){
	// 		throw err;
	// 	} else {
	// 		console.log("campgrounds removed with Seed file");
	// 	}
	// });
	// // add campgrounds
	// data.forEach(function(seed){
	// 	Campground.create(seed, function(err, campground){
	// 		if(err){
	// 			throw err;
	// 		} else {
	// 			console.log("added campground");
	// 			// add comments
	// 			Comment.create({author: "TEST AUTH", body: "TEST BODY"}, function(err, comment){
	// 				if(err){
	// 					console.log(err);
	// 				} else {
	// 					campground.comments.push(comment);
	// 					campground.save(function(err, campground){
	// 						if(err){
	// 							console.log(err);
	// 						} else {
	// 							console.log("comment added")
	// 						}
	// 					});
	// 				}
	// 			});
	// 		}
	// 	});
	});
}

module.exports = seedDB;