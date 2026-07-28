let mockInterviews = [
  {
    _id: 'int-1',
    candidateName: 'Alex Rivera',
    jobTitle: 'Senior AI / Full Stack Engineer',
    interviewerName: 'Dr. Evelyn Reed',
    scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    durationMinutes: 45,
    locationType: 'Google Meet',
    meetingUrl: 'https://meet.google.com/anti-gravity-ats',
    status: 'Scheduled',
    ratings: { technical: 5, communication: 4, cultureFit: 5, overall: 5 },
    feedbackNotes: 'Outstanding technical depth in node microservices and system architecture.',
    decision: 'Strong Hire'
  },
  {
    _id: 'int-2',
    candidateName: 'Sophia Lin',
    jobTitle: 'AI Research Engineer',
    interviewerName: 'Marcus Sterling',
    scheduledAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    durationMinutes: 60,
    locationType: 'Zoom',
    meetingUrl: 'https://zoom.us/j/9988776655',
    status: 'Scheduled',
    ratings: { technical: 4, communication: 5, cultureFit: 4, overall: 4 },
    feedbackNotes: 'Strong analytical skills. Demonstrated clear experience with document parsing.',
    decision: 'Hire'
  }
];

exports.getInterviews = async (req, res) => {
  res.json({ success: true, count: mockInterviews.length, interviews: mockInterviews });
};

exports.scheduleInterview = async (req, res) => {
  const newInterview = {
    _id: 'int-' + Date.now(),
    candidateName: req.body.candidateName || 'Applicant',
    jobTitle: req.body.jobTitle || 'Engineer',
    interviewerName: req.body.interviewerName || 'Recruiter Lead',
    scheduledAt: req.body.scheduledAt || new Date().toISOString(),
    durationMinutes: req.body.durationMinutes || 45,
    locationType: req.body.locationType || 'Google Meet',
    meetingUrl: req.body.meetingUrl || 'https://meet.google.com/abc-defg-hij',
    status: 'Scheduled',
    decision: 'Pending'
  };

  mockInterviews.unshift(newInterview);

  res.status(201).json({
    success: true,
    message: 'Interview scheduled successfully. Email notifications dispatched.',
    interview: newInterview
  });
};

exports.updateFeedback = async (req, res) => {
  const { id } = req.params;
  const intv = mockInterviews.find(i => i._id === id);
  if (intv) {
    intv.ratings = req.body.ratings || intv.ratings;
    intv.feedbackNotes = req.body.feedbackNotes || intv.feedbackNotes;
    intv.decision = req.body.decision || intv.decision;
    intv.status = 'Completed';
  }
  res.json({ success: true, message: 'Interview feedback recorded.', interview: intv || mockInterviews[0] });
};
