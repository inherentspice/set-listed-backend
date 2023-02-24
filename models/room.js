const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  modifiedAt: {
    type: Date,
    default: Date.now
  }
});

RoomSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model('Room', RoomSchema);
