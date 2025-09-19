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
            return res.status(400).json({ message: 'User already exists' });
          }
      
          const user = await User.create({
            name,
            email,
            password
          });
      
          if (user) {
            generateToken(res, user._id); // assuming this sets a cookie or header
            return res.status(201).json({
              _id: user._id,
              name: user.name,
              email: user.email
            });
          } else {
            return res.status(400).json({ message: 'Invalid user data' });
          }
        } catch (error) {
          next(error); // pass errors to your error handling middleware
        }
      };
      

export { register, login };

