import User from "../models/userModel.js";
// not used now: import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Look for a user with matching email
    const user = await User.findOne({ email });

    // Verify password using model method
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id); // writes JWT cookie/header

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      generateToken(res, user._id); // assuming this sets a cookie or header
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    next(error); // pass errors to your error handling middleware
  }
};

const getUserProfile = async (req, res) => {
  try {
    // req.user._id comes from your 'protect' middleware
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        weight: user.weight,
        height: user.height,
        bmi: user.bmi,
        goal: user.goal,
        bio: user.bio || "",
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// userController.js
const updateUserProfile = async (req, res) => {
  try {
    // 1. Find the user using the ID attached by your 'protect' middleware
    const user = await User.findById(req.user._id);

    if (user) {
      // 2. Update core fields (fallback to existing values if not provided)
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // 3. Update fitness stats
      if (req.body.weight) user.weight = req.body.weight;
      if (req.body.height) user.height = req.body.height;
      if (req.body.goal) user.goal = req.body.goal;

      // 4. Save the changes (this also triggers the 'bmi' virtual calculation)
      const updatedUser = await user.save();

      // 5. Send back the fresh data (including BMI)
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        weight: updatedUser.weight,
        height: updatedUser.height,
        bmi: updatedUser.bmi, // The virtual we added to the model
        goal: updatedUser.goal,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // 6. If the database fails or something explodes, catch it here
    console.error("Update Error:", error);
    res.status(500).json({
      message: "Server error updating profile",
      error: error.message,
    });
  }
};

export { register, login, updateUserProfile, getUserProfile };
