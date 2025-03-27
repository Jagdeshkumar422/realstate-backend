const express = require("express");
const { sendMessage } = require("../controllers/MessageController");
const { getMessages } = require("../controllers/chatController");
const router = express.Router();

router.post("/messages", sendMessage)
router.get("/messages", getMessages)

module.exports =router