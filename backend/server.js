const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const authRoutes = require("./routes/user");
const empRoutes = require("./routes/emp");

const app = express();

const uploadDir = path.join(__dirname, "uploads");
const employeeDir = path.join(uploadDir, "employees");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(employeeDir)) fs.mkdirSync(employeeDir);

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/employees", empRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => 
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
