const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const profileController = require("../controllers/profileController");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");

router.get("/profilecard/:id", ensureAuth, profileController.getProfileCard);
router.get("/feed/:id", ensureAuth, postController.getFeed);
router.post("/login", authController.postLogin);
router.post("/signup", authController.postSignup);
router.get("/logout", authController.logOut);
router.get("/check-session", authController.checkSession);

module.exports = router;
