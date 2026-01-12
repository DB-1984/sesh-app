import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import seshRoutes from "./routes/seshRoutes.js";
import connectDB from "./utils/conn.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/seshes", seshRoutes);

const __dirname = path.resolve();
const rootDir = path.join(__dirname, "..");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(rootDir, "frontend", "dist")));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(rootDir, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
