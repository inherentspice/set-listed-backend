const validator = require("validator");
const passport = require("passport");
const User = require("../models/user");
const user = require("../models/user");

exports.postLogin = (req, res) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) {
    validationErrors.push({ msg: "Please enter a valid email address" });
  }
  if (validator.isEmpty(req.body.password)) {
    validationErrors.push({ msg: "Password cannot be blank" });
  }

  if (validationErrors.length) {
    return res.status(406).json({ msg: validationErrors });
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ msg: err.message });
    }
    if (!user) {
      return res.status(406).json({ msg: "User not found" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ msg: err.message });
      }
      res.status(200).json({ user: user.id });
    });
  })(req, res);
};

exports.logOut = (req, res) => {
  req.logout(err => {
    if (err) {
      console.log("Error: failed to logout.", err);
      return res.status(500).json({ message: "Error: failed to logout." });
    }
    req.session.destroy(err => {
      if (err) {
        console.log("Error: failed to destroy the session during logout.", err);
        return res.status(500).json({ message: "Error: failed to destroy the session during logout." });
      }
      res.status(200).json({ message: "Successfully logged out." });
    });
  });
};


exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) {
    validationErrors.push({ msg: "Please enter a valid email address." });
  }
  if (!validator.isLength(req.body.password, { min: 8 })) {
    validationErrors.push({ msg: "Password must be at least 8 characters long"});
  }
  if (req.body.password !== req.body.confirmPassword) {
    validationErrors.push({ msg: "Password don't match." });
  }

  if (validationErrors.length) {
    return res.status(406).json({ msg: validationErrors });
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        return res.status(400).json({msg: "Account with that email address already exists."});
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        res.status(200).json({ user: user.id });
    });
  });
}

exports.checkSession = (req, res) => {
  if(req.user) {
    console.log(req.user._id);
    return res.status(200).json({user: req.user._id});
  } else {
    return res.status(401).json({user: ""});
  }
}
