const Room = require("../models/room");
const Message = require("../models/messages");
const ProfileCard = require("../models/profile-card");


exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.id })
      .sort({ createdAt: "asc" })
      .populate({
        path: "user",
        select: "-password -email",
        populate: { path: "profileCard", select: "image" }
      })
      .populate({
        path: "recipient",
        select: "-password -email",
        populate: { path: "profileCard", select: "image" }
      })
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.createRoom = async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    // Check if a room already exists with the two participants
    const existingRoom = await Room.findOne({
      participants: { $all: [userId, friendId] },
    });

    if (existingRoom) {
      console.log("Found existing room:", existingRoom.id);
      res.status(200).json({room: existingRoom});
      return;
    }

    // Create a new room
    const room = new Room({
      participants: [userId, friendId],
    });

    const newRoom = await room.save();
    console.log("New room created:", newRoom.id);
    res.status(200).json({room: newRoom});
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating room");
  }
}

exports.getUserRooms = async (req, res) => {
  try {
    const userId = req.params.id;
    const rooms = await Room.find({ participants: { $in: [userId] }});
    const roomsWithProfileCard = [];

    for (let i = 0; i < rooms.length; i++) {
      const otherUser = rooms[i].participants.filter(user => user.toString() !== userId)[0];
      const userProfileCard = await ProfileCard.findOne({user: {$ne: userId, $eq: otherUser.toString()} }).select("firstName lastName image");
      const messages = await Message.find({ room: rooms[i].id })
        .sort({ createdAt: -1 })
        .limit(1)
        .populate("user", "firstName lastName")
        .populate("recipient", "firstName lastName");
      roomsWithProfileCard.push({ room: rooms[i], profileCard: userProfileCard, friendId: otherUser, messages});
    }
    roomsWithProfileCard.sort((a, b) => b.room.modifiedAt - a.room.modifiedAt);

    res.status(200).json(roomsWithProfileCard);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching rooms");
  }
}

exports.deleteRoom = (req, res) => {
  return
}



// router.delete("/:id", (req, res) => {
//   const roomId = req.params.id;

//   Room.findByIdAndDelete(roomId, (err, deletedRoom) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send("Error deleting room");
//     } else {
//       console.log("Room deleted:", deletedRoom._id);

//       // Delete all messages associated with the room
//       Message.deleteMany({ room: deletedRoom._id }, (err) => {
//         if (err) {
//           console.error(err);
//           res.status(500).send("Error deleting messages");
//         } else {
//           console.log("Messages deleted for room:", deletedRoom._id);
//           res.status(200).send("Room deleted");
//         }
//       });
//     }
//   });
// });
