import express from "express";
import { getAllSeshes } from "../controllers/seshController.js";

const router = express.Router();

router.route("/").get(getAllSeshes);

export default router;
