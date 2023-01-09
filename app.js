const express = require("express");
require('dotenv').config();
const cors = require("cors");

const indexRouter = require("./routes/index");
const gigsRouter = require("./routes/gigs");
const messagingRouter = require("./routes/messaging");
const networkRouter = require("./routes/messaging");
const notificationsRouter = require("./routes/notifications");
const profileRouter = require("./routes/profile");

const app = express();
const mongoose = require("mongoose");
// const mongoDB = process.env.URL;
// mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;

app.use(cors());
app.use(express.json());

app.use('/', indexRouter);
// app.use('/gigs', gigsRouter);
// app.use('/messaging', messagingRouter);
// app.use('/network', networkRouter);
// app.use('/notifications', notificationsRouter);
// app.use('/profile', profileRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app;
