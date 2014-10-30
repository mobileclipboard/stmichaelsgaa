// app/models/discounts.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our news model
var discountsSchema = mongoose.Schema({
    discount_company   		: {
    						name: String,
    						address: String,
    						phone: String,
    						email: String,
    						website: String,
    						logopath: String
    },
    discount_expiry			: Date,
    discount_title      	: String,
    discount_description	: String,
    discount_category		: [{type: mongoose.Schema.Types.ObjectId, ref: 'Discount_Category'}]
});



// create the model for users and expose it to our app
module.exports = mongoose.model('Discount', discountsSchema);