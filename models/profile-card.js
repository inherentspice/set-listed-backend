const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const profileCardSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  tagline: { type: String, required: false },
  userProfileViews: { type: Number, required: false },
  userPostImpressions: { type: Number, required: false }
});

profileCardSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model("ProfileCard", profileCardSchema);
