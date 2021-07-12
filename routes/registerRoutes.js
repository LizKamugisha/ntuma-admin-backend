const express = require('express');
const router = express.Router();
const passport = require('passport');
const Register = require('../models/Register')
const User = require('../models/User');

router.get('/register', async (req,res) => {
  try{
    const registeredAdmin = await Register.find();
// which treats our resonse as a valid json object
    res.json(registeredAdmin);
  }catch (err) {
    res.json({ message: err})
  }
});
router.get('/login', async (req,res) => {
  try{
    const loggedUsers = new User.find();
    res.json(loggedUsers);
  }catch (err) {
    res.json({ message: err});
  }
});

router.post('/register', async (req, res) => {
  console.log(req.body);
    const reg =new Register({
        // req.body allows us access data in a string or json object from the client side, it gets it
        // thru a POST or PUT request and bod object stores that info got and sends it to the express server
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        phone: req.body.phone,
        password: req.body.password,
        policy: req.body.policy
    });

  try{
        const admin = await reg.save();
        // await Register.register(admin, req.body.firstName, req.body.lastName)
        // use the method register to save the password stored in the db
        // await User.register(userDetails, req.body.password, (err) => {
        //     if (err)
        //     {
        //         throw err
        //     }
            res.json(admin);
            // res.redirect('/Login')
        // })
    }
    catch(err) {
        res.status(400).send('Sorry! Something went wrong')
        console.log(err)
    }
})


// 
//     // const userDetails = new User({
//     //     username: req.body.username
//     // })
//     try{
//         const admin = await reg.save();
//         // await Register.register(admin, req.body.firstName, req.body.lastName)
//         // use the method register to save the password stored in the db
//         // await User.register(userDetails, req.body.password, (err) => {
//         //     if (err)
//         //     {
//         //         throw err
//         //     }
//             res.json(admin);
//             // res.redirect('/Login')
//         // })
//     }
//     catch(err) {
//         res.status(400).send('Sorry! Something went wrong')
//         console.log(err)
//     }
// })

// paasport.authenticate is to check if the username n password are correct
router.post('/Login', passport.authenticate('local', {successRedirect: '/Dashboard', failureRedirect: '/Login', failureFlash: true}), (req,res) => {
     req.session.user = req.user
     res.json()
    //  res.redirect('/Dashboard')
});

module.exports = router;