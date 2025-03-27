const Buy = require('../models/buyModel');  // Import Buy model
const Rent = require('../models/rentModel'); // Import Rent model
const jwt = require('jsonwebtoken');  // Import jsonwebtoken for token verification

// Middleware to extract userId from token
const getUserIdFromToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded?.userId;
};

// Controller to fetch properties created by the logged-in user
const getUserProperties = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from headers

  if (!token) {
    return res.status(400).json({ message: 'Authorization token is required' });
  }

  const userId = getUserIdFromToken(token); // Extract userId from token

  if (!userId) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  try {
    // Fetch properties from both Buy and Rent models created by the user
    const buyProperties = await Buy.find({ user: userId }); // Query Buy properties
    const rentProperties = await Rent.find({ user: userId }); // Query Rent properties

    // Combine results
    const properties = {
      buy: buyProperties,
      rent: rentProperties
    };

    res.status(200).json(properties); // Send the combined properties as response
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserProperties };
