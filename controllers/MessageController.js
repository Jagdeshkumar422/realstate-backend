const mongoose = require("mongoose");
const Message = require("../models/MessageModel");

const sendMessage = async (req, res) => {
  const { roomId, senderId, message } = req.body;

  if (!roomId || !senderId || !message) {
    return res.status(400).json({ error: "roomId, senderId, and message are required" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ error: "Invalid roomId format." });
    }
    const newMessage = new Message({ roomId, senderId, message });
    await newMessage.save();

    res.json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
    const { roomId } = req.query;
  
    if (!roomId) {
      return res.status(400).json({ error: "roomId is required" });
    }
  
    try {
      const messages = await Message.find({ roomId }).sort({ createdAt: 1 }); // Sort by creation time
      res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


module.exports ={sendMessage, getMessages}