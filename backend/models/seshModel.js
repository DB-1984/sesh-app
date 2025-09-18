import mongoose from "mongoose";

const seshSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date, // use Date type for proper sorting/filtering
      required: true,
    },
    workouts: [ // workouts pushed to a sesh are stored by their timestamp IDs
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout", // reference to Workout model
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Sesh = mongoose.model("Sesh", seshSchema);

export default Sesh;
