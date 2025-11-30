const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Employee = require("../models/emp");

const uploadPath = path.join(__dirname, "../uploads/employees");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "error getting employees", error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "employee not found" });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: "error getting employee", error: err.message });
  }
});


router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const data = req.body;

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    if (req.file) {
      data.photo = `${baseUrl}/uploads/employees/${req.file.filename}`;
    }

    const newEmployee = new Employee(data);
    await newEmployee.save();

    res.json(newEmployee);
  } catch (err) {
    res.status(500).json({ message: "error creating employee", error: err.message });
  }
});

router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const data = req.body;
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    if (req.file) {
      data.photo = `${baseUrl}/uploads/employees/${req.file.filename}`;
    }

    const updated = await Employee.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ message: "employee not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "error updating employee", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Employee not found" });

    res.json({ message: "employee deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "error deleting employee", error: err.message });
  }
});

module.exports = router;
