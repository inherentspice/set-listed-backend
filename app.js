const express = require("express");
require('dotenv').config();
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const logger = require("morgan");
const connectDB = require("./config/database");


const indexRouter = require("./routes/index");
const gigsRouter = require("./routes/gigs");
const messagingRouter = require("./routes/messaging");
const networkRouter = require("./routes/messaging");
const notificationsRouter = require("./routes/notifications");
const profileRouter = require("./routes/profile");

// Passport config
require("./config/passport")(passport);

// Connect to database
connectDB();

const app = express();

app.use(cors());

// Body Parsing
app.use(express.json());

// Logging
app.use(logger("dev"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ url: process.env.URL })
  })
);


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
// app.use('/gigs', gigsRouter);
// app.use('/messaging', messagingRouter);
// app.use('/network', networkRouter);
// app.use('/notifications', notificationsRouter);
app.use('/profile', profileRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app;
