var express = require('express');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var expressValidator = require('express-validator');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var router = express.Router();

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// log out user
router.get('/logout', function(req, res, next) {
  req.logout();
  req.flash('success', 'You are now logged out!');
  res.redirect('/users/login');
});

// GET user registration form
router.get('/register', function(req, res, next) {
  res.render('register-form', {title: 'Register'});
});

// POST user registration form
router.post('/register', upload.single('userImage'), function(req, res, next) {
  var fullName = req.body.fullName;
  var email = req.body.userEmail;
  var username = req.body.userName;
  var password = req.body.userPwd;
  var confirmPassword = req.body.userConfirmPwd;
  var imageProfile;

  if(req.file) {
  	console.log('file uploading');
  	imageProfile = req.file.filename;
  }
  else {
  	console.log('no image found!');
  	imageProfile = "noImage.jpg";
  }

  //validator
  req.checkBody('fullName', 'Full Name should not be blank').notEmpty();
  req.checkBody('userEmail', 'Email should not be blank').notEmpty();
  req.checkBody('userEmail', 'Email should be valid').isEmail();
  req.checkBody('userName', 'Username should not be blank').notEmpty();
  req.checkBody('userPwd', 'Password should not be blank').notEmpty();
  req.checkBody('userConfirmPwd', 'Password does not match').equals(req.body.userPwd);

  //check errors
  var errors = req.validationErrors();

  if(errors) {
  	res.render('register-form', {
      errors: errors
    })
  }
  else {
  	var newUser = new User({
      full_name: fullName,
      user_email: email,
      username: username,
      password: password,
      imageProfile: imageProfile
    });

    User.createUser(newUser, function(err, user) {
      if(err) throw err;
    });
    req.flash('success', 'You have successfully registered');
    res.redirect('/');
  }
});

router.get('/login', function(req, res, next) {
  res.render('login-form', {title: 'Login'});
});

router.post('/login', passport.authenticate('local', {successRedirect: '/',failureRedirect:'/users/login', failureFlash:'Wrong Credentialsssss'}), function(req, res) {
    req.flash('success', 'Welcome!');
    res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new localStrategy(function(username, password, done) {
  User.getUserByUsername(username, function(err, user) {
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'User Not Found!!!'});
    }
    User.comparePassword(password, user.password, function(err, isMatch) {
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message: 'Wrong Credentials!!!'});
      }
    });
  });
}));


module.exports = router;
