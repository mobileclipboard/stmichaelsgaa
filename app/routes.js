// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') }); 
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/checkusertype', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// ADMIN SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/checkusertype', isLoggedIn, function(req, res) {
		if(req.user.admin){
			res.render('admin.ejs', {
				user : req.user // get the user out of session and pass to template
			});
		}
		else{
			res.redirect('/profile');
		}
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	//API Setup
	var mongoose = require('mongoose');
	var Users = mongoose.model('User');
	var News = mongoose.model('News');
	var NewsArticle	= require('./models/news');

	//API to access json of users
	app.get('/userapi', isLoggedInAsAdmin, function(req, res, next){
		Users.find(function(err, users){
			if(err){return next(err)};
			res.json(users);
		}); 
	});

	app.get('/newsapi', isLoggedInAsAdmin, function(req, res, next){
		News.find(function(err, news){
			if(err){return next(err)};
			res.json(news);
		}); 
	});

	app.post('/addArticle', isLoggedInAsAdmin, function(req, res, next){
		var newArticle =  new NewsArticle();
		newArticle.news_title = req.body.articleTitle	
		newArticle.news_article = req.body.articleText;
		newArticle.news_date = Date.now();
		newArticle.news_photos = [];
		if (req.files.image){
			newArticle.news_photos.push(req.files.image.path);
		};
		console.log(newArticle);
		newArticle.save(function(err, newArticle){
			if(err)
				throw err;
			res.json(newArticle);
		});
		res.redirect('/checkusertype');

	});

	app.post('/editArticle/:article_id', isLoggedInAsAdmin, function(req, res, next){
		var article_id = req.params.article_id;
		News.update({_id: article_id}, {
			news_title: req.body.articleTitle,	
			news_article: req.body.articleText
		},
		{multi: false},
		function(err, numAffected){
			console.log(numAffected);
		}
		);
		res.redirect('/checkusertype');
	
	});


	app.get('/deleteArticle/:article_id', isLoggedInAsAdmin, function(req, res, next){
		var article_id = req.params.article_id;
		console.log(article_id);
		News.find({_id: article_id}).remove().exec();
		res.redirect('/checkusertype');
	});

	var Diary = mongoose.model('Diary');
	var DiaryDate	= require('./models/diary');

	app.get('/diaryapi', isLoggedInAsAdmin, function(req, res, next){
		Diary.find(function(err, news){
			if(err){return next(err)};
			res.json(news);
		}); 
	});

	app.post('/addDate', isLoggedInAsAdmin, function(req, res, next){
		var newDate =  new DiaryDate();
		newDate.diary_title = req.body.dateTitle	
		newDate.diary_description = req.body.dateDescription;
		
		newDate.diary_location = req.body.dateLocation;


		var start_time = new Date();
		start_time.setFullYear(req.body.dateStartYear);
		start_time.setMonth(req.body.dateStartMonth);
		start_time.setDate(req.body.dateStartDay);
		start_time.setHours(req.body.dateStartHour);
		start_time.setMinutes(req.body.dateStartMinute);
		newDate.diary_startdate = start_time;
		
		var end_time = new Date();
		end_time.setFullYear(req.body.dateStartYear);
		end_time.setMonth(req.body.dateStartMonth);
		end_time.setDate(req.body.dateStartDay);
		end_time.setHours(req.body.dateEndHour);
		end_time.setMinutes(req.body.dateEndMinute);
		newDate.diary_enddate = end_time;

		console.log(newDate);
		newDate.save(function(err, newDate){
			if(err)
				throw err;
			res.json(newDate);
		});
		res.redirect('/checkusertype');


	});

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

function isLoggedInAsAdmin(req, res, next) {
	// if user is authenticated in the session and is an admin, carry on 
	if (req.isAuthenticated() && req.user.admin)
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
