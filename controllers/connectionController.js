const Connection = require("../models/connection");
const User = require("../models/user");

exports.createConnection = async (req, res) => {
  try {
    const userId = req.params.id;
    const userConnection = new Connection({
      user: userId,
      friends:[],
      pending:[],
      waiting:[]
    });
    const savedConnection = await userConnection.save();
    const updated = await User.findOneAndUpdate({ id: userId }, { connection: savedConnection.id });
    res.status(200).json({message: "Connection created"});
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getConnections = async (req, res) => {
  try {
    const userId = req.params.id;
    const userConnections = await Connection.find({user: userId})
      .populate({
        path: 'pending',
        select: '-password -email',
        populate: { path: 'profileCard', select: 'image' }
      })
      .populate({
        path: 'friends',
        select: '-password -email',
        populate: { path: 'profileCard', select: 'image' }
      })
      .populate({
        path: 'waiting',
        select: '-password -email',
        populate: { path: 'profileCard', select: 'image' }
      })
      .exec();
    res.status(200).json({connection: userConnections[0]})
  } catch (err) {
    console.log(err);
    next(err);
  }
}

exports.sendRequest = async (req, res) => {
  try {
    const senderId = req.params.id;
    const reciepientId = req.body.friendId;
    const sender = await Connection.findOneAndUpdate({ user: senderId }, {$push: { pending: reciepientId }});
    const reciepient = await Connection.findOneAndUpdate({ user: reciepientId }, {$push: { waiting: senderId }});
    res.status(200).json({connection: sender});
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const reciepientId = req.params.id;
    const senderId = req.body.senderId;
    const sender = await Connection.findOneAndUpdate({ user: senderId },
                                                     {
                                                      $pull: { pending: reciepientId },
                                                      $push: { friends: reciepientId }
                                                    });
    const reciepient = await Connection.findOneAndUpdate({ user: reciepientId },
                                                         {
                                                          $pull: { waiting: senderId },
                                                          $push: { friends: senderId }
                                                        });
    res.status(200).json({connection: reciepient});
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.declineRequest = async (req, res) => {
  try {
    const reciepientId = req.params.id;
    const senderId = req.body.senderId;
    const sender = await Connection.findOneAndUpdate({ user: senderId }, {$pull: { pending: reciepientId }});
    const reciepient = await Connection.findOneAndUpdate({ user: reciepientId }, {$pull: { waiting: senderId }});
    res.status(200).json({connection: reciepient});
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.deleteFriend = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const friendId = req.body.friendId;
    const owner = await Connection.findOneAndUpdate({ user: ownerId }, {$pull: { friends: friendId }});
    const friend = await Connection.findOneAndUpdate({ user: friendId }, {$pull: { friends: ownerId }});
    res.status(200).json({message: "Friend deleted"});
  } catch (err) {
    console.log(err);
    next(err);
  }
};
