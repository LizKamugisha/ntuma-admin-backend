const mongoose = require('mongoose');
const crypto = require('crypto');

const addassitantsSchema = new mongoose.Schema(
  {
    asstfirstname: String,
    asstlastname: String,
    email: String,
    gender: String,
    phone: String,
    homeaddress: String,
    market: String,
    refnumber: String,
    uploadimage: String,
    hashed_password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Virtual Password
addassitantsSchema
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
addassitantsSchema.methods = {
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

module.exports = mongoose.model('Addassistant', addassitantsSchema);
