const socketIO = require('socket.io');
const Room = require('../models/room');
const Message = require('../models/messages');
const ProfileCard = require('../models/profile-card');
const http = require('http');
const express = require('express');
const app = express();



// const rooms = await Room.find({ participants: { $in: [userId] } })
//   .populate('participants', 'username') // Populate the user fields
//   .populate({
//     path: 'messages',
//     populate: { path: 'author', select: 'username' } // Populate the author field of each message
//   });

// exports.getMessages = async (req, res) => {
//   const server = http.createServer(app);

//   try {
//     const { roomID } = req.params;
//     const io = socketIO(server);

//     io.on('connection', (socket) => {
//       console.log('Socket connected:', socket.id);

//       // Join the socket room corresponding to the room ID
//       socket.join(roomID);

//       // Send room ID to client
//       socket.emit('roomID', roomID);

//       // Handle socket events here
//       socket.on('message', async (data) => {
//         try {
//           // Save message to database
//           const message = new Message({
//             room: roomID,
//             sender: data.sender,
//             recipient: data.recipient,
//             content: data.message
//           });
//           await message.save();

//           // Broadcast message to all clients in the room except the sender
//           socket.broadcast.to(roomID).emit('message', {
//             sender: data.sender,
//             message: data.message
//           });
//         } catch (error) {
//           console.error(error);
//         }
//       });

//       socket.on('disconnect', () => {
//         console.log('Socket disconnected:', socket.id);
//       });
//     });

//     res.status(200).send('Connected to socket server');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error connecting to socket server');
//   }
// };


exports.createRoom = async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    // Check if a room already exists with the two participants
    const existingRoom = await Room.findOne({
      participants: { $all: [userId, friendId] },
    });

    if (existingRoom) {
      console.log('Found existing room:', existingRoom.id);
      res.status(200).json({room: existingRoom});
      return;
    }

    // Create a new room
    const room = new Room({
      participants: [userId, friendId],
    });

    const newRoom = await room.save();
    console.log('New room created:', newRoom.id);
    res.status(200).json({room: newRoom});
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating room');
  }
}

// exports.getRoomInfo = async (req, res) => {
//   try {
//     const room = await Room.findById(req.params.id);
//     res.status(200).json({room: room});
//   } catch (err) {
//     console.log(err);
//   }
// }

exports.getUserRooms = async (req, res) => {
  try {
    const userId = req.params.id;
    const rooms = await Room.find({ participants: { $in: [userId] }});
    const roomsWithProfileCard = [];

    for (let i = 0; i < rooms.length; i++) {
      const otherUser = rooms[i].participants.filter(user => user.toString() !== userId)[0];
      const userProfileCard = await ProfileCard.findOne({user: {$ne: userId, $eq: otherUser.toString()} }).select("firstName lastName image");
      const messages = await Message.find({ room: rooms[i].id }).sort({ createdAt: -1 }).limit(1);
      roomsWithProfileCard.push({ room: rooms[i], profileCard: userProfileCard, friendId: otherUser, messages});
    }


    res.status(200).json(roomsWithProfileCard);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching rooms');
  }
}

exports.deleteRoom = (req, res) => {
  return
}

// Handler for messaging page
// router.get('/:roomID', (req, res) => {
//   const { roomID } = req.params;
//   const io = socketIO.listen(req.app);

//   io.on('connection', (socket) => {
//     console.log('Socket connected:', socket.id);

//     // Join the socket room corresponding to the room ID
//     socket.join(roomID);

//     // Send room ID to client
//     socket.emit('roomID', roomID);

//     // Handle socket events here
//     socket.on('message', (data) => {
//       // Save message to database
//       const message = new Message({
//         room: roomID,
//         sender: data.sender,
//         recipient: data.recipient,
//         content: data.message
//       });

//       message.save((err) => {
//         if (err) console.error(err);
//       });

//       // Broadcast message to all clients in the room except the sender
//       socket.broadcast.to(roomID).emit('message', {
//         sender: data.sender,
//         message: data.message
//       });
//     });

//     socket.on('disconnect', () => {
//       console.log('Socket disconnected:', socket.id);
//     });
//   });

//   // Render the messaging page
//   res.render('messaging', { roomID });
// });




// router.delete('/:id', (req, res) => {
//   const roomId = req.params.id;

//   Room.findByIdAndDelete(roomId, (err, deletedRoom) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error deleting room');
//     } else {
//       console.log('Room deleted:', deletedRoom._id);

//       // Delete all messages associated with the room
//       Message.deleteMany({ room: deletedRoom._id }, (err) => {
//         if (err) {
//           console.error(err);
//           res.status(500).send('Error deleting messages');
//         } else {
//           console.log('Messages deleted for room:', deletedRoom._id);
//           res.status(200).send('Room deleted');
//         }
//       });
//     }
//   });
// });
