const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const profileController = require("../controllers/profileController");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");

// router.get("/profilecard/:id", ensureAuth, profileController.profile_card);
// router.get("/feed", ensureAuth, postController.getFeed);
router.post("/login", authController.postLogin);
router.post("/signup", authController.postSignup);
router.get("/logout", authController.logOut);
router.get("/check-session", authController.checkSession);

router.post("/profilecard", (req, res) => {
  console.log(req.body)
  const profile = new profileCard({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    tagline: "",
    userProfileViews: 0,
    userPostImpressions: 0
  })
  profile.save()
    .then(savedProfile => {
      res.json(savedProfile);
    })
})

module.exports = router;
