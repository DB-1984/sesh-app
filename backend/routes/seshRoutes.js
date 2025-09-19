import express from "express";
import { protect } from "../utils/protect.js";
import { getAllSeshes, createSesh } from "../controllers/seshController.js";

const router = express.Router();

router.route("/").get(protect, getAllSeshes).post(protect, createSesh);

export default router;
