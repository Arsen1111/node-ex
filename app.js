var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var xssFilter = require('x-xss-protection');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var sanitize = require('mongo-sanitize');
var User = require('./models/user');
//mongoose.connect('mongodb://localhost/express-todo');
//mongoose.connect('mongodb://'+ process.env.MONGODB_USER +':'+ process.env.MONGODB_PASSWORD +'@10.131.29.17:27017/'+ process.env.MONGODB_DATABASE);
mongoose.connect('mongodb://'+ process.env.MONGODB_USER +':'+ process.env.MONGODB_PASSWORD +'@10.129.39.142:27017/'+ process.env.MONGODB_DATABASE);
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var todo = require('./routes/todo');

var app = express();

var todoRouter = express.Router();

app.use(xssFilter());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Handle sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.use(flash());
app.use(function(req,res,next){
  res.locals.messages = require('express-messages')(req,res);
  next();
});

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/todos', todoRouter);

todoRouter.get('/', todo.all);
todoRouter.get('/show', todo.display);
todoRouter.get('/:id', todo.viewOne);
todoRouter.post('/create', todo.create);
todoRouter.post('/markCompleted/:id', todo.markCompleted);
todoRouter.post('/destroy/:id', todo.destroy);
todoRouter.post('/edit/:id', todo.edit);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
