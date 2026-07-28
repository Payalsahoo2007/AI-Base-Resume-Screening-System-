const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning', 'danger'], default: 'info' },
  isRead: { type: Boolean, default: false },
  link: String
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
