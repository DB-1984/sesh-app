import express from "express";
import login from "../controllers/userController.js";

const router = express.Router();

// Simple test GET route
router.route("/login").get(login)
  .post((req, res) => {
    // Your login handler
    res.send("hello post");
  });

export default router;
