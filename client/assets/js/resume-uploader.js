/**
 * Resume Drag & Drop Upload & Parsing Module
 */

const ResumeUploader = {
  init() {
    const dropzone = document.getElementById('resume-dropzone');
    const fileInput = document.getElementById('resume-file-input');

    if (!dropzone || !fileInput) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length) this.handleUpload(files[0]);
    });

    dropzone.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) this.handleUpload(e.target.files[0]);
    });
  },

  async handleUpload(file) {
    const progressContainer = document.getElementById('upload-progress-container');
    const progressBar = document.getElementById('upload-progress-bar');
    const progressText = document.getElementById('upload-progress-text');
    const previewDrawer = document.getElementById('parsed-result-drawer');

    if (progressContainer) progressContainer.style.display = 'block';
    if (progressBar) progressBar.style.width = '20%';
    if (progressText) progressText.textContent = `Uploading ${file.name}...`;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      if (progressBar) progressBar.style.width = '60%';
      if (progressText) progressText.textContent = `Parsing file via AI Engine...`;

      const result = await API.post('/resumes/upload', formData);

      if (progressBar) progressBar.style.width = '100%';
      if (progressText) progressText.textContent = `Resume Parsed Successfully!`;

      setTimeout(() => {
        if (progressContainer) progressContainer.style.display = 'none';
      }, 1500);

      if (window.App) window.App.showToast(`Resume '${file.name}' parsed by AI Engine!`, 'success');

      if (result.parsedCandidate && previewDrawer) {
        this.renderParsedCandidate(result.parsedCandidate, result.rawTextPreview);
      }

      if (window.CandidateManager) {
        window.CandidateManager.loadCandidates();
      }
    } catch (error) {
      if (progressContainer) progressContainer.style.display = 'none';
      if (window.App) window.App.showToast(`Upload failed: ${error.message}`, 'danger');
    }
  },

  renderParsedCandidate(candidate, rawText) {
    const container = document.getElementById('parsed-candidate-content');
    if (!container) return;

    const drawer = document.getElementById('parsed-result-drawer');
    if (drawer) drawer.style.display = 'block';

    const hardSkills = candidate.skills?.hard || [];
    const softSkills = candidate.skills?.soft || [];

    container.innerHTML = `
      <div class="glass-panel" style="padding: 24px; margin-top: 24px; border: var(--border-glow-cyan);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h3 style="font-size: 22px; color: #fff;">${candidate.fullName}</h3>
            <p style="color: var(--color-cyan); font-size: 14px; margin-top: 4px;">
              <i class="fas fa-envelope"></i> ${candidate.email} &nbsp;|&nbsp; 
              <i class="fas fa-phone"></i> ${candidate.phone} &nbsp;|&nbsp;
              <i class="fas fa-briefcase"></i> ${candidate.totalExperienceYears} Years Experience
            </p>
          </div>
          <span class="badge badge-cyan" style="font-size: 14px;">ATS Score: ${candidate.overallAtsScore}/100</span>
        </div>

        <div style="margin-top: 16px;">
          <h4 style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase;">Extracted Technical Skills</h4>
          <div style="margin-top: 8px;">
            ${hardSkills.map(s => `<span class="badge badge-violet" style="margin: 3px;">${s}</span>`).join('')}
            ${softSkills.map(s => `<span class="badge badge-emerald" style="margin: 3px;">${s}</span>`).join('')}
          </div>
        </div>

        <div style="margin-top: 16px;">
          <h4 style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase;">Education & Experience</h4>
          <p style="font-size: 13px; color: var(--text-primary); margin-top: 4px;">
            🎓 ${candidate.education?.[0]?.degree || 'Degree'} - ${candidate.education?.[0]?.institution || 'University'}
          </p>
          <p style="font-size: 13px; color: var(--text-primary); margin-top: 4px;">
            💼 ${candidate.experience?.[0]?.title || 'Software Engineer'} at ${candidate.experience?.[0]?.company || 'Tech Solutions'}
          </p>
        </div>

        <div style="margin-top: 20px; display: flex; gap: 12px;">
          <button class="btn-ag btn-ag-primary" onclick="App.switchTab('screening'); ScreeningEngine.setCandidate('${candidate._id}')">
            <i class="fas fa-brain"></i> Match Against Job Description
          </button>
        </div>
      </div>
    `;
  }
};
