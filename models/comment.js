var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
	author: String,
	body: String,
	date: { type: Date, default: Date.now }
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;