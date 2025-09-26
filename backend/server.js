import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

import propertyRoutes from "./routes/propertyRoutes.js";
import tenancyApplicationRoutes from "./routes/applicationsRoute.js";
import contractPaymentRoutes from "./routes/contractPaymentRoutes.js";
import cookieParser from "cookie-parser";


// Load .env from project root
dotenv.config(); // now it automatically picks up .env in root

// Connect MongoDB
connectDB();

const app = express();

// Parse JSON
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: "http://localhost:3000", // frontend origin
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/tenancy-applications", tenancyApplicationRoutes);


app.use("/api/contract-payments", contractPaymentRoutes);


// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
