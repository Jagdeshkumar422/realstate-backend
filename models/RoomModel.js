const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true }, // Unique room ID
  propertyId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Property" },
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // User initiating chat
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, // Property owner
}, { timestamps: true });

module.exports = mongoose.model("Room", RoomSchema);
