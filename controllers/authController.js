const validator = require("validator");
const passport = require("passport");
const User = require("../models/user");
const About = require("../models/about");
const ProfileCard = require("../models/profile-card");

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


exports.postSignup = async (req, res, next) => {
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

  if (!req.body.firstName || !req.body.lastName) {
    validationErrors.push({ msg: "Please enter a first and last name" });
  }

  if (validationErrors.length) {
    return res.status(406).json({ msg: validationErrors });
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });

    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({msg: "Account with that email address already exists."});
    }

    await user.save()

    const userProfile = new ProfileCard({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      user: user.id,
      image: "https://res.cloudinary.com/dhptcrsjc/image/upload/v1674789718/Set-Listed/empty-profile-pic_b2hrxu.png",
      cloudinaryId: "/"
    })

    await userProfile.save()

    const userAbout = new About({
      user: user.id,
      content: ""
    })

    await userAbout.save()

    res.status(200).json({ user: user.id });
  } catch (err) {
    next(err);
  }
};

exports.checkSession = (req, res) => {
  if(req.user) {
    return res.status(200).json({user: req.user._id});
  } else {
    return res.status(401).json({user: ""});
  }
}
