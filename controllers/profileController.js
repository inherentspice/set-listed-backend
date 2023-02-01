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

exports.modifyBackgroundPic = (req, res) => {
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

exports.modifySkill = async (req, res) => {
  const skillId = req.params.id;
  try {
    const skill = await Skill.findByIdAndUpdate(skillId, {$inc: {endorsements: 1}});
    return res.status(200).json({skill: skill})
  } catch (err) {
    console.log(err)
    return next(err)
  }
}

exports.createFeatured = async (req, res) => {
  try {
    const body = req.file;
    if (!body) {
      return res.status(406).json({error: "Missing img file!"});
    }

    if (!body.req.title) {
      return res.status(406).json({error: "Missing title!"});
    }

    if (!body.req.content) {
      return res.status(406).json({error: "Missing congtent!"});
    }

    const file64 = formatBufferTo64(body);
    const uploadResult = await cloudinaryUpload(file64.content);

    const featured = new Featured({
      title: req.body.title,
      imageURL: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      content: req.body.content,
      user: req.body.user
    })

    featured.save((err) => {
      if (err) {
        console.log(err)
        return res.status(500).json({error: "Something went wrong with saving the new featured post"});
      }
      return res.status(200).json({featured: featured});
    })
  } catch (err) {
    console.log(err);
    res.status(422).json({ error: err.message });
  }
}

exports.createExperience = (req, res) => {
  if (!req.body) {
    return res.status(400).json({error: "Invalid request body"});
  }
  const newExperienceInfo = req.body;

  if (!newExperienceInfo.user) {
    return res.status(400).json({error: "User field is required"});
  }

  if (!newExperienceInfo.title) {
    return res.status(400).json({error: "Title field is required"});
  }

  if (!newExperienceInfo.venue) {
    return res.status(400).json({error: "Venue field is required"});
  }

  if (!newExperienceInfo.content) {
    return res.status(400).json({error: "Content field is required"});
  }

  const experience = new Experience({
    user: newExperienceInfo.user,
    title: newExperienceInfo.title,
    venue: newExperienceInfo.venue,
    content: newExperienceInfo.content,
    dateStart: newExperienceInfo.dateStart ? newExperienceInfo.dateStart : undefined,
    dateEnd: newExperienceInfo.dateEnd ? newExperienceInfo.dateEnd : undefined
  });

  experience.save((err) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.status(200).json({experience: experience});
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
