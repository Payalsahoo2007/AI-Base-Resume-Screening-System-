/**
 * Interview Management & Feedback Controller
 */

const InterviewScheduler = {
  interviews: [],

  async loadInterviews() {
    try {
      const res = await API.get('/interviews');
      this.interviews = res.interviews || [];
      this.renderList();
    } catch (e) {
      console.warn('Error loading interviews', e);
    }
  },

  renderList() {
    const container = document.getElementById('interviews-list-container');
    if (!container) return;

    if (!this.interviews.length) {
      container.innerHTML = `<p style="color: var(--text-muted); padding: 20px;">No upcoming interviews scheduled.</p>`;
      return;
    }

    container.innerHTML = this.interviews.map(i => `
      <div class="glass-panel" style="padding: 20px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="font-size: 18px; color: #fff;">${i.candidateName}</h3>
            <p style="color: var(--color-cyan); font-size: 13px; margin-top: 2px;">
              Role: ${i.jobTitle} | Interviewer: ${i.interviewerName}
            </p>
          </div>
          <span class="badge badge-violet">${i.status}</span>
        </div>

        <div style="margin-top: 12px; font-size: 13px; color: var(--text-secondary);">
          📅 ${new Date(i.scheduledAt).toLocaleString()} &nbsp;|&nbsp; ⏱️ ${i.durationMinutes} mins &nbsp;|&nbsp; 🌐 ${i.locationType}
        </div>

        <div style="margin-top: 16px; display: flex; gap: 12px;">
          <a href="${i.meetingUrl}" target="_blank" class="btn-ag btn-ag-primary" style="padding: 6px 14px; font-size: 12px;">
            <i class="fas fa-video"></i> Join Meeting
          </a>
          <button class="btn-ag btn-ag-secondary" style="padding: 6px 14px; font-size: 12px;" onclick="InterviewScheduler.openFeedbackModal('${i._id}')">
            <i class="fas fa-edit"></i> Submit Scorecard Feedback
          </button>
        </div>
      </div>
    `).join('');
  },

  async handleSchedule(e) {
    if (e) e.preventDefault();

    const candidateName = document.getElementById('intv-candidate-name')?.value;
    const jobTitle = document.getElementById('intv-job-title')?.value;
    const scheduledAt = document.getElementById('intv-datetime')?.value;

    await API.post('/interviews/schedule', {
      candidateName,
      jobTitle,
      scheduledAt
    });

    if (window.App) {
      window.App.showToast('Interview scheduled successfully!', 'success');
      window.App.closeModals();
    }

    this.loadInterviews();
  },

  openFeedbackModal(id) {
    const modalOverlay = document.getElementById('feedback-modal');
    if (modalOverlay) modalOverlay.classList.add('active');
  }
};
