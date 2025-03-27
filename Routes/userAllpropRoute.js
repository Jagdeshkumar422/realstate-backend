const express = require('express');
const router = express.Router();
const { getUserProperties } = require('../controllers/alluserPropCont'); // Import controller

// Route to fetch all properties created by the logged-in user
router.get('/user-properties', getUserProperties);

module.exports = router;
