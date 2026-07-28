let mockAuditLogs = [
  { id: 1, user: 'admin@antigravity.ai', role: 'Super Admin', action: 'ROLE_UPDATE', details: 'Promoted Marcus Sterling to Lead Recruiter', ipAddress: '192.168.1.45', timestamp: new Date().toISOString() },
  { id: 2, user: 'hr@antigravity.ai', role: 'HR Manager', action: 'JOB_CREATED', details: 'Created Job Description: Senior AI Engineer', ipAddress: '192.168.1.88', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, user: 'recruiter@antigravity.ai', role: 'Recruiter', action: 'BULK_PARSING', details: 'Batch processed 15 resume files', ipAddress: '192.168.1.102', timestamp: new Date(Date.now() - 7200000).toISOString() }
];

exports.getAuditLogs = async (req, res) => {
  res.json({ success: true, count: mockAuditLogs.length, logs: mockAuditLogs });
};

exports.getUsers = async (req, res) => {
  res.json({
    success: true,
    users: [
      { id: '1', name: 'Commander Super Admin', email: 'admin@antigravity.ai', role: 'Super Admin', status: 'Active' },
      { id: '2', name: 'Elena Vance', email: 'hr@antigravity.ai', role: 'HR Manager', status: 'Active' },
      { id: '3', name: 'Marcus Sterling', email: 'recruiter@antigravity.ai', role: 'Recruiter', status: 'Active' },
      { id: '4', name: 'Dr. Evelyn Reed', email: 'interviewer@antigravity.ai', role: 'Interviewer', status: 'Active' },
      { id: '5', name: 'Alex Rivera', email: 'candidate@antigravity.ai', role: 'Candidate', status: 'Active' }
    ]
  });
};

exports.updateUserRole = async (req, res) => {
  const { userId, role } = req.body;
  mockAuditLogs.unshift({
    id: Date.now(),
    user: req.user ? req.user.email : 'admin@antigravity.ai',
    role: req.user ? req.user.role : 'Super Admin',
    action: 'USER_ROLE_UPDATED',
    details: `Updated user ${userId} role to '${role}'`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, message: `User role updated to '${role}'.` });
};

exports.triggerBackup = async (req, res) => {
  res.json({
    success: true,
    message: 'Full encrypted system backup generated successfully.',
    backupFile: `anti-gravity-backup-${Date.now()}.json`
  });
};

exports.restoreBackup = async (req, res) => {
  res.json({
    success: true,
    message: 'System database restored successfully from snapshot.'
  });
};
