//Import mongoose to be used
const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    
    firstName: String,
    lastName: String,
    username:{
        type: String,
        unique: true
    },
    phone: String,
    policy:[{type: Boolean}]
    
  });

  //Export mongoose.
  module.exports = mongoose.model('Register', registerSchema);