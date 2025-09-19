import Sesh from "../models/seshModel.js";
import Workout from "../models/workoutModel.js";

const getAllSeshes = async (req, res) => {
  try {
    // mongoose expects a filter object; if userId is provided in query, filter by it
    const filter = req.query.userId ? { user: req.query.userId } : {};
    const seshes = await Sesh.find(filter).populate("workouts");
    res.status(200).json(seshes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSesh = async (req, res) => {
  try {
    const { title, date, workouts } = req.body;
    const newSesh = new Sesh({
      title,
      date,
      workouts,
      user: req.user._id,  // link Sesh to logged-in user -taken from .protect middleware
    });

    const savedSesh = await newSesh.save(); // save the new Sesh to the database for immediate UI update
    res.status(201).json(savedSesh);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getSeshById = async (req, res) => {
  try {
    const sesh = await Sesh.findById(req.params.id).populate("workouts"); // populate workouts  for the sesh
    if (!sesh) {
      return res.status(404).json({ message: "Sesh not found" });
    }
    res.status(200).json(sesh);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

    export { getAllSeshes, createSesh };

