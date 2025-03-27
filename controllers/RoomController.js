const Room = require("../models/RoomModel");

const createOrGetRoom = async (req, res) => {
  const { propertyId, senderId, receiverId } = req.body;

  if (!propertyId || !senderId || !receiverId) {
    return res.status(400).json({ error: "Property ID, sender ID, and receiver ID are required" });
  }

  try {
    // Check if a room exists
    let room = await Room.findOne({ propertyId, senderId, receiverId });

    if (!room) {
      // Create a new room if not found
      room = new Room({
        roomId: `${propertyId}_${senderId}_${receiverId}`,
        propertyId,
        senderId,
        receiverId,
      });
      await room.save();
    }

    res.json({ roomId: room.roomId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports ={createOrGetRoom}