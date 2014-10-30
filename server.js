//set up
// get all the tools we need

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var multer = require('multer');
var flash = require('connect-flash');
var path = require('path'); // used for setting the public directory


var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


var configDB = require('./config/database.js');

// Configuration
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for Configuration
require('./app/models/news.js');
require('./app/models/diary.js');
require('./app/models/discounts.js');
require('./app/models/discount_categories.js');

// set up our express application

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(multer({
	dest: './public/images/content_photos', 
	rename: function (fieldname, filename) {
    	return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
    },
    onFileUploadStart: function (file) {
	  console.log(file.fieldname + ' is starting ...')
	}
}));


app.use(express.static(path.join(__dirname, 'public'))); //use public as the default folder for assets
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); //session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login session
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ==========================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport





// launch ==========================
app.listen(port);
console.log('The magic happens on port: ' + port);
