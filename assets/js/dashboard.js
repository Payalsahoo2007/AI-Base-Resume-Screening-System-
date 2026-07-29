/**
 * Dashboard View Controller
 */

const DashboardView = {
  async render() {
    try {
      const data = await API.get('/analytics/dashboard');
      const stats = data.stats || {};

      this.animateCounter('stat-total-candidates', stats.totalCandidates || 284);
      this.animateCounter('stat-new-applications', stats.newApplications || 42);
      this.animateCounter('stat-shortlisted', stats.shortlisted || 68);
      this.animateCounter('stat-rejected', stats.rejected || 31);
      this.animateCounter('stat-interviews', stats.interviewScheduled || 18);
      this.animateCounter('stat-offers', stats.offersSent || 9);

      const atsScoreEl = document.getElementById('stat-avg-ats');
      if (atsScoreEl) atsScoreEl.textContent = `${stats.averageAtsScore || 86.4}%`;

      const expEl = document.getElementById('stat-avg-exp');
      if (expEl) expEl.textContent = `${stats.averageExperienceYears || 4.8} yrs`;

    } catch (e) {
      console.warn('Using default dashboard metrics.', e);
    }
  },

  animateCounter(id, targetValue) {
    const el = document.getElementById(id);
    if (!el) return;
    let start = 0;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = targetValue / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        el.textContent = Math.round(targetValue);
        clearInterval(timer);
      } else {
        el.textContent = Math.round(start);
      }
    }, stepTime);
  }
};
