var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session({
	secret: 'do-a-barrel-roll-0123456789',
	resave: true,
	saveUninitialized: true
}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

// error handlers
app.use(function (req, res, next) {

	if (!req.path.match(/\/login|\/logout/)) {
		req.session.redir = req.path;
	}
	var now = new Date();
	var lastTime = new Date(req.session.lastTime);
	req.session.lastTime = now.toString();

	var seconds = (now.getTime() - lastTime.getTime()) / 1000;
	if (seconds > 120) {
		delete req.session.user;
		if (!req.session.errors) {
			req.session.errors = [];
		}
		req.session.errors.push('Sesión caducada');
	}

	res.locals.session = req.session;
	next();
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});

app.use('/', routes);

module.exports = app;
