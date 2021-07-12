// Validation Helpers
const { check } = require('express-validator');

// Register00
exports.validRegister = [
  check('username', 'Username is required')
    .notEmpty()
    .isLength({
      min: 4,
      max: 32,
    })
    .withMessage('username  must be between 3 to 25 characters'),
  check('phone', 'Phone is required').notEmpty(),
  check('phone')
    .isLength({
      min: 0,
      max: 11,
    })
    .withMessage('Phone must contain atleast 1-10 characters'),
  check('firstName', 'First Name is required')
    .notEmpty()
    .isLength({
      min: 4,
      max: 25,
    })
    .withMessage('First Name  must be between 3 to 25 characters'),
  check('lastName', 'Last Name is required')
    .notEmpty()
    .isLength({
      min: 3,
      max: 25,
    })
    .withMessage('Last Name  must be between 3 to 25 characters'),
  check('email').notEmpty().withMessage('Must be a valid email address'),
  check('password', 'Password is required').notEmpty(),
  check('password')
    .isLength({
      min: 6,
    })
    .withMessage('Password must contain atleast 6 characters')
    .matches(/\d/)
    .withMessage('password must contain a number'),
];

// Login
exports.validLogin = [
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password', 'password is required').notEmpty(),
  check('password')
    .isLength({
      min: 6,
    })
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('password must contain a number'),
];

exports.forgotPasswordValidator = [
  check('email')
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('Must be a valid email address'),
];

exports.resetPasswordValidator = [
  check('newPassword')
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must be at least  6 characters long'),
];

// Validation Helpers
// const { check } = require('express-validator');

// // Register00
// exports.validRegister = [
//   check('username', 'Username is required')
//     .not()
//     .isEmpty()
//     .isLength({
//       min: 0,
//       max: 32,
//     })
//     .withMessage('username  must be between 3 to 25 characters'),
//   check('phone', 'Phone is required').isEmpty(),
//   check('phone')
//     .isLength({
//       min: 0,
//       max: 11,
//     })
//     .withMessage('Phone must contain atleast 1-10 characters'),
//   check('firstName', 'First Name is required')
//     .isEmpty()
//     .isLength({
//       min: 0,
//       max: 25,
//     })
//     .withMessage('First Name  must be between 3 to 25 characters'),
//   check('lastName', 'Last Name is required')
//     .isEmpty()
//     .isLength({
//       min: 0,
//       max: 25,
//     })
//     .withMessage('Last Name  must be between 3 to 25 characters'),
//   check('email').isEmpty().withMessage('Must be a valid email address'),
//   check('password', 'Password is required').isEmpty(),
//   check('password')
//     .isLength({
//       min: 0,
//     })
//     .withMessage('Password must contain atleast 6 characters')
//     .matches(/\d/)
//     .withMessage('password must contain a number'),
// ];

// // Login
// exports.validLogin = [
//   check('email').isEmail().withMessage('Must be a valid email address'),
//   check('password', 'password is required').notEmpty(),
//   check('password')
//     .isLength({
//       min: 6,
//     })
//     .withMessage('Password must contain at least 6 characters')
//     .matches(/\d/)
//     .withMessage('password must contain a number'),
// ];

// exports.forgotPasswordValidator = [
//   check('email')
//     .not()
//     .isEmpty()
//     .isEmail()
//     .withMessage('Must be a valid email address'),
// ];

// exports.resetPasswordValidator = [
//   check('newPassword')
//     .not()
//     .isEmpty()
//     .isLength({ min: 6 })
//     .withMessage('Password must be at least  6 characters long'),
// ];
