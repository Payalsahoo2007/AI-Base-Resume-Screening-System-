/**
 * Master Application Controller & Router
 */

const App = {
  currentTab: 'dashboard',

  init() {
    console.log('[Anti-Gravity Platform Booting...]');
    AuthManager.init();
    ResumeUploader.init();
    ScreeningEngine.init();
    CandidateManager.loadCandidates();
    JobManager.loadJobs();
    InterviewScheduler.loadInterviews();
    DashboardView.render();

    this.bindNavigation();
    this.bindModals();
    this.bindGlobalSearch();
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update Sidebar Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      if (item.dataset.tab === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update View Containers
    const views = document.querySelectorAll('.tab-view');
    views.forEach(view => {
      if (view.id === `view-${tabId}`) {
        view.style.display = 'block';
        view.classList.remove('fade-in-view');
        void view.offsetWidth; // Trigger reflow
        view.classList.add('fade-in-view');
      } else {
        view.style.display = 'none';
        view.classList.remove('fade-in-view');
      }
    });

    // Lazy load specific view controllers on tab switch
    if (tabId === 'analytics') {
      AnalyticsView.init();
    } else if (tabId === 'admin') {
      AdminPanel.init();
    }
  },

  refreshCurrentView() {
    this.switchTab(this.currentTab);
  },

  bindNavigation() {
    const navLinks = document.querySelectorAll('.nav-item[data-tab]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = link.dataset.tab;
        this.switchTab(tabId);
      });
    });
  },

  bindModals() {
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => this.closeModals());
    });

    const overlays = document.querySelectorAll('.ag-modal-overlay');
    overlays.forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeModals();
      });
    });
  },

  closeModals() {
    const modals = document.querySelectorAll('.ag-modal-overlay');
    modals.forEach(m => m.classList.remove('active'));
  },

  bindGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', async (e) => {
      const q = e.target.value.trim();
      if (q.length > 2) {
        const res = await API.get(`/search?q=${encodeURIComponent(q)}`);
        console.log('[Global Search Results]', res.results);
      }
    });
  },

  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `glass-panel toast-item toast-${type}`;
    toast.style.cssText = `
      padding: 14px 20px;
      margin-top: 10px;
      border-radius: 12px;
      font-size: 14px;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: var(--shadow-anti-gravity);
      border: var(--border-glow-${type === 'danger' ? 'rose' : (type === 'success' ? 'cyan' : 'violet')});
      animation: slideInToast 0.4s ease;
    `;

    const icon = type === 'success' ? 'fa-check-circle text-emerald' : (type === 'danger' ? 'fa-exclamation-circle text-rose' : 'fa-info-circle text-cyan');
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
};

window.addEventListener('DOMContentLoaded', () => App.init());
