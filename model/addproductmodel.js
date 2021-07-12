const mongoose = require('mongoose');

const addproductsSchema = new mongoose.Schema({
  productname: String,
  producttype: String,
  productprice: String,
  uploadimage: String,
});
module.exports = mongoose.model('Addproduct', addproductsSchema);
