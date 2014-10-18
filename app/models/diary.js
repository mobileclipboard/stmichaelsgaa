// app/models/diary.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our news model
var diarySchema = mongoose.Schema({
    diary_startdate   	: Date,
    diary_enddate		: Date,
    diary_title       	: String,
    diary_description	: String,
    diary_location		: String
});



// create the model for users and expose it to our app
module.exports = mongoose.model('Diary', diarySchema);