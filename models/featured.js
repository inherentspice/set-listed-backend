const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FeaturedSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", required: true
  },
  image: {
    type: String,
    require: false
  },
  cloudinaryId: {
    type: String,
    require: false
  },
  title: {
     type: String,
     required: true
  },
  content: {
    type: String,
    required: true
  }
});

FeaturedSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model("Featured", FeaturedSchema);
