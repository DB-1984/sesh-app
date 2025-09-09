// imports  
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
dotenv.config();
import connectDB from './utils/conn.js';
import cors from "cors";

// constants
const app = express();
const PORT = process.env.PORT || 3000;

connectDB()

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow all origins (dev only)
app.use(cors());

// routes
app.use("/api/users", userRoutes);

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
