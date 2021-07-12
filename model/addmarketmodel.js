const mongoose = require('mongoose');

const addmarketsSchema = new mongoose.Schema({
  market_name: String,
  location: String,
  uploadimage: String,
});
module.exports = mongoose.model('Addmarket', addmarketsSchema);
