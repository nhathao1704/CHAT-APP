import dovt from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/connectionDB.js";
import authrouter from "./router/auth.router.js";

dovt.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authrouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});