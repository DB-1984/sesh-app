import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
     exercise: {
      type: String,
      required: true,
    },
     reps: {
      type: Number,
      required: true,
    },
     sets: {
      type: Number,
      required: true,
    },
     rest: {
      type: Number,
      required: true,
    },
     comments: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // these IDs are pushed to the Sesh workouts: array
  }
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
