const ProfileCard = require("../models/profile-card");
const Featured = require("../models/featured");
const Experience = require("../models/experience");
const Award = require("../models/award");
const Skill = require("../models/skill");
const Post = require("../models/post");

exports.getProfileCard = (req, res) => {
  let id = req.params.id;
  ProfileCard.findById(id)
    .then(card => {
      return res.status(200).json({
        card
      });
    })
    .catch(error => {
      console.log(error);
    })
}

exports.getProfile = (req, res) => {
  return
}

exports.modifyHero = (req, res) => {
  return
}

exports.modifyProfilePic = (req, res) => {
  return
}

exports.modifyAbout = (req, res) => {
  return
}

exports.modifyFeatured = (req, res) => {
  return
}

exports.modifyExperience = (req, res) => {
  return
}

exports.modifyAward = (req, res) => {
  return
}

exports.modifySkill = (req, res) => {
  return
}

exports.createFeatured = (req, res) => {
  return
}

exports.createExperience = (req, res) => {
  return
}

exports.createAward = (req, res) => {
  return
}

exports.createSkill = (req, res) => {
  if (!req.body) {
    return res.status(400).json({error: "Invalid request body"});
  }

  const newSkillInfo = req.body;

  if (!newSkillInfo.user) {
    return res.status(400).json({error: "User field is required"});
  }

  if (!newSkillInfo.content) {
    return res.status(400).json({error: "Content field is required"});
  }

  const skill = new Skill({
    user: newSkillInfo.user,
    content: newSkillInfo.content,
    endorsements: 0
  });

  skill.save((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.status(200).json({skill: skill});
  })
}


exports.deleteFeatured = (req, res) => {
  return
}

exports.deleteExperience = (req, res) => {
  return
}

exports.deleteAward = (req, res) => {
  return
}

exports.deleteSkill = (req, res) => {
  return
}
