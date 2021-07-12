const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
  username: String

});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Users', userSchema);