const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const profileController = require("../controllers/profileController");
const postController = require("../controllers/postController");
const upload = require("../middleware/multer");

router.get("/:id", profileController.getProfile);
router.put("/hero", profileController.modifyHero);
router.put("/profilepicture", upload.single("file"), profileController.modifyProfilePic);
router.put("/about", profileController.modifyAbout);

router.post("/featured", upload.single("file"), profileController.createFeatured);
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

module.exports = router;
