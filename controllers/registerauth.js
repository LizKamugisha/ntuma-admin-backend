/* eslint-disable no-param-reassign */
/* eslint-disable no-lonely-if */
/* eslint-disable no-dupe-keys */
/* eslint-disable no-shadow */
/* eslint-disable no-else-return */
/* eslint-disable prettier/prettier */
/* eslint-disable arrow-body-style */
/* eslint-disable object-shorthand */
/* eslint-disable no-sequences */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const expressJwt = require('express-jwt');
const _ = require('lodash');
// eslint-disable-next-line import/no-unresolved
const { OAuth2Client, UserRefreshClient } = require('google-auth-library');
const fetch = require('node-fetch');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
// I will use for send email sendgrid you can use nodemailer also
const sgMail = require('@sendgrid/mail');
const mailgun = require('mailgun-js');
const mail = require('@sendgrid/mail');
const RegistersignUp = require('../model/registerSignUpmodel');
// Custom error handler to get useful error from database errors
// eslint-disable-next-line import/no-unresolved
const { errorHandler } = require('../helpers/dbErrorHandling');

const DOMAIN = 'sandboxb7287b4c62c74643864ccb6d8de5f0c6.mailgun.org';
// eslint-disable-next-line no-use-before-define
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });

// sgMail.setApiKey(process.env.MAIL_KEY);

exports.registersignUp = (req, res) => {
  const { username, email, phone, firstName, lastName, password } = req.body;
  const errors = validationResult(req);
  // console.log(username, email, phone, firstName, lastName, password);
  console.log(req.body)

  // Validation to req,body we will create custom validation in seconds
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
    // eslint-disable-next-line no-else-return
  } else {
    RegistersignUp.findOne({
      email,
    }).exec((err, user) => {
      // if user exists
      if (user) {
        return res.status(400).json({
          errors: 'Email is taken',
        });
      }
    });

    // Generate Token
    const token = jwt.sign(
      {
        username,
        email,
        phone,
        firstName,
        lastName,
        password,
      },
      // eslint-disable-next-line no-unused-expressions
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: '20m',
      }
    );

    // Email data sending
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Account Activation link',
      html: `
        <h1>Please use the following to activate your account</h1>
        <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
        <hr />
        <p>This email may contain sensetive information</p>
        <p>${process.env.CLIENT_URL}</p>
        `,
    };

    // eslint-disable-next-line no-unused-vars
    mg.messages().send(emailData, function (error, body) {
      if (error) {
        return res.json({
          // error: err.message,
          error: errorHandler(err),
        });
      }
      return res.json({
        message: 'Email has been sent, Kindly Activate Your Account',
      });
    });

    // sgMail
    //   .send(emailData)
    //   // eslint-disable-next-line arrow-body-style
    //   .then((sent) => {
    //     return res.json({
    //       message: `Email has been sent to ${email}`,
    //     });
    //   })
    //   .catch((err) => {
    //     return res.status(400).json({
    //       error: errorHandler(err),
    //     });
    //   });
    // const data = {
    //   from: 'noreply@ntuma.com',
    //   to: email,
    //   subject: 'Account Activation Link',
    //   html: `
    //   <h2>Please click on given link to activate you account</h2>
    //   <p>${process.env.CLIENT_URL}/authentication/activate/${token}</p>
    //   `,
    // };
    // // eslint-disable-next-line no-unused-vars
    // mg.messages().send(data, function (error, body) {
    //   if (error) {
    //     return res.json({
    //       // error: err.message,
    //     });
    //   }
    //   return res.json({
    //     message: 'Email has been sent, kindly activate your account',
    //   });
    // });
  }
};

// Register for Backend done let's create for it

// Activation and save to database
exports.activationController = (req,res) => {
  const { token } = req.body

  if (token) {
    // Verify the token is valid or not or expired
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION,
      (err, decoded) => {
      if (err) {
        return res.status(401).json({
          errors: 'Expired Token, Signup again'
        })
      } else {
        // if valid save to database
        // Get username phone email firstName lastName password
        const { username, email, phone, firstName, lastName, password } = jwt.decode(token)
    
        const user = new RegistersignUp(     {
          username,
          email,
          phone,
          firstName,
          lastName,
          password,
        })
    
        user.save((err, user) => {
          if (err) {
            console.log('Save error', errorHandler(err));
            return res.status(401).json({
              errors: errorHandler(err)
            });
          } else {
            return res.json({
              success: true,
              message: 'Signup success',
              user,    
            });
          }
        })
      }
    })
  } else {
    return res.json({
      message: 'error happening please try again'
    })
  }
}

exports.loginController = (req, res) => {
  const { email, password } = req.body
  const errors = validationResult(req)

  // Validation to req.body we will create custom validation in seconds
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    // Check if user exist
    RegistersignUp.findOne({
      email
    }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          errors: 'User with that email does not exist. Please Signup'
        });
      }
    
      // Authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          errors: 'Email and password do not match'
        })
      }

      // Generate Token
      const token = jwt.sign(
        {
          _id: user._id
        }, process.env.JWT_SECRET,
        {
          expiresIn: '7d' // Token valid in 7 day you can set remember in front and set it for 30 days
        }
      )
      const {
        _id,
        username,
        email,
        role,
      } = user
      return res.json({
        token,
        user: {
          _id,
          username,
          email,
          role
        }
      })
    })
  }
}

exports.forgetController = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req)
  console.log(req.body)

  // Validation to req.body we will create custom validation in seconds
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    // Find if User exists
    RegistersignUp.findOne({
      email
    }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: 'User with that email does not exist'
        })
      }

      // if exist 
      // Generate token for user with this id valid for only 10 minutes
      const token = jwt.sign({
        _id: user._id
      }, process.env.JWT_RESET_PASSWORD, {
        expiresIn: '10m'
      })

      // Send email with this token
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset link',
        html: `
          <h1>Please Click to Link to Reset your password</h1>
          <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
          <hr />
          <p>This email may contain sensetive information</p>
          <p>${process.env.CLIENT_URL}</p>
        `,
      };

      return user.updateOne({
        resetPasswordLink: token
      }, (err, success) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err)
          })
        } else {
          // send email
          mg.messages().send(emailData, function (error, body) {
            if (error) {
              return res.json({
                message: `Email has been sent to ${email}`
              });
            }
            return res.json({
              message: 'Email has been successully sent'
            });
          });
        }
      })
    })
  }
}

// exports.resetController = (req, res) => {
//   const {resetPasswordLink, newPassword} = req.body
//   const errors = validationResult(req);

//   // Validation to req,body we will create custom validation in seconds
//   if (!errors.isEmpty()) {
//     const firstError = errors.array().map(error => error.msg)[0];
//     return res.status(422).json({
//       errors: firstError
//     });
//   } else {
//     if (resetPasswordLink) {
//       jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (err, decoded) {
//         if (err) {
//           return res.status(400).json({
//             error: 'Expired Link, try again'
//           })
//         }

//         RegistersignUp.findOne({ resetPasswordLink }, (err, user) => {
//           if (err || !user) {
//             return res.status(400).json({
//               error: 'Something went wrong. Try Later'
//             })
//           }

//           const updatedFields = {
//             password: newPassword,
//             resetPasswordLink: ''
//           }

//           user = _.extend(user, updatedFields)

//           user.save((err, result) => {
//             if (err) {
//               return res.status(400).json({
//                 error: 'Error reseting user password'
//               })
//             }

//             res.json({
//               message: `Great! Now you can login with new password`
//             })
//           })
//         })
//       })
//     }
//   }
// }


exports.resetController = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({
      errors: firstError
    });
  } else {
    if (resetPasswordLink) {
      jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(
        err,
        decoded
      ) {
        if (err) {
          return res.status(400).json({
            error: 'Expired link. Try again'
          });
        }

        RegistersignUp.findOne(
          {
            resetPasswordLink
          },
          (err, user) => {
            if (err || !user) {
              return res.status(400).json({
                error: 'Something went wrong. Try later'
              });
            }

            const updatedFields = {
              password: newPassword,
              resetPasswordLink: ''
            };

            user = _.extend(user, updatedFields);

            user.save((err, result) => {
              if (err) {
                return res.status(400).json({
                  error: 'Error resetting user password'
                });
              }
              res.json({
                message: `Great! Now you can login with your new password`
              });
            });
          }
        );
      });
    }
  }
};

exports.logoutController = (req, res) => {
  req.logOut()
  res.redirect('/login')
}

// /* eslint-disable no-undef */
// // const User = require('../model/registerSignUpmodel');
// const mailgun = require('mailgun-js');
// const jwt = require('jsonwebtoken');
// const RegistersignUp = require('../model/registerSignUpmodel');

// const DOMAIN = 'sandboxb7287b4c62c74643864ccb6d8de5f0c6.mailgun.org';
// // eslint-disable-next-line no-unused-vars
// const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });

// // Create User without email account verification
// // exports.registersignUp = (req, res) => {
// //   console.log(req.body);
// //   const { username, phone, firstName, lastName, password } = req.body;
// //   RegistersignUp.findOne({ username }).exec((err, user) => {
// //     if (user) {
// //       return res
// //         .status(400)
// //         .json({ error: 'User with this email already exists.' });
// //     }
// //     const newRegistersignUp = new RegistersignUp({
// //       username,
// //       phone,
// //       firstName,
// //       lastName,
// //       password,
// //     });
// //     // eslint-disable-next-line no-unused-vars
// //     newRegistersignUp.save((err, success) => {
// //       if (err) {
// //         console.log('Error in signup: ', err);
// //         // eslint-disable-next-line no-undef
// //         // eslint-disable-next-line no-sequences
// //         return res.status(400), json({ error: err });
// //       }
// //       res.json({
// //         message: 'Signup success!',
// //       });
// //     });
// //   });
// // };

// exports.registersignUp = (req, res) => {
//   console.log(req.body);
//   const { username, email, phone, firstName, lastName, password } = req.body;
//   RegistersignUp.findOne({ email }).exec((err, user) => {
//     if (user) {
//       return res
//         .status(400)
//         .json({ error: 'User with this email already exists.' });
//     }

//     const token = jwt.sign(
//       {
//         username,
//         email,
//         phone,
//         firstName,
//         lastName,
//         password,
//       },
//       process.env.JWT_ACC_ACTIVATE,
//       { expiresIn: '20m' }
//     );
//     const data = {
//       from: 'noreply@ntuma.com',
//       to: email,
//       subject: 'Account Activation Link',
//       html: `
//       <h2>Please click on given link to activate you account</h2>
//       <p>${process.env.CLIENT_URL}/authentication/activate/${token}</p>
//       `,
//     };
//     // eslint-disable-next-line no-unused-vars
//     mg.messages().send(data, function (error, body) {
//       if (error) {
//         return res.json({
//           error: err.message,
//         });
//       }
//       return res.json({
//         message: 'Email has been sent, kindly activate your account',
//       });
//     });
//   });

//   // removed because we are not creating user in database at this postiton
//   //     const newRegistersignUp = new RegistersignUp({
//   //       username,
//   //       email,
//   //       phone,
//   //       firstName,
//   //       lastName,
//   //       password,
//   //     });
//   //     // eslint-disable-next-line no-unused-vars
//   //     newRegistersignUp.save((err, success) => {
//   //       if (err) {
//   //         console.log('Error in signup: ', err);
//   //         // eslint-disable-next-line no-undef
//   //         // eslint-disable-next-line no-sequences
//   //         return res.status(400), json({ error: err });
//   //       }
//   //       res.json({
//   //         message: 'Signup success!',
//   //       });
//   //     });
//   //   });
// };

// exports.activateAccount = (req, res) => {
//   const { token } = req.body;
//   if (token) {
//     jwt.verify(token, process.env.JWT_ACC_ACTIVATE, function (
//       err,
//       // eslint-disable-next-line no-unused-vars
//       decodedToken
//     ) {
//       if (err) {
//         return res.status(400).json({ error: 'Incorrect or Expired link.' });
//       }
//       const {
//         username,
//         email,
//         phone,
//         firstName,
//         lastName,
//         password,
//       } = decodedToken;
//       RegistersignUp.findOne({ email }).exec((err, user) => {
//         if (user) {
//           return res
//             .status(400)
//             .json({ error: 'User with this email already exists.' });
//         }
//         const newRegistersignUp = new RegistersignUp({
//           username,
//           email,
//           phone,
//           firstName,
//           lastName,
//           password,
//         });
//         // eslint-disable-next-line no-unused-vars
//         newRegistersignUp.save((err, success) => {
//           if (err) {
//             console.log('Error in signup while account activation: ', err);
//             // eslint-disable-next-line no-undef
//             // eslint-disable-next-line no-sequences
//             return res.status(400), json({ error: 'Error activating account' });
//           }
//           res.json({
//             message: 'Signup success!',
//           });
//         });
//       });
//     });
//   } else {
//     return res.json({ error: 'Something went wrong!!!' });
//   }
// };
