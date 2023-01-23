const ProfileCard = require("../models/profile-card");

exports.profileCard = (req, res) => {
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
