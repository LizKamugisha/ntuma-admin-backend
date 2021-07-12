const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: String,
  productType: String,
  price: String,
  quantity: String,
  image: String,
});

module.exports = mongoose.model("Product", productSchema);
