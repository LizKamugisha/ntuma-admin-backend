/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const multer = require('multer');

const { urlencoded } = require('body-parser');
const Addassistant = require('../model/addassistantmodel');

// uploading image
const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, 'uploads/');
  },
  filename(_req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

// Add product list
router.get('/', async (req, res) => {
  try {
    const addassistants = await Addassistant.find();
    if (!addassistants) throw Error('No assistants');

    res.status(200).json(addassistants);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

// router.post('/', upload.single('uploadimage'), async (req, res) => {
//   //outputs the form values in the console
//   console.log(req.body);
//   console.log(req.file);
//   // res.redirect('/');
//   const addproductmodel = new Addproduct({
//     productname: req.body.productname,
//     producttype: req.body.producttype,
//     productprice: req.body.productprice,
//     uploadimage: req.file.path,
//   });
//   try {
//     await addproductmodel.save()
//     // res.send('Thank you for your registration!');
//     console.log(req.body);
//   //   res.redirect('/addproduct/addproductform')
// } catch (err) {
//     res.send('Sorry! Something went wrong.');
//     console.log(err);
// }
// })

router.post('/', upload.single('uploadimage'), async (req, res) => {
  // outputs the form values in the console
  console.log(req.body);
  const addassistantmodel = new Addassistant({
    uploadimage: req.file,
    asstfirstname: req.body.asstfirstname,
    asstlastname: req.body.asstlastname,
    phone: req.body.phone,
    accounttype: req.body.accounttype,
    market: req.body.market,
    status: req.body.status,
    userId: req.body.userId,
    username: req.body.username,
    password: req.body.password,
    documentation: req.body.documentation,
    // For future reference this is supposed to be uploadimage:req.file.path incase we run into future errors capturing images.
    // uploadimage: req.file,
  });

  try {
    const assistants = await addassistantmodel.save();
    if (!assistants) throw Error('Something went wrong saving the item');

    res.status(200).json(assistants);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
