const express = require('express');

const router = express.Router();
const passport = require('passport');

// gets and displays a login page
// eslint-disable-next-line no-unused-vars
router.get('/', (_req, res) => {
  // res.render('adminSignIn');
});

// process the username and password
router.post('/', passport.authenticate('local'), (req, res) => {
  req.session.user = req.user;
  // res.redirect('/dashboard');
});
module.exports = router;
