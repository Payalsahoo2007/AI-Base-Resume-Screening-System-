const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: String,
  role: String,
  action: { type: String, required: true },
  details: String,
  ipAddress: String,
  status: { type: String, enum: ['SUCCESS', 'FAILED', 'WARNING'], default: 'SUCCESS' }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
