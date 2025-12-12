import Sesh from "../models/seshModel.js";
import Exercise from "../models/exerciseModel.js"; // was Workout

const addExerciseToSesh = async (req, res) => {
  try {
    const { seshId } = req.params;
    const exerciseData = req.body;

    // Create new Exercise document
    const newExercise = new Exercise(exerciseData);
    const savedExercise = await newExercise.save();

    // Add the Exercise ID to the Sesh
    const sesh = await Sesh.findById(seshId);
    if (!sesh) return res.status(404).json({ message: "Sesh not found" });

    sesh.exercises.push(savedExercise._id);
    await sesh.save();

    const updatedSesh = await Sesh.findById(seshId).populate("exercises");
    res.status(201).json(updatedSesh);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteExerciseFromSesh = async (req, res) => {
  try {
    const { seshId } = req.params;
    const { _id: exerciseId } = req.body;

    const sesh = await Sesh.findById(seshId);
    if (!sesh) return res.status(404).json({ message: "Sesh not found" });

    sesh.exercises = sesh.exercises.filter(
      (id) => id.toString() !== exerciseId
    );
    await sesh.save();

    await Exercise.findByIdAndDelete(exerciseId);

    const updatedSesh = await Sesh.findById(seshId).populate("exercises");
    res.status(200).json(updatedSesh);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllSeshes = async (req, res) => {
  try {
    const seshes = await Sesh.find({ user: req.user._id }).populate(
      "exercises"
    );
    res.status(200).json(seshes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createSesh = async (req, res) => {
  try {
    const { title, date, exercise } = req.body;
    const newSesh = new Sesh({
      title,
      date,
      exercise,
      user: req.user._id, // link Sesh to logged-in user -taken from .protect middleware
    });

    const savedSesh = await newSesh.save(); // save the new Sesh to the database for immediate UI update
    res.status(201).json(savedSesh);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editExerciseInSesh = async (req, res) => {
  try {
    const { seshId, exerciseId } = req.params;
    const exerciseData = req.body;

    const updatedExercise = await Exercise.findByIdAndUpdate(
      exerciseId,
      exerciseData,
      { new: true }
    );

    if (!updatedExercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    const updatedSesh = await Sesh.findById(seshId).populate("exercises");
    res.status(200).json(updatedSesh);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSeshById = async (req, res) => {
  try {
    const sesh = await Sesh.findById(req.params.id).populate("exercises");
    if (!sesh) return res.status(404).json({ message: "Sesh not found" });
    res.status(200).json(sesh);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllSeshes,
  createSesh,
  addExerciseToSesh,
  deleteExerciseFromSesh,
  getSeshById,
  editExerciseInSesh,
};
