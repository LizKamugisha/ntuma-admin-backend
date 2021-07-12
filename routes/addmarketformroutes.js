const express = require('express');
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');

const router = express.Router();

// eslint-disable-next-line no-unused-vars
const Addmarket = require('../model/addmarketmodel');

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

router.post('/', async (req, res) => {
  // outputs the form values in the console
  console.log(req.body);
  const addproductmodel = new Addmarket({
    name: req.body.name,
    location: req.body.location,
  });

  try {
    const addmarkets = await addproductmodel.save();
    if (!addmarkets) throw Error('Something went wrong saving the item');

    res.status(200).json(addmarkets);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
