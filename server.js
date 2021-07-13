const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const path = require("path");
// routes
const marketRoute = require("./routes/marketRoute");
const productRoute = require("./routes/productRoute");
// const registerRoutes = require("./routes/registerRoutes");
const registerSignUpFormRoutes = require("./routes/registerSignUproutes");
const assistantRoute = require("./routes/assistantRoute");
const categoryRoute = require("./routes/categoryRoute");
// dotenv
require("dotenv").config();
const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose");
const expressSession = require("express-session")({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
});

const passport = require("passport");
const Users = require("./models/User");
const app = express();

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.connection
  .on("open", () => {
    console.log("Mongoose connection is successful");
  })
  .on("error", (err) => {
    console.log(`Connection error: ${err.message}`);
  });

// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

// Dev Logginf Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );
  app.use(morgan('dev'));
}

app.use(passport.initialize());
app.use(passport.session());
// passport authentication
passport.use(Users.createStrategy());
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

// Registering use of middleware.
app.use('/api', registerSignUpFormRoutes);

app.use("/", marketRoute);
app.use("/", productRoute);
app.use("/", registerRoutes);
app.use("/", assistantRoute);
app.use("/", categoryRoute);

//Setting up the path for our static files.
app.use(express.static(path.join(__dirname, "public")));

app.listen(1200, () => {
  console.log("http://localhost:1200");
});
