/**
 * Candidate Pipeline & Data Table Manager
 */

const CandidateManager = {
  candidates: [],

  async loadCandidates() {
    try {
      const searchInput = document.getElementById('candidate-search-input');
      const statusFilter = document.getElementById('candidate-status-filter');

      const q = searchInput ? searchInput.value : '';
      const st = statusFilter ? statusFilter.value : '';

      const queryParams = new URLSearchParams();
      if (q) queryParams.append('search', q);
      if (st) queryParams.append('status', st);

      const data = await API.get(`/candidates?${queryParams.toString()}`);
      this.candidates = data.candidates || [];
      this.renderTable();
    } catch (e) {
      console.warn('Error loading candidates', e);
    }
  },

  renderTable() {
    const tbody = document.getElementById('candidates-table-body');
    if (!tbody) return;

    if (!this.candidates.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">No candidates matching criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.candidates.map(c => {
      const statusBadgeClass = c.status === 'Shortlisted' ? 'badge-emerald' 
        : (c.status === 'Interview Scheduled' ? 'badge-violet' 
        : (c.status === 'Rejected' ? 'badge-rose' : 'badge-cyan'));

      return `
        <tr>
          <td><input type="checkbox" class="cand-checkbox" value="${c._id}"></td>
          <td>
            <div style="font-weight: 600; color: #fff;">${c.fullName}</div>
            <div style="font-size: 12px; color: var(--text-secondary);">${c.email}</div>
          </td>
          <td><span class="badge ${statusBadgeClass}">${c.status}</span></td>
          <td><strong style="color: var(--color-cyan); font-size: 15px;">${c.overallAtsScore}</strong> / 100</td>
          <td>${c.totalExperienceYears} Years</td>
          <td>
            ${(c.skills?.hard || []).slice(0, 3).map(s => `<span class="badge badge-cyan" style="font-size: 10px; margin: 2px;">${s}</span>`).join('')}
          </td>
          <td>
            <button class="btn-ag btn-ag-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="CandidateManager.openCandidateModal('${c._id}')">
              <i class="fas fa-eye"></i> View Profile
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  async updateStatus(id, newStatus) {
    await API.put(`/candidates/${id}/status`, { status: newStatus });
    if (window.App) window.App.showToast(`Updated candidate status to '${newStatus}'`, 'success');
    this.loadCandidates();
  },

  async applyBulkAction(action) {
    const checkboxes = document.querySelectorAll('.cand-checkbox:checked');
    const ids = Array.from(checkboxes).map(cb => cb.value);

    if (!ids.length) {
      if (window.App) window.App.showToast('Please select candidates first.', 'warning');
      return;
    }

    await API.post('/candidates/bulk-action', { ids, action });
    if (window.App) window.App.showToast(`Applied '${action}' to ${ids.length} candidate(s)`, 'success');
    this.loadCandidates();
  },

  openCandidateModal(id) {
    const cand = this.candidates.find(c => c._id === id || c.id === id);
    if (!cand) return;

    const modalOverlay = document.getElementById('candidate-profile-modal');
    const modalContent = document.getElementById('candidate-profile-modal-body');

    if (modalContent) {
      modalContent.innerHTML = `
        <h2 style="color: #fff; margin-bottom: 8px;">${cand.fullName} Profile</h2>
        <p style="color: var(--color-cyan); margin-bottom: 20px;">${cand.email} | ${cand.phone}</p>

        <div style="margin-bottom: 16px;">
          <h4 style="color: var(--text-secondary); font-size: 13px; text-transform: uppercase;">Technical Competencies</h4>
          <div style="margin-top: 8px;">
            ${(cand.skills?.hard || []).map(s => `<span class="badge badge-cyan" style="margin: 3px;">${s}</span>`).join('')}
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="color: var(--text-secondary); font-size: 13px; text-transform: uppercase;">Professional Summary</h4>
          <p style="font-size: 14px; color: var(--text-primary); margin-top: 6px;">${cand.summary || 'Senior Engineer experienced in enterprise cloud applications.'}</p>
        </div>

        <div style="display: flex; gap: 12px; margin-top: 24px;">
          <button class="btn-ag btn-ag-primary" onclick="CandidateManager.updateStatus('${cand._id}', 'Shortlisted'); App.closeModals();">
            Shortlist Candidate
          </button>
          <button class="btn-ag btn-ag-secondary" onclick="CandidateManager.updateStatus('${cand._id}', 'Rejected'); App.closeModals();">
            Reject Application
          </button>
        </div>
      `;
    }

    if (modalOverlay) modalOverlay.classList.add('active');
  }
};
