const Chat = require("../models/chatModel")

const getChat =async (req, res) => {
    try {
      const messages = await Chat.find();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

const createChat = async (req, res) => {
    const { roomId, senderId, receiverId, message } = req.body;
  
    try {
      const newMessage = new Chat({ roomId, senderId, receiverId, message });
      await newMessage.save();
      res.json(newMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const getMessages = async (req, res) => {
    const { roomId } = req.query;
    
    if (!roomId) {
      return res.status(400).json({ error: 'roomId is required' });
    }
    
    try {
      const roomMessages = await Chat.find({ roomId }); // Adjust to your database query
      if (!roomMessages) {
        return res.status(404).json({ error: 'Room not found' });
      }
      res.json(roomMessages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  module.exports = {getChat, createChat, getMessages}