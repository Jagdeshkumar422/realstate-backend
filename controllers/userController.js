const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')
const asyncHandler = require("express-async-handler");

const SECRET_KEY = process.env.JWT_SECRET;

// Register Controller
const RegisterController = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  // Validation
  if (!name || !email || !password || !confirmPassword || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Controller
const LoginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const payload = {
      userId: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

    // Respond with token and user role
    res.status(200).json({
      token,
      role: user.role,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete User
const DelUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin users cannot be deleted" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error during deletion:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get All Users
const getAll = asyncHandler(async (req, res) => {
  const { search } = req.query; // Extract 'search' from query parameters

  try {
    // Build filter dynamically; if search exists, apply regex filter
    const filter = search
      ? { name: { $regex: search, $options: "i" } } // Case-insensitive search
      : {}; // No filter if search is not provided

    // Fetch users from the database
    const users = await userModel
      .find(filter)
      .sort({ createdAt: -1 }) // Sort by creation date (newest first)
      .select("-password"); // Exclude password field

    res.status(200).json(users); // Respond with the users
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});


const getSpecificUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userModel.findById(userId).select("-password"); // Exclude sensitive fields like password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});


const getuserById = async (req, res) => {
  try {
    const { ids } = req.body; // Array of user IDs
    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }


    // Convert the IDs to ObjectId if necessary
    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

    // Query the database
    const users = await userModel.find({ _id: { $in: objectIds } }).select("_id name");

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
};

const updateUserName = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  console.log(id)

  if (!name) {
    return res.status(400).json({ message: "Name is required." });
  }

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.name = name; // Update only the name
    await user.save();

    res.status(200).json(user); // Return the updated user
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}


module.exports = {
  RegisterController,
  LoginController,
  DelUser,
  getAll,
  getSpecificUser,
  getuserById,
  updateUserName
};
