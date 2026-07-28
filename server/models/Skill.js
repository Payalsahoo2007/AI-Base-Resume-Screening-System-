const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, enum: ['Hard', 'Soft', 'Language', 'Tool', 'Framework'], default: 'Hard' },
  aliases: [String]
});

module.exports = mongoose.model('Skill', skillSchema);
