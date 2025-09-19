import mongoose from "mongoose";

const seshSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    workouts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout",
      },
    ],
    user: {                        
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 'look in Users with this ID' to see which user created the sesh
      required: true,
    },
  },
  { timestamps: true }
);

const Sesh = mongoose.model("Sesh", seshSchema);
export default Sesh;
