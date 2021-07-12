/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const multer = require('multer');
// eslint-disable-next-line no-undef
path = require('path');

const { check, validationResult } = require('express-validator');

const { urlencoded } = require('body-parser');
const Addassistant = require('../model/addassistantmodel');

// uploading image
const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, 'uploads/');
  },
  filename(_req, file, cb) {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName);
  },
});

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

router.post(
  '/',
  [
    check('asstfirstname', 'First Name is required')
      .notEmpty()
      .isLength({
        min: 4,
        max: 25,
      })
      .withMessage('First Name  must be between 3 to 25 characters'),
    check('email')
      .notEmpty()
      .isEmail()
      .withMessage('Must be a valid email address'),
    check('gender').notEmpty().isIn().withMessage('Must be a valid gender'),
    // check(req.body.checkbox.isIn(['male', 'female'])),
    check('phone', 'Phone Number is required').notEmpty(),
    check('phone')
      .isLength({
        min: 10,
        max: 10,
      })
      .withMessage('Phone Number must contain atleast 1-10 characters'),
    check('phone', 'Phone Number should be in numbers').isNumeric(),
    check('asstlastname', 'Last Name is required')
      .notEmpty()
      .isLength({
        min: 4,
        max: 25,
      })
      .withMessage('Last Name must be between 3 to 25 characters'),
    check('homeaddress', 'Home Address is required')
      .notEmpty()
      .isLength({
        min: 5,
        max: 45,
      })
      .withMessage('Home Address  must be between 5 to 45 characters'),
    check('market', 'Market is required')
      .notEmpty()
      .isLength({
        min: 5,
        max: 15,
      })
      .withMessage('Market must be between 5 to 15 characters'),
    check('refnumber', 'Referral Number is required')
      .notEmpty()
      .isLength({
        min: 10,
        max: 10,
      })
      .withMessage('Referral Number must be between 1 to 10 characters'),
    check('uploadimage', 'Upload image is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
    check('password')
      .isLength({
        min: 6,
      })
      .withMessage('Password must contain atleast 6 characters')
      .matches(/\d/)
      .withMessage('password must contain a number'),
  ],
  upload.single('uploadimage'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(422).json({
        errors: firstError,
      });
    }
    // outputs the form values in the console
    console.log(req.body);
    const addassistantmodel = new Addassistant({
      asstfirstname: req.body.asstfirstname,
      asstlastname: req.body.asstlastname,
      email: req.body.email,
      gender: req.body.gender,
      phone: req.body.phone,
      homeaddress: req.body.homeaddress,
      market: req.body.market,
      refnumber: req.body.refnumber,
      uploadimage: req.body.uploadimage,
      password: req.body.password,

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
  }
);

module.exports = router;
