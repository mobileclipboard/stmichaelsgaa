// app/models/news.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our news model
var newsSchema = mongoose.Schema({
    news_title        : String,
    news_article      : String,
    news_photos       : Array,
    news_date         : Date
});



// create the model for users and expose it to our app
module.exports = mongoose.model('News', newsSchema);