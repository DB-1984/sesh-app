// imports
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import seshRoutes from "./routes/seshRoutes.js";
import connectDB from "./utils/conn.js";

dotenv.config(); // load .env first

// constants
const app = express();
const PORT = process.env.PORT || 5000;

// connect to MongoDB
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // parse cookies

// routes
app.use("/api/users", userRoutes);
app.use("/api/seshes", seshRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
