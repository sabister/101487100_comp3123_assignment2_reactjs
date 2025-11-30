const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Employee = require("../models/emp");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/employees");
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

router.get("/search", async (req, res) => {
  try {
    const { q, department, position } = req.query;

    const filter = {};

    if (q) {
      filter.$or = [
        { first_name: { $regex: q, $options: "i" } },
        { last_name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ];
    }

    if (department) {
      filter.department = { $regex: department, $options: "i" };
    }

    if (position) {
      filter.position = { $regex: position, $options: "i" };
    }

    const employees = await Employee.find(filter);
    res.json(employees);
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ message: "search failed", error: err.message });
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

    if (req.file) {
      data.photo = "/uploads/employees/" + req.file.filename;
    }

    const newEmployee = new Employee(data);
    await newEmployee.save();

    res.json(newEmployee);
  } catch (err) {
    res.status(500).json({ message: "error with creating employee", error: err.message });
  }
});

router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.photo = "/uploads/employees/" + req.file.filename;
    }

    const updated = await Employee.findByIdAndUpdate(req.params.id, data, { new: true });

    if (!updated) return res.status(404).json({ message: "employee not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "error with updating employee", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Employee not found" });

    res.json({ message: "employee is now deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "error with deleting employee", error: err.message });
  }
});

module.exports = router;
