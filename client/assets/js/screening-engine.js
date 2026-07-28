/**
 * AI Screening & Matchmaking Engine Controller
 */

const ScreeningEngine = {
  selectedCandidateId: null,
  selectedJobId: null,

  async init() {
    this.bindEvents();
    await this.loadSelectOptions();
  },

  async loadSelectOptions() {
    try {
      const candidatesRes = await API.get('/candidates');
      const jobsRes = await API.get('/jobs');

      const candSelect = document.getElementById('screen-candidate-select');
      const jobSelect = document.getElementById('screen-job-select');

      if (candSelect && candidatesRes.candidates) {
        candSelect.innerHTML = candidatesRes.candidates.map(c => 
          `<option value="${c._id}">${c.fullName} (${c.overallAtsScore} ATS | ${c.totalExperienceYears} yrs exp)</option>`
        ).join('');
      }

      if (jobSelect && jobsRes.jobs) {
        jobSelect.innerHTML = jobsRes.jobs.map(j => 
          `<option value="${j._id}">${j.title} - ${j.department}</option>`
        ).join('');
      }
    } catch (e) {
      console.warn('Error loading screening options', e);
    }
  },

  setCandidate(id) {
    this.selectedCandidateId = id;
    const candSelect = document.getElementById('screen-candidate-select');
    if (candSelect) candSelect.value = id;
    this.runMatch();
  },

  bindEvents() {
    const btnMatch = document.getElementById('btn-run-ai-match');
    if (btnMatch) {
      btnMatch.addEventListener('click', () => this.runMatch());
    }
  },

  async runMatch() {
    const candSelect = document.getElementById('screen-candidate-select');
    const jobSelect = document.getElementById('screen-job-select');

    const candidateId = candSelect ? candSelect.value : null;
    const jobId = jobSelect ? jobSelect.value : null;

    const resultContainer = document.getElementById('ai-match-results-container');
    if (resultContainer) {
      resultContainer.innerHTML = `
        <div style="text-align: center; padding: 50px;">
          <i class="fas fa-microchip fa-spin" style="font-size: 40px; color: var(--color-cyan);"></i>
          <h3 style="margin-top: 16px; color: #fff;">Running AI Multi-Dimensional Screening Algorithm...</h3>
          <p style="color: var(--text-secondary); font-size: 14px;">Analyzing ATS keywords, TF-IDF skill density, education alignment & career growth timeline.</p>
        </div>
      `;
    }

    try {
      const data = await API.post('/screening/match', { candidateId, jobId });
      this.renderMatchResult(data.matchResult, data.candidate, data.job);
    } catch (error) {
      if (resultContainer) {
        resultContainer.innerHTML = `<p style="color: var(--color-rose);">Match engine error: ${error.message}</p>`;
      }
    }
  },

  renderMatchResult(match, candidate, job) {
    const container = document.getElementById('ai-match-results-container');
    if (!container) return;

    const recColor = match.aiAnalysis?.hiringRecommendation === 'Strong Hire' || match.aiAnalysis?.hiringRecommendation === 'Hire'
      ? 'badge-emerald' : (match.aiAnalysis?.hiringRecommendation === 'Consider' ? 'badge-cyan' : 'badge-rose');

    container.innerHTML = `
      <div class="grid-2" style="margin-top: 24px;">
        <!-- Left Column: ATS Score Gauge & Skill Heatmap -->
        <div class="glass-panel" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 18px; color: #fff;">AI Compatibility Breakdown</h3>
            <span class="badge ${recColor}" style="font-size: 14px;">Recommendation: ${match.aiAnalysis?.hiringRecommendation || 'Hire'}</span>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 56px; font-weight: 800; font-family: var(--font-heading);" class="text-gradient">
              ${match.overallMatchScore}%
            </div>
            <p style="color: var(--text-secondary); font-size: 13px; text-transform: uppercase;">Overall AI Match Score</p>
          </div>

          <!-- Score Metrics Bars -->
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                <span>Skill Match</span>
                <span class="text-cyan">${match.scoreBreakdown?.skillMatchScore || 85}%</span>
              </div>
              <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                <div style="width: ${match.scoreBreakdown?.skillMatchScore || 85}%; height: 100%; background: var(--color-cyan);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                <span>Keyword Match & Density</span>
                <span class="text-violet">${match.scoreBreakdown?.keywordMatchScore || 80}%</span>
              </div>
              <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                <div style="width: ${match.scoreBreakdown?.keywordMatchScore || 80}%; height: 100%; background: var(--color-violet);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                <span>Experience Seniority Alignment</span>
                <span class="text-emerald">${match.scoreBreakdown?.experienceMatchScore || 90}%</span>
              </div>
              <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
                <div style="width: ${match.scoreBreakdown?.experienceMatchScore || 90}%; height: 100%; background: var(--color-emerald);"></div>
              </div>
            </div>
          </div>

          <!-- Keyword Heatmap -->
          <div style="margin-top: 24px;">
            <h4 style="font-size: 14px; color: var(--text-secondary); margin-bottom: 10px;">Keyword Heatmap Matrix</h4>
            <div>
              ${(match.matchingSkills || []).map(s => `<span class="keyword-tag tag-match">✓ ${s}</span>`).join('')}
              ${(match.missingSkills || []).map(s => `<span class="keyword-tag tag-missing">✗ ${s}</span>`).join('')}
            </div>
          </div>
        </div>

        <!-- Right Column: AI Strengths, Weaknesses & Suggested Interview Questions -->
        <div class="glass-panel" style="padding: 24px;">
          <h3 style="font-size: 18px; color: #fff; margin-bottom: 16px;">AI Insights & Analysis</h3>

          <div style="margin-bottom: 20px;">
            <h4 style="color: var(--color-emerald); font-size: 14px; display: flex; align-items: center; gap: 8px;">
              <i class="fas fa-check-circle"></i> Candidate Key Strengths
            </h4>
            <ul style="list-style: none; margin-top: 8px; display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--text-primary);">
              ${(match.aiAnalysis?.strengths || []).map(s => `<li>• ${s}</li>`).join('')}
            </ul>
          </div>

          <div style="margin-bottom: 20px;">
            <h4 style="color: var(--color-rose); font-size: 14px; display: flex; align-items: center; gap: 8px;">
              <i class="fas fa-exclamation-triangle"></i> Identified Skill Gaps / Weaknesses
            </h4>
            <ul style="list-style: none; margin-top: 8px; display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--text-primary);">
              ${(match.aiAnalysis?.weaknesses || ['No critical skill gaps identified.']).map(w => `<li>• ${w}</li>`).join('')}
            </ul>
          </div>

          <div>
            <h4 style="color: var(--color-cyan); font-size: 14px; display: flex; align-items: center; gap: 8px;">
              <i class="fas fa-comments"></i> AI-Generated Interview Questions
            </h4>
            <ul style="list-style: none; margin-top: 8px; display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: var(--text-secondary);">
              ${(match.aiAnalysis?.interviewQuestions || []).map(q => `<li style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; border-left: 2px solid var(--color-cyan);">"${q}"</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }
};
