const ProfileCard = require("../models/profile-card");
const Featured = require("../models/featured");
const Experience = require("../models/experience");
const Award = require("../models/award");
const Skill = require("../models/skill");
const About = require("../models/about");
const formatBufferTo64 = require("../middleware/data-uri");
const { cloudinaryUpload, cloudinaryDelete } = require("../middleware/cloudinary");

exports.getProfileCard = async (req, res) => {
  let id = req.params.id;

  try {
    const profileCard = await ProfileCard.find({user: id});
    res.status(200).json({profileCard: profileCard});
  } catch (err) {
    console.log(err);
    next(err);
  }
}

exports.getProfile = (req, res) => {
  return
}

exports.modifyHero = async (req, res, next) => {
  const userId = req.params.id;
  const body = req.body;

  if (!body) {
    return res.status(406).json({error: "Missing information!"});
  }

  try {
    const heroes = await ProfileCard.find({user: userId});
    const hero = heroes[0];
    hero.firstName = body.firstName;
    hero.lastName = body.lastName;
    hero.tagline = body.tagline;
    hero.city = body.city;
    hero.country = body.country;
    hero.socials = body.socials;
    await hero.save();
    res.status(200).json({profileCard: hero});
  } catch (err) {
    console.log(err);
    next(err);
  }
}

exports.modifyProfilePic = async (req, res) => {
  const userId = req.params.id;
  const body = req.file;

  if (!body) {
    return res.status(406).json({error: "Missing img file!"});
  }

  try {
    const currentPics = await ProfileCard.find({ user: userId });
    let currentPic = currentPics[0];
    if (currentPic.cloudinaryId) {
      await cloudinaryDelete(currentPic.cloudinaryId);
    }

    const file64 = formatBufferTo64(body);
    const uploadResult = await cloudinaryUpload(file64.content);

    currentPic.image = uploadResult.secure_url;
    currentPic.cloudinaryId = uploadResult.public_id;

    await currentPic.save()
    res.status(200).json({profileCard: currentPic});
  } catch (err) {
    console.log(err);
    next(err);
  }
}

exports.modifyBackgroundPic = async (req, res) => {
  let userId = req.params.id;
  const body = req.file;
  if (!body) {
    return res.status(406).json({error: "Missing img file!"});
  }

  try {
    const currentBackgroundPics = await ProfileCard.find({ user: userId });
    let currentBackgroundPic = currentBackgroundPics[0]
    if (currentBackgroundPic.backgroundCloudinaryId) {
      await cloudinaryDelete(currentBackgroundPic.backgroundCloudinaryId)
    }

    const file64 = formatBufferTo64(body);
    const uploadResult = await cloudinaryUpload(file64.content);

    currentBackgroundPic.backgroundImage = uploadResult.secure_url;
    currentBackgroundPic.backgroundCloudinaryId = uploadResult.public_id;

    await currentBackgroundPic.save();
    res.status(200).json({profileCard: currentBackgroundPic});
  } catch (err) {
    console.log(err);
    next(err);
  }
}

exports.modifyAbout = async (req, res) => {
  const userId = req.params.id;
  try {
    const about = await About.findOneAndUpdate({user: userId}, {content: req.body.content}, { new: true })
    res.status(200).json({about: about});
  } catch (err) {
    console.log(err);
    next(err);
  }
}

exports.modifyFeatured = (req, res) => {
  return
}

exports.modifyExperience = async (req, res) => {
  const experienceId = req.params.id;
  try {
    const title = req.body.title;
    const venue = req.body.venue;
    const content = req.body.content;
    const dateStart = req.body.dateStart ? req.body.dateStart : undefined;
    const dateEnd = req.body.dateEnd ? req.body.dateEnd : undefined;
    const experience = await Experience.findByIdAndUpdate(experienceId, {
      title,
      venue,
      content,
      dateStart,
      dateEnd,
    }, { new: true });
    res.status(200).json({experience: experience});
  } catch (err) {
    console.log(err);
    next(err);
  }
}

exports.modifyAward = async (req, res) => {
  const awardId = req.params.id;
  try{
    const award = await Award.findByIdAndUpdate(awardId, { content: req.body.content}, { new: true });
    res.status(200).json({award: award});
  } catch (err) {
    console.log(err);
    next(err);
  }
}

exports.modifySkill = async (req, res) => {
  const skillId = req.params.id;
  try {
    const skill = await Skill.findByIdAndUpdate(skillId, {$inc: {endorsements: 1}}, { new: true });
    res.status(200).json({skill: skill})
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


    const newFeatured = await featured.save();
    res.status(200).json({featured: newFeatured});
  } catch (err) {
    console.log(err);
    res.status(422).json({ error: err.message });
  }
}

exports.createExperience = async (req, res) => {
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

  try {
    const newExperience = await experience.save();
    res.status(200).json({experience: newExperience});
  } catch (err) {
    console.log(err);
    next(err);
  }
}


exports.createAward = async (req, res) => {
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
  try {
    const newAward = await award.save();
    res.status(200).json({award: newAward})
  } catch (err) {
    console.log(err);
    next(err);
  }
}

exports.createSkill = async (req, res) => {
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

  try {
    const newSkill = await skill.save();
    res.status(200).json({skill: newSkill});
  } catch (err) {
    console.log(err);
    next(err);
  }
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
