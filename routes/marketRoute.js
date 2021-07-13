const express = require("express");
const router = express.Router();
const multer = require("multer");
path = require("path");
const bodyParser = require("body-parser");
const Market = require("../models/Market");

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
}).single("market_image");

router.get("/add-market", async (req, res) => {
  try {
    const markets = await Market.find();
    res.json(markets);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/add-market", upload, async (req, res) => {
  console.log(req.body);
  const marketPlace = new Market({
    market_image: req.body.market_image,
    market_name: req.body.market_name,
    market_location: req.body.market_location,
  });
  try {
    marketPlace.market_image =
      "http://localhost:1200/uploads/" + req.file.filename;
    const savedMarkets = await marketPlace.save();
    res.json(savedMarkets);
  } catch (err) {
    res.json({ message: err });
  }
});

// delete a specific market
router.delete("/add-market/:marketId", async (req, res) => {
  try {
    const removeMarket = await Market.deleteOne({ _id: req.params.marketId });
    var responseM = { message: "Some message!" };
    res.json(responseM);
  } catch (err) {
    res.json({ message: err });
  }
});

// update a market
router.put("/add-market/:marketId", async (req, res) => {
  try {
    const updateMarket = await Market.updateOne({ _id: req.params.marketId });
    res.json(updateMarket);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
// , { $set: {market_name: req.body.market_name }}
