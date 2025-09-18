// imports  
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import seshRoutes from './routes/seshRoutes.js';
dotenv.config();
import connectDB from './utils/conn.js';

// constants
const app = express();
const PORT = process.env.PORT || 3000;

connectDB()

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/users", userRoutes);
app.use("/api/seshes", seshRoutes);

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
