const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SkillSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", required: true
  },
  content: {
    type: String,
    required: true
  },
  endorsements: {
    type: Number,
    required: false
  },

});

SkillSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model("Skill", SkillSchema);
