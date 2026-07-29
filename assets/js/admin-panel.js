/**
 * Admin Panel Controller - RBAC & Audit Logger
 */

const AdminPanel = {
  async init() {
    await this.loadAuditLogs();
  },

  async loadAuditLogs() {
    try {
      const data = await API.get('/admin/audit-logs');
      this.renderAuditLogs(data.logs || []);
    } catch (e) {
      console.warn('Error loading audit logs', e);
    }
  },

  renderAuditLogs(logs) {
    const tbody = document.getElementById('audit-logs-table-body');
    if (!tbody) return;

    if (!logs.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--text-muted);">No audit events recorded.</td></tr>`;
      return;
    }

    tbody.innerHTML = logs.map(l => `
      <tr>
        <td><span class="badge badge-violet">${l.action}</span></td>
        <td><strong style="color: #fff;">${l.user}</strong> (${l.role})</td>
        <td style="font-size: 13px; color: var(--text-secondary);">${l.details}</td>
        <td><code>${l.ipAddress}</code></td>
        <td style="font-size: 12px; color: var(--text-muted);">${new Date(l.timestamp).toLocaleString()}</td>
      </tr>
    `).join('');
  },

  async triggerBackup() {
    const res = await API.post('/admin/backup', {});
    if (window.App) window.App.showToast(`System Backup Created: ${res.backupFile}`, 'success');
  },

  async triggerRestore() {
    const res = await API.post('/admin/restore', {});
    if (window.App) window.App.showToast('System database restored from snapshot!', 'success');
  }
};
