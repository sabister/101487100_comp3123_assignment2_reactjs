const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/user");
const empRoutes = require("./routes/emp");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://101487100-comp3123-assignment2-reactjs-70o6og6ml.vercel.app",
      "https://101487100-comp3123-assignment2-reactjs-q2kntvujj.vercel.app", 
      /\.vercel\.app$/, 
      "https://101487100-comp3123-assignment2-reac.vercel.app" 
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
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
