const mongoose = require("mongoose");

const assistantsSchema = new mongoose.Schema({
  firstName: String,
  surName: String,
  gender: String,
  phone: String,
  address: String,
  market: String,
  refNumber: String,
  profile_pic: String,
  password: String,
  confirm_password: String,
  email: String,
});

module.exports = mongoose.model("Assistants", assistantsSchema);
