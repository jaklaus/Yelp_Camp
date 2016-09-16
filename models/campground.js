var mongoose = require('mongoose');
var Comment = require('./comment');
var User = require('./user')

// set up campground Schema
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

// set up campground model
var Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;