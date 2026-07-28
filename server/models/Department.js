const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  head: String,
  budget: String,
  activeJobsCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Department', departmentSchema);
