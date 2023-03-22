const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true},
  firstName: { type: String, required: true},
  lastName: {type: String, required: true},
  connection: {type: Schema.Types.ObjectId, required: false, ref: "Connection"},
  profileCard: {type: Schema.Types.ObjectId, required: false, ref: "ProfileCard"}
});

// Password hash middleware

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helped method for validating user's password

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    if (returnedObject._id) {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
    } else {
      console.warn("Warning: returnedObject._id is undefined");
    }
    delete returnedObject.__v;
  }
});


module.exports = mongoose.model("User", UserSchema);
