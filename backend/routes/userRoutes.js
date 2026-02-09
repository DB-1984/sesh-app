import express from "express";
import { protect } from "../utils/protect.js";

import {
  login,
  register,
  updateUserProfile,
  getUserProfile,
  logoutUser,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/logout").post(logoutUser);
router.route("/register").post(register);
router
  .route("/profile")
  .put(protect, updateUserProfile)
  .get(protect, getUserProfile);

export default router;
