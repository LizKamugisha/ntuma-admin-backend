const express = require("express");
const router = express.Router();
const multer = require("multer");
path = require("path");
const bodyParser = require("body-parser");
const Product = require("../models/Product");

//Setting image upload storage engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//Image upload
const upload = multer({
  storage: storage,
}).single("image");

router.get("/product", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/product", upload, async (req, res) => {
  console.log(req.body);
  const productList = new Product({
    name: req.body.name,
    description: req.body.description,
    detailedDescription: req.body.detailedDescription,
    image: req.body.image,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
    dateCreated: req.body.dateCreated,
    
  });
  try {
    // req.body allows us to access data
    //  in a string or json object from the client side, it is used to recieve data thru post and put request in our exxpress server
    productList.image = "http://localhost:1200/uploads/" + req.file.filename;
    const pdt = await productList.save();
    res.json(pdt);
    
  } catch (err) {
    res.json({ message: "erro something went wrong" });
  }
});
module.exports = router;
