var Account = require('./models/account');
var Account = require('./models/blogPost');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var slash = require('express-slash');

var mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


var mongo = require('mongodb');
//var monk = require('monk');

//var db = monk('localhost:27017');

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();
//app.enable('strict routing');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//app.use('/static', express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));//app.use('public/css', express.static(path.join(__dirname, 'public/css')));
//app.use('public/js', express.static(path.join(__dirname, 'public/js')));
//app.use('public/stylesheets', express.static(path.join(__di'public/stylesheets')));
//app.all('/main', function(req, res) { res.redirect('/main/'); });
//app.use('/main/',express.static(__dirname+'/public'));





passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

var db = mongoose.connect('mongodb://localhost/ccn');

//app.use(slash());
app.use(function(req, res, next) {
   if(req.url.substr(-1) == '/' && req.url.length > 1)
       res.redirect(301, req.url.slice(0, -1));
   else
       next();
});

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
//app.use('/community', routes);

//app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// no need 'var app = require('../app');' any more, cause it has defined in 'app.js' already.
var debug = require('debug')('my-application');
// module.exports = app; You need to comment this line which is default in 'app.js' with Express.js 4.x
module.exports = app;
