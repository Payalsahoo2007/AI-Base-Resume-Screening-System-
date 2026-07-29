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

    const rec = match.aiAnalysis?.hiringRecommendation || 'Hire';
    let recBadgeClass = 'badge-cyan pulse-glow-cyan';
    if (rec === 'Strong Hire' || rec === 'Hire') recBadgeClass = 'badge-emerald pulse-glow-emerald';
    if (rec === 'Reject') recBadgeClass = 'badge-rose pulse-glow-rose';

    const skillScore = match.scoreBreakdown?.skillMatchScore || 85;
    const kwScore = match.scoreBreakdown?.keywordMatchScore || 80;
    const expScore = match.scoreBreakdown?.experienceMatchScore || 90;
    const targetScore = match.overallMatchScore || 75;

    container.innerHTML = `
      <div class="grid-2 fade-in-up" style="margin-top: 24px;">
        <!-- Left Column: ATS Score Gauge & Skill Heatmap -->
        <div class="glass-panel" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 18px; color: #fff;">AI Compatibility Breakdown</h3>
            <span class="badge ${recBadgeClass}" style="font-size: 14px; padding: 6px 14px;">Recommendation: ${rec}</span>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <div id="anim-overall-score" style="font-size: 56px; font-weight: 800; font-family: var(--font-heading);" class="text-gradient">
              0%
            </div>
            <p style="color: var(--text-secondary); font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Overall AI Match Score</p>
          </div>

          <!-- Animated Score Metrics Bars -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
                <span>Skill Match</span>
                <span class="text-cyan">${skillScore}%</span>
              </div>
              <div style="height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
                <div id="bar-skill-match" class="progress-bar-fill" style="background: var(--color-cyan);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
                <span>Keyword Match & Density</span>
                <span class="text-violet">${kwScore}%</span>
              </div>
              <div style="height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
                <div id="bar-kw-match" class="progress-bar-fill" style="background: var(--color-violet);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
                <span>Experience Seniority Alignment</span>
                <span class="text-emerald">${expScore}%</span>
              </div>
              <div style="height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
                <div id="bar-exp-match" class="progress-bar-fill" style="background: var(--color-emerald);"></div>
              </div>
            </div>
          </div>

          <!-- Staggered Keyword Heatmap -->
          <div style="margin-top: 28px;">
            <h4 style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px;">Keyword Heatmap Matrix</h4>
            <div>
              ${(match.matchingSkills || []).map((s, idx) => `<span class="keyword-tag tag-match pop-in-tag" style="animation-delay: ${idx * 0.08}s;">✓ ${s}</span>`).join('')}
              ${(match.missingSkills || []).map((s, idx) => `<span class="keyword-tag tag-missing pop-in-tag" style="animation-delay: ${(match.matchingSkills?.length || 0) * 0.08 + idx * 0.08}s;">✗ ${s}</span>`).join('')}
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
              ${(match.aiAnalysis?.interviewQuestions || []).map(q => `<li style="background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: 8px; border-left: 3px solid var(--color-cyan); transition: all 0.3s ease;" class="pop-in-tag">"${q}"</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;

    // Trigger smooth progress bar growth & counter animation after DOM insertion
    requestAnimationFrame(() => {
      setTimeout(() => {
        const barSkill = document.getElementById('bar-skill-match');
        const barKw = document.getElementById('bar-kw-match');
        const barExp = document.getElementById('bar-exp-match');

        if (barSkill) barSkill.style.width = `${skillScore}%`;
        if (barKw) barKw.style.width = `${kwScore}%`;
        if (barExp) barExp.style.width = `${expScore}%`;

        // Animate counter
        const counterEl = document.getElementById('anim-overall-score');
        if (counterEl) {
          let current = 0;
          const step = Math.max(1, Math.ceil(targetScore / 30));
          const timer = setInterval(() => {
            current += step;
            if (current >= targetScore) {
              counterEl.textContent = `${targetScore}%`;
              clearInterval(timer);
            } else {
              counterEl.textContent = `${current}%`;
            }
          }, 25);
        }
      }, 50);
    });
  }
};
