const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProfileCardSchema = new Schema({
  firstName: {
    type: String,
    required: true
   },
  lastName: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  image: {
    type: String,
    require: true
  },
  cloudinaryId: {
    type: String,
    require: true
  },
  tagline: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  userProfileViews: {
    type: Number,
    required: false,
    default: 0
  },
  userPostImpressions: {
    type: Number,
    required: false,
    default: 0
  }
});

ProfileCardSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model("ProfileCard", ProfileCardSchema);
