/**
 * Chart.js Analytics & Visualizations Studio Controller
 */

const AnalyticsView = {
  charts: {},

  async init() {
    try {
      const data = await API.get('/analytics/dashboard');
      this.renderCharts(data);
    } catch (e) {
      console.warn('Error rendering analytics charts', e);
    }
  },

  renderCharts(data) {
    if (typeof Chart === 'undefined') return;

    // 1. Candidate Competency Radar Chart
    const radarCtx = document.getElementById('radar-chart-canvas')?.getContext('2d');
    if (radarCtx) {
      if (this.charts.radar) this.charts.radar.destroy();
      this.charts.radar = new Chart(radarCtx, {
        type: 'radar',
        data: {
          labels: data.radarMetrics?.labels || ['Technical Skill', 'Experience Match', 'ATS Formatting', 'Education', 'Culture Fit', 'Keyword Overlap'],
          datasets: [
            {
              label: 'Candidate Average',
              data: data.radarMetrics?.candidateScores || [92, 88, 95, 84, 90, 86],
              backgroundColor: 'rgba(0, 243, 255, 0.25)',
              borderColor: '#00f3ff',
              borderWidth: 2
            },
            {
              label: 'Job Benchmark Requirement',
              data: data.radarMetrics?.jobBenchmark || [85, 80, 90, 80, 85, 80],
              backgroundColor: 'rgba(138, 43, 226, 0.25)',
              borderColor: '#8a2be2',
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#f8fafc' } } },
          scales: { r: { grid: { color: 'rgba(255,255,255,0.1)' }, pointLabels: { color: '#94a3b8' } } }
        }
      });
    }

    // 2. Skill Distribution Bar Chart
    const barCtx = document.getElementById('bar-chart-canvas')?.getContext('2d');
    if (barCtx) {
      if (this.charts.bar) this.charts.bar.destroy();
      this.charts.bar = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: (data.skillsDistribution || []).map(s => s.skill),
          datasets: [{
            label: 'Applicant Count per Skill',
            data: (data.skillsDistribution || []).map(s => s.count),
            backgroundColor: 'rgba(0, 243, 255, 0.6)',
            borderColor: '#00f3ff',
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#f8fafc' } } },
          scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }

    // 3. Hiring Funnel Pie / Donut Chart
    const pieCtx = document.getElementById('pie-chart-canvas')?.getContext('2d');
    if (pieCtx) {
      if (this.charts.pie) this.charts.pie.destroy();
      this.charts.pie = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: (data.hiringFunnel || []).map(f => f.stage),
          datasets: [{
            data: (data.hiringFunnel || []).map(f => f.count),
            backgroundColor: ['#00f3ff', '#8a2be2', '#00ff9d', '#ffaa00', '#ff2a6d', '#0072ff']
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#f8fafc' } } }
        }
      });
    }
  }
};
