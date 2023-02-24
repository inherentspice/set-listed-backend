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
    require: true,
    default: "https://res.cloudinary.com/dhptcrsjc/image/upload/v1674789718/Set-Listed/empty-profile-pic_b2hrxu.png"
  },
  cloudinaryId: {
    type: String,
    require: true
  },
  backgroundImage: {
    type: String,
    require: false,
    default: "https://res.cloudinary.com/dhptcrsjc/image/upload/v1675955714/Set-Listed/default-background_wyziyb.png"
  },
  backgroundCloudinaryId: {
    type: String,
    require: false
  },
  tagline: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: false
  },
  socials: {
    type: Array,
    required: false,
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
