var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

var UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      index: true,
      lowercase: true
    },
    password: {
      type: String
    }
  },
  { timestamps: true }
);
UserSchema.pre("save", function(next){
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  //hash password
  bcrypt.genSalt(10, function(err, salt) {
      if(err)throw err;
    bcrypt.hash(user.password, salt, function(err, hash) {
      // Store hash in your password DB.
      user.password = hash;
      next();
    });
  });
});

var User = (module.exports = mongoose.model("User", UserSchema));


//custom functions for accessing the database
module.exports.getUserByUsername = function(username, callback) {
  var query = {
    username: username
  };
  User.findOne(query, callback);
};
module.exports.comparePassword = function(password, hash, callback) {
  bcrypt.compare(password, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};
module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
};
module.exports.getAllUsers = function(callback) {
  User.find({}, callback);
};
module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};
module.exports.updateUser = function(id, source, callback) {
  User.findByIdAndUpdate(id, source, callback);
};
module.exports.deleteUser = function(id, callback) {
  User.findByIdAndRemove(id, callback);
};
