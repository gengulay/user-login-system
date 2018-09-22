var express = require('express');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var expressValidator = require('express-validator');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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

  //check errors
  var errors = req.expressValidator();

  if(errors) {
  	console.log(errors)
  }
  else {
  	console.log('No errors Found!');
  }
});

router.get('/login', function(req, res, next) {
  res.render('login-form', {title: 'Login'});
});

module.exports = router;
