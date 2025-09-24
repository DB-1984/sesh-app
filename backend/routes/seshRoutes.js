import express from "express";
import { protect } from "../utils/protect.js";
import { getAllSeshes, createSesh, addWorkoutToSesh, deleteWorkoutFromSesh } from "../controllers/seshController.js";

const router = express.Router();

router.route("/").get(protect, getAllSeshes).post(protect, createSesh);
router.route("/:seshId/workouts").post(protect, addWorkoutToSesh).delete(protect, deleteWorkoutFromSesh)

export default router;

