import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "../backend/Routes/AuthRoutes/authRoutes.js";
import productRoutes from "../backend/Routes/ProductsRoutes/productsRoutes.js";

const app = express();

// --- Setup Paths ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Ensure uploads folder exists ---
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created 'uploads' folder");
}

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Static folder for uploaded images ---
app.use("/uploads", express.static(uploadDir));

// --- Enable CORS ---
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);

// --- MongoDB Connection ---
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGO_URI) // ✅ removed deprecated options
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    // Register routes only after successful DB connection
    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);

    // Start the server
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
