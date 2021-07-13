const express = require("express");
const router = express.Router();
const multer = require("multer");
path = require("path");
const bodyParser = require("body-parser");
const Assistants = require("../models/Assistants");

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
}).single("profile_pic");

router.get("/assistants", async (req, res) => {
  try {
    const assistants = await Assistants.find();
    res.json(assistants);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/assistants", upload, async (req, res) => {
  console.log(req.body);
  const marketBoy = new Assistants({
    firstname: req.body.firstname,
    surname: req.body.surname,
    email: req.body.email,
    phone: req.body.phone,
    // passwordhash: req.body.passwordHash
    // isAssistant: req.body.isAssistant
    // gender: req.body.gender,
    address: req.body.address,
    market: req.body.market,
    refNumber: req.body.refNumber,
    profile_pic: req.body.profile_pic,
    password: req.body.password,
    confirm_password: req.body.confirm_password,
    
  });
  try {
    marketBoy.profile_pic =
      "http://localhost:1200/uploads/" + req.file.filename;
    const savedAssistants = await marketBoy.save();
    res.json(savedAssistants);
  } catch (err) {
    res.json({ message: err });
  }
});

// delete a specific market

module.exports = router;
