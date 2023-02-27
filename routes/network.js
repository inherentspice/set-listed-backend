const express = require('express');
const router = express.Router();
const connectionController = require("../controllers/connectionController");

router.get("/getConnections/:id", connectionController.getConnections);
router.post("/createConnection/:id", connectionController.createConnection);
router.put("/sendRequest/:id",connectionController.sendRequest);
router.put("/acceptRequest/:id", connectionController.acceptRequest);
router.put("/declineRequest/:id", connectionController.declineRequest);
router.put("/deleteFriend/:id", connectionController.deleteFriend);

module.exports = router;
