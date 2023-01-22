const express = require("express");
const router = express.Router();
const profile_controller = require("../controllers/profileController");

router.get('/profilecard/:id', profile_controller.profile_card);

router.post('/profilecard', (req, res) => {
  console.log(req.body)
  const profile = new profileCard({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    tagline: '',
    userProfileViews: 0,
    userPostImpressions: 0
  })
  profile.save()
    .then(savedProfile => {
      res.json(savedProfile);
    })
})

module.exports = router;
