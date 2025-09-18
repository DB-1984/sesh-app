import Sesh from "../models/seshModel.js";

const getAllSeshes = async (req, res) => {
  try {
    const seshes = await Sesh.find().populate("workouts"); // populate workouts for each sesh
    res.status(200).json(seshes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
      
export { getAllSeshes };

