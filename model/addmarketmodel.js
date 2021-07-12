const mongoose = require('mongoose');

const addmarketsSchema = new mongoose.Schema({
  name: String,
  location: String,
});
module.exports = mongoose.model('Addmarket', addmarketsSchema);
