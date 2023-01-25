const ProfileCard = require("../models/profile-card");
const Featured = require("../models/featured");
const Experience = require("../models/experience");
const Award = require("../models/award");
const Skill = require("../models/skill");
const Post = require("../models/post");

exports.getAward = (req, res) => {
  let id = req.params.id;
  Award.findById(id)
    .then(card => {
      return res.status(200).json({
        card
      });
    })
    .catch(error => {
      console.log(error);
    })
}

exports.createAward = (req, res) => {
  if (!req.body) {
    return res.status(400).json({error: "Invalid request body"});
  }

  const newAwardInfo = req.body;

  if (!newAwardInfo.user) {
    return res.status(400).json({error: "User field is required"});
  }

  if (!newAwardInfo.content) {
    return res.status(400).json({error: "Content field is required"});
  }

  const award = new Award({
    user: newAwardInfo.user,
    content: newAwardInfo.content
  });

  award.save((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.status(200).json({award: award});
  })
}
