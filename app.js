var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan'); 
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; 
var jwt = require('jsonwebtoken');
var secretmonster = 'meanstartedhahahaha';

var routes = require('./routes/index');
var users = require('./routes/users');
var apiAuth = require('./routes/api/auth');
var apiUser = require('./routes/api/user');
var apiStores = require('./routes/api/stores');
var apiCarts = require('./routes/api/carts');
var apiProducts = require('./routes/api/products');
var apiSettings = require('./routes/api/settings');
var mdWares = require('./routes/middlewares');

var app = express();

// add locals
app.locals._ = require('lodash');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/assets/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));


app.use(require('express-session')({
    secret: 'datbitch',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); 


app.use('/users', users); 
app.use('/api/auth', apiAuth);  
app.use('/api/user', mdWares.validateToken, apiUser); 
app.use('/api/products', apiProducts);  
app.use('/api/settings', mdWares.validateToken, apiSettings);  
app.use('/api/stores', apiStores);
app.use('/api/carts', mdWares.validateToken, apiCarts);  
app.use('/', routes);


// passport configuration
var User = require('./models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://127.0.0.1/meancart');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

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


module.exports = app;

