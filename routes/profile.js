  const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const profileController = require("../controllers/profileController");
const postController = require("../controllers/postController");
const singleUploadCtrl = require("../middleware/multer");

router.get("/:id", profileController.getProfile);
router.get("/profilecard/:id", profileController.getProfileCard);
router.put("/hero/:id", profileController.modifyHero);
router.put("/profilepicture/:id", singleUploadCtrl, profileController.modifyProfilePic);
router.put("/backgroundpicture/:id", singleUploadCtrl, profileController.modifyBackgroundPic);
router.put("/about/:id", profileController.modifyAbout);

router.post("/featured", singleUploadCtrl, profileController.createFeatured);
router.put("/featured/image/:id", singleUploadCtrl, profileController.modifyFeaturedImage);
router.put("/featured/:id", profileController.modifyFeatured);
router.delete("/featured/:id", profileController.deleteFeatured);

router.post("/experience", profileController.createExperience);
router.put("/experience/:id", profileController.modifyExperience);
router.delete("/experience/:id", profileController.deleteExperience);

router.post("/award", profileController.createAward);
router.put("/award/:id", profileController.modifyAward);
router.delete("/award/:id", profileController.deleteAward);

router.post("/skill", profileController.createSkill);
router.put("/skill/:id", profileController.modifySkill);
router.delete("/skill/:id", profileController.deleteSkill);

router.post("/post", postController.createPost);
router.put("/post/:id", postController.modifyPost);
router.delete("/post/:id", postController.deletePost);
router.put("/post/likes/:id", postController.modifyPostLikes);


module.exports = router;
