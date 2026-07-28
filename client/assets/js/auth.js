/**
 * Auth & Role Access Manager
 */

const AuthManager = {
  currentUser: {
    id: '1',
    name: 'Marcus Sterling',
    email: 'recruiter@antigravity.ai',
    role: 'Recruiter',
    department: 'Talent Acquisition',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },

  init() {
    const savedRole = localStorage.getItem('ag_user_role');
    if (savedRole) {
      this.currentUser.role = savedRole;
    }
    this.updateUserUI();
    this.bindEvents();
  },

  setRole(newRole) {
    this.currentUser.role = newRole;
    localStorage.setItem('ag_user_role', newRole);
    this.updateUserUI();
    if (window.App) window.App.showToast(`Role switched to '${newRole}'`, 'info');
    if (window.App) window.App.refreshCurrentView();
  },

  updateUserUI() {
    const roleSelect = document.getElementById('role-simulation-select');
    if (roleSelect) roleSelect.value = this.currentUser.role;

    const userNameEl = document.getElementById('user-profile-name');
    const userRoleEl = document.getElementById('user-profile-role');
    if (userNameEl) userNameEl.textContent = this.currentUser.name;
    if (userRoleEl) userRoleEl.textContent = this.currentUser.role;

    // RBAC DOM visibility guards
    const adminElements = document.querySelectorAll('.rbac-admin-only');
    adminElements.forEach(el => {
      if (this.currentUser.role === 'Super Admin' || this.currentUser.role === 'HR Manager') {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });
  },

  bindEvents() {
    const roleSelect = document.getElementById('role-simulation-select');
    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        this.setRole(e.target.value);
      });
    }
  }
};
