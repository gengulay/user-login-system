var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

//UserSchema
var UserSchema = new Schema({
  full_name: {type: String},
  user_email: {type: String},
  username: {type: String},
  password: {type: String},
  imageProfile: {type: String}
});

//Export model
var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, cb) {
  User.findById(id, cb);
}

module.exports.getUserByUsername = function(username, cb) {
  var query = {username: username};
  User.findOne(query, cb);
}

module.exports.comparePassword = function(candidatePassword, hash, cb) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    cb(null,isMatch);
});
}

module.exports.createUser = function(newUser, cb) {
  bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
          newUser.password = hash;
          newUser.save(cb);
      });
  });
}
