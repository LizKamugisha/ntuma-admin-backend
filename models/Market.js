const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
    market_image: String,
    market_name: String,
    market_location: String

})

module.exports = mongoose.model('Markets', marketSchema);
