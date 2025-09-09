import User from "../models/userModel.js";
// not used now: import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

const login = (req, res) => {
    res.send("login response");
    }

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

