const express = require('express');
const router = express.Router();
const connectionController = require("../controllers/connectionController");

router.post("/createConnection/:id", connectionController.createConnection);
router.post("/sendRequest/:id",connectionController.sendRequest);
router.post("/acceptRequest/:id", connectionController.acceptRequest);
router.post("/declineRequest/:id", connectionController.declineRequest);
router.delete("/deleteFriend/:id", connectionController.deleteFriend);

module.exports = router;
