/* eslint-disable eqeqeq */
const express = require('express');
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');

const router = express.Router();
const multer = require('multer');
// eslint-disable-next-line no-undef
path = require('path');

const { check, validationResult } = require('express-validator');

// eslint-disable-next-line no-unused-vars
const { urlencoded } = require('body-parser');
const Addmarket = require('../model/addmarketmodel');

// uploading image
const storage = multer.diskStorage({
  destination(req, _file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName);
  },
});

// Normal Uploading Multer Images
// const upload = multer({
//   storage,
// });

// Validating multer images
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      // es lint eqeeqeq complaining if code doesnt work undo these chnages
      // file.mimetype === 'image/png' ||
      // file.mimetype === 'image/jpg' ||
      // file.mimetype === 'image/jpeg'
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

// Register Form registration
// router.get('/registersignup', (req, res) => {
//   res.render('registerSignUp');
// });
router.get('/', async (req, res) => {
  try {
    const addmarkets = await Addmarket.find();
    if (!addmarkets) throw Error('No markets');

    res.status(200).json(addmarkets);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.post(
  '/',
  [
    check('market_name', 'Product name is required')
      .notEmpty()
      .isLength({
        min: 4,
        max: 25,
      })
      .withMessage('Product name  must be between 3 to 25 characters'),
    check('location', 'location is required')
      .notEmpty()
      .isLength({
        min: 4,
        max: 25,
      })
      .withMessage('Location  must be between 3 to 25 characters'),
    check('uploadimage', 'Upload image is required').notEmpty(),
  ],
  upload.single('uploadimage'),
  async (req, res) => {
    const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(422).json({ errors: errors.array() });
    // }
    // Validation to req.body we will create custom validation in seconds
    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(422).json({
        errors: firstError,
      });
    }
    // outputs the form values in the console
    console.log(req.body);
    const addproductmodel = new Addmarket({
      market_name: req.body.market_name,
      location: req.body.location,
      uploadimage: req.body.uploadimage,
      // uploadimage: req.file.path,
    });
    try {
      const addmarkets = await addproductmodel.save();
      if (!addmarkets) throw Error('Something went wrong saving the item');

      res.status(200).json(addmarkets);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  }
);

// router.post('/', async (req, res) => {
//   // outputs the form values in the console
//   console.log(req.body);
//   const addproductmodel = new Addmarket({
//     name: req.body.name,
//     location: req.body.location,
//   });

//   try {
//     const addmarkets = await addproductmodel.save();
//     if (!addmarkets) throw Error('Something went wrong saving the item');

//     res.status(200).json(addmarkets);
//   } catch (e) {
//     res.status(400).json({ msg: e.message });
//   }
// });
module.exports = router;
