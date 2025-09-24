import Sesh from "../models/seshModel.js";
import Workout from "../models/workoutModel.js";

const addWorkoutToSesh = async (req, res) => {
  try {
     // aliased to the addWorkout call in view-sesh
    const { seshId } = req.params;
    const workoutData = req.body;

    // Create a new Workout document
    const newWorkout = new Workout(workoutData);
    const savedWorkout = await newWorkout.save();

    // Find the Sesh and add the workout ID
    const sesh = await Sesh.findById(seshId);
    if (!sesh) return res.status(404).json({ message: "Sesh not found" });

    sesh.workouts.push(savedWorkout._id); // push the workout ID to the workouts: array of the sesh
    await sesh.save();

    // “For the workouts array in this Sesh, replace each ObjectId with the full Workout document it refers to.”
    const updatedSesh = await Sesh.findById(seshId).populate("workouts");

    res.status(201).json(updatedSesh);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteWorkoutFromSesh = async (req, res) => {
  try {
    const { seshId } = req.params;
    // assign the _id property from the {workout} body to 'workoutId'
    const { _id: workoutId } = req.body;

    const sesh = await Sesh.findById(seshId);
    if (!sesh) return res.status(404).json({ message: "Sesh not found" });

    sesh.workouts = sesh.workouts.filter( // redfine the workouts property without the deleted ID
      (wId) => wId.toString() !== workoutId
    );
    await sesh.save();

    await Workout.findByIdAndDelete(workoutId); // delete the actual document

    // Return updated sesh with populated workouts (find the workout docs by ID and grab all data)
    const updatedSesh = await Sesh.findById(seshId).populate("workouts");
    res.status(200).json(updatedSesh);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllSeshes = async (req, res) => {
  try {
    // Use logged-in user from protect middleware
    // filter the find by passing an object assigning the user field to req.user._id
    const seshes = await Sesh.find({ user: req.user._id }).populate("workouts");
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

    export { getAllSeshes, createSesh, addWorkoutToSesh, deleteWorkoutFromSesh };

