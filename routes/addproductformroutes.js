const express = require('express');
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');

const router = express.Router();
const multer = require('multer');

// eslint-disable-next-line no-unused-vars
const { urlencoded } = require('body-parser');
const Addproduct = require('../model/addproductmodel');

// uploading image
const storage = multer.diskStorage({
  destination(req, _file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

// Add product list
router.get('/', async (req, res) => {
  try {
    const addproducts = await Addproduct.find();
    if (!addproducts) throw Error('No products');

    res.status(200).json(addproducts);
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
  const addproductmodel = new Addproduct({
    productname: req.body.productname,
    producttype: req.body.producttype,
    productprice: req.body.productprice,
    uploadimage: req.file,
    // For future reference this is supposed to be uploadimage:req.file.path incase we run into future errors capturing images.
    // uploadimage: req.file,
  });

  try {
    const products = await addproductmodel.save();
    if (!products) throw Error('Something went wrong saving the item');

    res.status(200).json(products);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
