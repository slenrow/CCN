var Account = require('./models/account');
var blogPost = require('./models/blogPost');
var resource = require('./models/resource');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var slash = require('express-slash');
var methodOverride = require('express-method-override');
var multipart = require('multipart');
var busboy = require('connect-busboy');

var mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var Grid = require('gridfs-stream');

var mongo = require('mongodb');
//var monk = require('monk');

//var db = monk('localhost:27017');

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();
//app.enable('strict routing');


//Socket.io
/*
var http = require('http').Server(app);
var io = require('socket.io')(http);

/*app.get('/', function(req, res){
  //res.sendfile('chat.jade');
//});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening...');
});*/


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(busboy()); 
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

//var db = mongoose.createConnection('mongodb://localhost/ccn');

//app.use(slash());
app.use(function(req, res, next) {
   if(req.url.substr(-1) == '/' && req.url.length > 1)
       res.redirect(301, req.url.slice(0, -1));
   else
       next();
});
/*
app.use(function(req,res,next){
    req.db = db;
    next();
});*/

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
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
// module.exports = app; You need to comment this line which is default in 'app.js' with Express.js 4.x
module.exports = app;

