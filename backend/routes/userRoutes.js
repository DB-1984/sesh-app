import express from "express";
import login from "../controllers/userController.js";

const router = express.Router();

// GET /api/users/
router.route("/login").post(login);

export default router;
