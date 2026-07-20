import express from "express";
import router from "./routes/api.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import { globalLimiter } from "./app/middlewares/rateLimiter.js";


const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(hpp());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(globalLimiter);
app.set("trust proxy", 1);

// WEB CACHE
app.set("etag", false);

// MongoDB Connnection
mongoose
  .connect(process.env.MONGO_URI, { autoIndex: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// API Routes
app.use("/api", router);

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is missing");
}
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing");
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
