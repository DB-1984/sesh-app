// backend/routes/userRoutes.js
import express from "express";

const router = express.Router();

// GET /api/users/
router.get("/", (req, res) => {
  res.send("User route working!");
});

router.get("/test", (req, res) => {
  res.json({ message: "Test route working" });
});

export default router;
