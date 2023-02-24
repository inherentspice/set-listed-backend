const express = require('express');
const router = express.Router();
const messageController = require("../controllers/msgRoomController");

// router.get("/:id", messageController.getMessages);
router.post("/room", messageController.createRoom);
// router.get("/room/:id", messageController.getRoomInfo);
router.get("/room/all/:id", messageController.getUserRooms);
router.delete("/room/:id", messageController.deleteRoom);

module.exports = router;
