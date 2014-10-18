// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    first_name        : String,
    second_name         : String,
    local            : {
        email        : String,
        password     : String,
    },
    contacts         : {
        phone        : String,
        address      : String
    },
    payment_method   : String,
    paid_until       : Date,
    admin            : {type: Boolean, default: 0}
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);