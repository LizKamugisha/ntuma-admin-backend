// eslint-disable-next-line no-console
console.log('Hello, Node! Node is working...');

const express = require('express');

const morgan = require('morgan');

const path = require('path');

const bodyParser = require('body-parser');

// eslint-disable-next-line no-unused-vars
const multer = require('multer');

const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
});
const passport = require('passport');

// mongoose
require('dotenv').config();
const mongoose = require('mongoose');

// const RegistersignUp = require('./model/registerSignUpmodel');
const cors = require('cors');
// const RegistersignUp = require('./model/registerSignUpmodel');
require('./model/registerSignUpmodel');
require('./model/addmarketmodel');
require('./model/addproductmodel');
require('./model/addassistantmodel');

const app = express();

const addassistantFormRoutes = require('./routes/addassistantformroutes');
const addproductFormRoutes = require('./routes/addproductformroutes');
const addmarketFormRoutes = require('./routes/addmarketformroutes');
const registerSignUpFormRoutes = require('./routes/registerSignUproutes');
const adminSignInFormRoutes = require('./routes/adminSignInroutes');

// db
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection
  .on('open', () => {
    console.log('Mongoose connection open');
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(expressSession);

// app.use(cors());
// Dev Logginf Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );
  app.use(morgan('dev'));
}

// if static images don't display specify static folders here
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/sales', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport configs
app.use(passport.initialize());
app.use(passport.session());

// Register Admin Passport configs
// passport.use(RegistersignUp.createStrategy());
// passport.serializeUser(RegistersignUp.serializeUser());
// passport.deserializeUser(RegistersignUp.deserializeUser());

// Registering use of middleware.
app.use('/api', registerSignUpFormRoutes);
app.use('/adminsignin', adminSignInFormRoutes);
app.use('/addmarket', addmarketFormRoutes);
app.use('/addproduct', addproductFormRoutes);
app.use('/addproduct/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/addassistant', addassistantFormRoutes);
app.use(
  '/addassistant/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// When a wrong path is accessed.
app.get('*', (req, res) => {
  res.send('ERROR');
});

// Listening for requests: the server!
app.listen(4000, () => {
  console.log('Express running → PORT 4000');
});
