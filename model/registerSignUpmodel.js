const mongoose = require('mongoose');
const crypto = require('crypto');
// const passportLocalMongoose = require('passport-local-mongoose');

const registerUpsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    // usernameField: 'email',
    // passwordField: 'password',
    phone: String,
    firstName: String,
    lastName: String,
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: 'admin',
      // This on line 32 was default but changed it so that you can add users who are email authenticated by default the same in Login.js Form
      // default: 'subscriber',
    },
    resetPasswordLink: {
      data: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Virtual Password
registerUpsSchema
  .virtual('password')
  .set(function (password) {
    // set password note you must use normal function not arrow function
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
registerUpsSchema.methods = {
  // Generate Salt
  makeSalt() {
    // eslint-disable-next-line prefer-template
    return Math.round(new Date().value * Math.random()) + '';
  },
  // Encrypt Password
  encryptPassword(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
  // Compare password brtween plain get from user and hashed
  authenticate(plainPassword) {
    return this.encryptPassword(plainPassword) === this.hashed_password;
  },
};

// registerUpsSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('RegistersignUp', registerUpsSchema);
