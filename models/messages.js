const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  content: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

MessageSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model('Message', MessageSchema);
