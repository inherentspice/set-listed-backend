const express = require("express");
const router = express.Router();

const profileCard = require("../models/profile-card")

router.get('/profilecard/:id', (req, res) => {
  let id = req.params.id;
  profileCard.findById(id)
    .then(card => {
      return res.status(200).json({
        card
      });
    })
    .catch(error => {
      console.log(error);
    })
})

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
