const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const logger = require("morgan");
const connectDB = require("./config/database");
const http = require("http");
const socketIO = require("socket.io");
const Message = require("./models/messages");
const Room = require("./models/room");
const path = require('path');


const indexRouter = require("./routes/index");
const gigsRouter = require("./routes/gigs");
const messagingRouter = require("./routes/messaging");
const networkRouter = require("./routes/network");
const notificationsRouter = require("./routes/notifications");
const profileRouter = require("./routes/profile");

// Passport config
require("./config/passport")(passport);

// Connect to database
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));


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

app.use(express.static(path.join(__dirname, 'build')));

app.use("/", indexRouter);
// app.use("/gigs", gigsRouter);
app.use("/messaging", messagingRouter);
app.use("/network", networkRouter);
// app.use("/notifications", notificationsRouter);
app.use("/profile", profileRouter);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Handle socket events here
  socket.on("message", async (data) => {
    try {
      // Save message to database
      const message = new Message({
        room: data.roomId,
        user: data.sender,
        recipient: data.recipient,
        content: data.content
      });


      const recievedMessage = await message.save()
      const newMessage = await Message.findById(recievedMessage.id)
        .populate("user", "firstName lastName")
        .populate("recipient", "firstName lastName")

      const room = await Room.findById(data.roomId);
      room.modifiedAt = Date.now();
      await room.save();

      // Broadcast message to all clients in the room except the sender
      socket.broadcast.to(data.roomID).emit("message", {newMessage});
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log("Server running on port 8080");
});
