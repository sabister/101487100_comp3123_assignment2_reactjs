const mongoose = require("mongoose");

const empSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  position:   { type: String, required: true },
  salary:     { type: Number, required: true },
  date_of_joining: { type: Date, required: true },
  department: { type: String, required: true },
  photo: { type: String }, 
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Employee", empSchema);
