const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware - FIX: Move CORS with configuration to the top
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const medicineRoutes = require("./routes/medicineRoutes");
const saleRoutes = require("./routes/saleRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const userRoutes = require("./routes/userRoutes");

// Use Routes
app.use("/api/medicines", medicineRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/users", userRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Pharmaceutical Management System API" });
});

// Simple 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});