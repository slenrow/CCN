var passport = require('passport');
var Account = require('../models/account');
var blogPost = require('../models/blogPost');

var express = require('express');
var mongoose = require( 'mongoose' );
//var Comment = mongoose.model( 'Comment' );
var app = require('../app');
var fs = require('fs');
var busboy = require('connect-busboy');
var Grid = require('gridfs-stream');
var router = express.Router();

var content = "";
//var ArticleProvider = require('./articleprovider-memory').ArticleProvider;
//var ObjectID = require('mongodb').ObjectID



var resourceDB = mongoose.createConnection('mongodb://localhost/resourceDB'); //used with gridFS for file sharing
Grid.mongo = mongoose.mongo;
var gfs = undefined;
resourceDB.once('open', function () {
    console.log("open gfs db");
  gfs = Grid(resourceDB.db); //gfs ->gridFS db connection var
  
});


	router.get('/', function (req, res) {
		res.render('index', { title: 'CCN', user: req.user });
	});

	router.get('/ourteam', function (req, res) {
		res.render('ourteam', { title: 'The CCN Crew' });
	});

	router.get('/profile', function (req, res) {
		res.render('profile', {title: 'Directory'});
	});

	router.get('/calendar', function (req, res) {
		res.render('calendar', {title: 'Calendar'});
	});

	router.post('/register', function (req, res) {

		var validEmail = req.body.email;
		var atSign = validEmail.indexOf("@");
		var dotEdu = validEmail.lastIndexOf(".edu");

		if (dotEdu < atSign) {
			res.render('error', {
				message: 'Please enter a valid .edu email address'
			});
		}

		else {
			Account.register(
				new Account({ 
					name : req.body.name,
					email : req.body.email,
					username : req.body.username,
					institution : req.body
				}),
				req.body.password, function (err, account) {
					if (err) {
						return res.render('error', { 
							message: 'Account already exists. Try logging in.' 
						});
					}

					passport.authenticate('local')(req, res, function () {
						res.redirect('/');
					});
			});
		}
	});

	router.post('/login', passport.authenticate('local'), function (req, res) {
		res.redirect('/profile');
	});

	router.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	router.get('/community', function (req, res) {
		res.render('blog', {title: 'Community'});
	});

	router.get('/community/start_ups', function(req, res){
		//console.log("start_ups"); 
		blogPost.find(function(err, allPost){
			if (err)
				res.send(err);
		           
			res.render('start_ups.jade', {
				title: 'Start Ups',
				"posts": allPost
						});
			console.log("post render");
			});
			
	});

	router.get("/community/start_ups/new", function(req, res){
		res.render("blog_new.jade", {title: 'New Post'});
	});

	router.get("/dropdown", function(req, res){
		res.render("dropdowntest.jade", {title: 'New Post'});
	});

	router.post("/community/start_ups/new",function(req,res){
		var bPost = new blogPost();
		bPost.title = req.body.title;
		bPost.content = req.body.content;
		bPost.votes = 1;

		bPost.save(function(err){
			if(err)
				res.send(err);

			console.log(bPost);
			//console.log(bPost.content);
			//console.log(bPost.votes);
			res.redirect('/community/start_ups');
			
		});
	});

	router.get('/community/start_ups/:id', function(req, res){
		console.log(req.params.id);
		
		blogPost.findOne({title: req.params.id}, function(err, post){
			console.log(req.params.id);
			res.render('blog_show.jade', {
					post: post,
					comments: post.comments
				});
		});
	});

	router.post('/blog/addComment', function(req,res){
		
			console.log("this is the post id"+req.body.id);
			//console.log(req.body.)
			
			 var comment = {
	       
	        body: req.body.comment, 
	        date: new Date(),
	        username: req.body.person 
	    };
	   
	    blogPost.findOneAndUpdate(
	      { title: req.body.id },
	      { $push: { comments: comment }},
	      { safe: true, upsert: true },
	      function(err, blogModels) {
	        // Handle err
	        });

	    console.log("comment content "+comment);
	    res.redirect('back');
	});

	router.post("/blog/upvote", function(req, res){
		var query = {"title": req.body.id};
		var update = {$inc:{votes: 1}};
		console.log(req.body.id);
		var options = {new: true};
		blogPost.findOneAndUpdate(query, update, options, function(err, post) {
  			if (err) {
    			console.log('got an error');
 			 }
 			 console.log(post.votes);

		});
		res.redirect("back");
	});

	router.post("/blog/downvote", function(req, res){
		var query = {"title": req.body.id};
		var update = {$inc:{votes: -1}};
		console.log(req.body.id);
		var options = {new: true};  
		blogPost.findOneAndUpdate(query, update, options, function(err, post) {
  			if (err) {
    			console.log('got an error');
 			 }
 			 console.log(post.votes);

		});
		res.redirect("back");
	});

	router.get("/community/resources", function(req, res){

		gfs.files.find({}).toArray(function (err, files) {
			if (err)
				res.send(err);
		    //console.log(files);
			res.render('resources.jade', {
				title: 'Resources',
				"resources": files
						});
			});
	});

	router.get("/community/resources/upload", function(req, res){
		res.render("upload.jade", {title: 'Upload'});
	});

	router.post("/fileupload", function(req, res){
		var stream;
	    req.pipe(req.busboy);
	    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
	        console.log("Uploading: " + filename); 
	        //fstream = fs.createWriteStream('./files/' + filename);
	        stream = gfs.createWriteStream({filename: filename, content_type: mimetype});
	        file.pipe(stream);
	        stream.on('close', function () {
	            res.redirect('/community/resources'); 
	        });
	         
	    });
	});

	router.get("/filedownload/:filename", function(req,res){
		console.log(req.params);
		//console.log(req.params.filename);
		var filename = req.params.filename;
		
		var downStream = gfs.createReadStream(filename);
		downStream.pipe(res);
		downStream.on('close', function(){
			office.parse(downStream, function(err,data){
				console.log(data.sheets);
			});
			res.redirect("back");
		});
		
		
		/*
			console.log("downloading: "+filename);
			downStream = gfs.createReadStream({filename: filename, content_type: mimetype});
			downStream.pipe(res);
			*/
			
		

	});

module.exports = router;
