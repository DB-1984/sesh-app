import express from "express";
import { protect } from "../utils/protect.js";
import { getAllSeshes, createSesh, addWorkoutToSesh, deleteWorkoutFromSesh, editWorkoutInSesh, getSeshById } from "../controllers/seshController.js";

const router = express.Router();

router.route("/").get(protect, getAllSeshes).post(protect, createSesh);
router.route("/:id").get(protect, getSeshById);
router.route("/:seshId/workouts").post(protect, addWorkoutToSesh).delete(protect, deleteWorkoutFromSesh)
router.route("/:seshId/workouts/:workoutId").put(protect, editWorkoutInSesh);

export default router;

