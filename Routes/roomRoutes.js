const express = require("express");
const { createOrGetRoom } = require("../controllers/RoomController");
const router = express.Router();

router.post("/rooms", createOrGetRoom)

module.exports =router