const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Room" }, // Associated room
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
