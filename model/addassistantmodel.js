const mongoose = require('mongoose');

const addassitantsSchema = new mongoose.Schema({
  uploadimage: String,
  asstfirstname: String,
  asstlastname: String,
  phone: String,
  accounttype: String,
  market: String,
  status: String,
  userId: String,
  username: String,
  password: String,
  documentation: String,
});
module.exports = mongoose.model('Addassistant', addassitantsSchema);
