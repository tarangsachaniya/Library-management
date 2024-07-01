import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';
import { authmiddleware } from '../helper/auth.js';

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Login user endpoint
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields." });
    }

    // Validate email format
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Clear sensitive data
    user.password = undefined;

    // Set token in cookie for session management
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    // Respond with user details and token
    res.status(200).json({ user, token, message: "Login successfully" });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Register user endpoint
export const registerUser = async (req, res) => {
  const { name, email, phone, password, cpassword } = req.body;

  try {
    if (!name || !email || !phone || phone.length !== 10 || !password || !cpassword || password.length < 6) {
      return res.status(400).json({ message: "Please enter all fields correctly." });
    }

    // Validate email format
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email." });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    // Respond with success message
    res.status(201).json({ message: "User registered successfully." });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get current user endpoint
export const currentUser = async (req, res) => {
  try {
    // Use authmiddleware to authenticate and retrieve current user
    console.log(req.user);
    const user = await User.findById(req.user).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};
