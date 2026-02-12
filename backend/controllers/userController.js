import User from "../models/userModel.js";
import crypto from "crypto";
import { Resend } from "resend";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Look for a user with matching email
    const user = await User.findOne({ email }).select("+password");
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

    if (req.body.password && req.body.password.length < 8) {
      res.status(400);
      throw new Error("Password must be at least 8 characters");
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

const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // Sets expiration to 1970 (instant deletion)
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const wasNew = user.isNewUser;

    // If they were new, flip it to false in the background
    if (wasNew) {
      user.isNewUser = false;
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isNewUser: wasNew, // Send the "Old" value so the frontend knows to toast
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // 1. Update basic info
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // 2. Update fitness stats
    if (req.body.weight !== undefined) user.weight = req.body.weight;
    if (req.body.height !== undefined) user.height = req.body.height;
    if (req.body.goal !== undefined) user.goal = req.body.goal;
    if (req.body.targets !== undefined) user.targets = req.body.targets;

    // 3. Flip the isNewUser flag
    // Once they update their profile, they aren't "new" anymore!
    user.isNewUser = false;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      weight: updatedUser.weight,
      height: updatedUser.height,
      targets: updatedUser.targets,
      bmi: updatedUser.bmi,
      goal: updatedUser.goal,
      isNewUser: updatedUser.isNewUser,
    });
  } else {
    // Instead of res.status().json(), we just set status and THROW
    // The asyncHandler catches this and passes it to the errorHandler middleware
    res.status(404);
    throw new Error("User not found");
  }
});

const forgotPassword = async (req, res) => {
  console.log("forgotPassword hit:", req.body.email);
  console.log("RESEND key present?", !!process.env.RESEND_API_KEY);

  // Always keep response generic (avoid email enumeration)
  const genericResponse = {
    message: "If that email exists, we’ve sent a password reset link.",
  };

  try {
    const { email } = req.body;

    if (!email) return res.status(200).json(genericResponse);

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(200).json(genericResponse);

    // Create token + hash
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Sesh <onboarding@resend.dev>",
      to: user.email,
      subject: "Reset your Sesh password",
      html: `
        <p>Hi${user.name ? ` ${user.name}` : ""},</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetUrl}">Reset your password</a></p>
        <p>This link expires in 1 hour. If you didn’t request this, ignore this email.</p>
      `,
    });

    return res.status(200).json(genericResponse);
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(200).json(genericResponse);
  }
};

export {
  register,
  login,
  updateUserProfile,
  getUserProfile,
  forgotPassword,
  logoutUser,
};
