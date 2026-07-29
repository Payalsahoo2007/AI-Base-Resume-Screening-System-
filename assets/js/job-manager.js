/**
 * Job Description Module Controller
 */

const JobManager = {
  jobs: [],

  async loadJobs() {
    try {
      const res = await API.get('/jobs');
      this.jobs = res.jobs || [];
      this.renderJobsList();
    } catch (e) {
      console.warn('Error loading jobs', e);
    }
  },

  renderJobsList() {
    const container = document.getElementById('jobs-list-container');
    if (!container) return;

    if (!this.jobs.length) {
      container.innerHTML = `<p style="color: var(--text-muted); padding: 20px;">No Job Descriptions created yet.</p>`;
      return;
    }

    container.innerHTML = this.jobs.map(j => `
      <div class="glass-panel" style="padding: 20px; margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h3 style="font-size: 18px; color: #fff;">${j.title}</h3>
            <p style="color: var(--color-cyan); font-size: 13px; margin-top: 4px;">
              🏢 ${j.department} &nbsp;|&nbsp; 📍 ${j.location} &nbsp;|&nbsp; 💼 ${j.minExperienceYears}+ Yrs Exp Required
            </p>
          </div>
          <span class="badge badge-emerald">${j.status || 'Active'}</span>
        </div>
        <p style="color: var(--text-secondary); font-size: 13px; margin-top: 12px;">${j.description}</p>
        <div style="margin-top: 14px;">
          ${(j.requiredSkills || []).map(s => `<span class="badge badge-violet" style="font-size: 11px; margin: 2px;">${s}</span>`).join('')}
        </div>
      </div>
    `).join('');
  },

  async handleCreateJob(e) {
    if (e) e.preventDefault();

    const title = document.getElementById('job-title-input')?.value;
    const department = document.getElementById('job-department-input')?.value;
    const minExp = document.getElementById('job-exp-input')?.value;
    const skills = document.getElementById('job-skills-input')?.value;
    const description = document.getElementById('job-desc-input')?.value;

    if (!title || !description) {
      if (window.App) window.App.showToast('Job Title and Description are required.', 'warning');
      return;
    }

    await API.post('/jobs', {
      title,
      department,
      minExperienceYears: minExp,
      requiredSkills: skills ? skills.split(',').map(s => s.trim()) : [],
      description
    });

    if (window.App) {
      window.App.showToast('New Job Description created!', 'success');
      window.App.closeModals();
    }

    this.loadJobs();
  }
};
