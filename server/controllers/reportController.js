const exportService = require('../services/exportService');
const { mockCandidates } = require('./resumeController');

exports.exportCandidateCsv = async (req, res) => {
  const data = mockCandidates.map(c => ({
    ID: c._id,
    Name: c.fullName,
    Email: c.email,
    Phone: c.phone,
    ExperienceYears: c.totalExperienceYears,
    ATSScore: c.overallAtsScore,
    Status: c.status,
    HardSkills: (c.skills?.hard || []).join('; ')
  }));

  const csvContent = exportService.exportToCsv(data);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=candidate_report.csv');
  res.status(200).send(csvContent);
};

exports.exportCandidateJson = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=candidate_report.json');
  res.status(200).send(exportService.exportToJson(mockCandidates));
};

exports.exportPdfReport = async (req, res) => {
  const htmlContent = exportService.generateHtmlReport('Anti-Gravity Candidate Screening Report', mockCandidates);
  res.setHeader('Content-Type', 'text/html');
  res.send(htmlContent);
};
