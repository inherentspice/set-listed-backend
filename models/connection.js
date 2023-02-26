const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const ConnectionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", required: true
  },
  friends: {type: [Schema.Types.ObjectId], required: true, ref: "User"},
  pending: {type: [Schema.Types.ObjectId], reqruied: true, ref: "User"},
  waiting: {type: [Schema.Types.ObjectId], required: true, ref: "User"}
});

ConnectionSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});


module.exports = mongoose.model("Connection", ConnectionSchema);
