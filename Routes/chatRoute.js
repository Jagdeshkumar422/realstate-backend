// routes/chatRoutes.js
const express = require("express");
const { getChat, createChat, getMessages } = require("../controllers/chatController");
const router = express.Router();

// Get chat messages by roomId
router.get("/:roomId", getChat);
router.get("/", getChat);
// router.get('/messages', getMessages);

// Add a new message
router.post("/", createChat);

module.exports = router;
