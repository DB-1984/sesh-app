import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    weight: {
      type: Number, // Storing as a number makes math (like BMI/Wilks) easier
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    goal: {
      type: String,
      enum: ["Strength", "Hypertrophy", "Endurance", "General"], // Restricts input to these choices
      default: "General",
    },
    targets: {
      type: String,
      maxLength: 250,
    },
    unitPreference: {
      weight: {
        type: Number,
        default: 0, // kg
      },
      height: {
        type: Number,
        default: 0, // cm
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Ensure virtuals show up in API responses
    toObject: { virtuals: true },
  }
);

// Virtual field in Mongoose - calcualted at runtime, like you might have for a static method
userSchema.virtual("bmi").get(function () {
  if (!this.weight || !this.height) return 0;

  // BMI Formula: weight (kg) / [height (m)]²
  const heightInMeters = this.height / 100;
  const bmi = this.weight / (heightInMeters * heightInMeters);

  return parseFloat(bmi.toFixed(1)); // Return to 1 decimal place (e.g., 24.5)
});

// Login match
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
