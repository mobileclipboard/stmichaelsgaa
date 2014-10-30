// app/models/discount_categories.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our news model
var discount_categorySchema = mongoose.Schema({
    category_name      	    : String,
    category_description	: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Discount_Category', discount_categorySchema);