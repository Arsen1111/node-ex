var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var expressValidator = require('express-validator');
router.use(expressValidator())

var User = require('../models/user');

/*router.get('/register', function(req, res) {
  res.render('register', {title:'Register'});
});*/

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});

/*router.post('/register', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  req.checkBody('username','Username field is required').notEmpty();
  req.checkBody('password','Password field is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  if(errors){
    res.render('register',{
      errors: errors
    });
  }else{
    var newUser = new User({
      username: username,
      password: password
    });
    User.createUser(newUser, function(err, user){
      if(err) throw err
      console.log(user);
    });

    req.flash('success_msg', 'You have succesfully registered/created account');
    res.redirect('/users/login');
  }
});*/

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown user'});
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      }else{
        return done(null, false, {message: 'Invalid password'});
      }
    });
  });
}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login', passport.authenticate('local', { successRedirect: '/todos', failureRedirect:'/users/login', failureFlash: true}),
 function(req, res) {
  //req.flash('success_msg','You are now logged in');
  res.redirect('/todos');
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success_msg', 'You have succesfully logged out');
  res.redirect('/users/login');
});

module.exports = router;
