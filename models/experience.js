const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExperienceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", required: true
  },
  title: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  dateStart: {
    type: Date,
    required: false,
  },
  dateEnd: {
    type: Date,
    required: false
  }
});

ExperienceSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model("Experience", ExperienceSchema);
