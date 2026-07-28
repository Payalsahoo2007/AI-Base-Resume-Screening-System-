const aiConfig = require('../config/aiConfig');

/**
 * Modular AI Screening Service.
 * Leverages OpenAI GPT when configured, otherwise uses Built-in Rule-Based NLP Scoring Engine.
 */
class AIService {

  /**
   * Screen candidate resume against job description
   */
  async screenResume(candidateData, jobData) {
    if (aiConfig.apiKey && aiConfig.provider === 'openai') {
      try {
        return await this.screenWithOpenAI(candidateData, jobData);
      } catch (err) {
        console.warn('[AI Service] OpenAI call failed or key invalid. Switching to Built-in AI Engine.', err.message);
        return this.screenWithBuiltInEngine(candidateData, jobData);
      }
    }
    return this.screenWithBuiltInEngine(candidateData, jobData);
  }

  /**
   * Built-In Advanced NLP & Rule-Based AI Resume Screening Engine
   */
  screenWithBuiltInEngine(candidateData, jobData) {
    const candidateSkills = [
      ...(candidateData.skills?.hard || []),
      ...(candidateData.skills?.soft || []),
      ...(candidateData.skills?.tools || [])
    ].map(s => s.toLowerCase());

    const requiredSkills = (jobData.requiredSkills || []).map(s => s.toLowerCase());
    const preferredSkills = (jobData.preferredSkills || []).map(s => s.toLowerCase());
    const allJobSkills = [...requiredSkills, ...preferredSkills];

    // 1. Skill Match Score (0 - 100)
    let matchedRequired = 0;
    const matchingSkills = [];
    const missingSkills = [];

    requiredSkills.forEach(reqSkill => {
      const match = candidateSkills.some(cs => cs.includes(reqSkill) || reqSkill.includes(cs));
      if (match) {
        matchedRequired++;
        matchingSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    const skillMatchScore = requiredSkills.length > 0
      ? Math.round((matchedRequired / requiredSkills.length) * 100)
      : 85;

    // 2. Keyword Match Score (0 - 100)
    const keywords = (jobData.keywords || ['architecture', 'api', 'database', 'cloud', 'security', 'agile']).map(k => k.toLowerCase());
    const missingKeywords = [];
    let matchedKeywordsCount = 0;

    keywords.forEach(kw => {
      if (candidateSkills.some(cs => cs.includes(kw)) || (candidateData.summary || '').toLowerCase().includes(kw)) {
        matchedKeywordsCount++;
      } else {
        missingKeywords.push(kw);
      }
    });

    const keywordMatchScore = keywords.length > 0
      ? Math.round((matchedKeywordsCount / keywords.length) * 100)
      : 80;

    // 3. Experience Match Score (0 - 100)
    const candExp = candidateData.totalExperienceYears || 2;
    const reqExp = jobData.minExperienceYears || 2;
    let experienceMatchScore = 100;
    if (candExp < reqExp) {
      experienceMatchScore = Math.max(40, Math.round((candExp / reqExp) * 100));
    }

    // 4. ATS Readability & Format Score (0 - 100)
    let atsScore = 75;
    if (candidateData.email && candidateData.phone) atsScore += 10;
    if (candidateData.education && candidateData.education.length > 0) atsScore += 10;
    if (candidateData.linkedin || candidateData.github) atsScore += 5;
    atsScore = Math.min(100, atsScore);

    // 5. Education Score
    const educationMatchScore = candidateData.education && candidateData.education.length > 0 ? 90 : 70;

    // Overall Weighted AI Match Score
    const overallMatchScore = Math.round(
      (skillMatchScore * 0.35) +
      (keywordMatchScore * 0.25) +
      (experienceMatchScore * 0.20) +
      (atsScore * 0.10) +
      (educationMatchScore * 0.10)
    );

    // AI Hire Recommendation
    let hiringRecommendation = 'Consider';
    if (overallMatchScore >= 85) hiringRecommendation = 'Strong Hire';
    else if (overallMatchScore >= 70) hiringRecommendation = 'Hire';
    else if (overallMatchScore < 50) hiringRecommendation = 'Reject';

    // AI Strengths
    const strengths = [
      `Strong alignment in core technical requirements (${matchedRequired}/${requiredSkills.length || 1} required skills matched)`,
      `Relevant industry experience (${candExp} years vs ${reqExp} required)`,
      `High ATS score (${atsScore}/100) with complete contact and education structure`,
      `Demonstrated proficiency in ${matchingSkills.slice(0, 3).join(', ') || 'software engineering'}`
    ];

    // AI Weaknesses
    const weaknesses = [];
    if (missingSkills.length > 0) {
      weaknesses.push(`Missing key required skills: ${missingSkills.join(', ')}`);
    }
    if (candExp < reqExp) {
      weaknesses.push(`Total experience (${candExp} years) is slightly below job requirement (${reqExp} years)`);
    }
    if (missingKeywords.length > 0) {
      weaknesses.push(`Keyword optimization opportunity: Add ${missingKeywords.slice(0, 3).join(', ')} to resume`);
    }

    // AI Suggestions
    const suggestions = [
      `Incorporate specific metric achievements for projects built with ${matchingSkills[0] || 'core technologies'}.`,
      `Add certifications in ${missingSkills[0] || 'Cloud Architecture'} to strengthen candidate profile rating.`
    ];

    // Suggested Custom Interview Questions
    const interviewQuestions = [
      `Can you explain your architecture design choices when working with ${matchingSkills[0] || 'scalable APIs'}?`,
      `How do you handle team collaboration and technical trade-offs in agile environments?`,
      missingSkills[0] ? `What is your familiarity with ${missingSkills[0]} and how quickly can you onboard?` : `Walk us through a major production bug you diagnosed and resolved.`
    ];

    return {
      overallMatchScore,
      scoreBreakdown: {
        atsScore,
        keywordMatchScore,
        experienceMatchScore,
        skillMatchScore,
        educationMatchScore,
        readabilityScore: 88
      },
      matchingSkills: Array.from(new Set(matchingSkills)),
      missingSkills: Array.from(new Set(missingSkills)),
      missingKeywords: Array.from(new Set(missingKeywords)),
      aiAnalysis: {
        strengths,
        weaknesses,
        suggestions,
        interviewQuestions,
        hiringRecommendation
      }
    };
  }

  /**
   * OpenAI API Integration
   */
  async screenWithOpenAI(candidateData, jobData) {
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: aiConfig.apiKey });

    const prompt = `
    You are an expert ATS Resume Screener & Recruiter AI.
    Analyze the candidate resume against the job description below.
    
    CANDIDATE PROFILE:
    ${JSON.stringify(candidateData, null, 2)}
    
    JOB DESCRIPTION:
    ${JSON.stringify(jobData, null, 2)}
    
    Return a strictly formatted JSON object with:
    {
      "overallMatchScore": number (0-100),
      "scoreBreakdown": {
        "atsScore": number,
        "keywordMatchScore": number,
        "experienceMatchScore": number,
        "skillMatchScore": number,
        "educationMatchScore": number,
        "readabilityScore": number
      },
      "matchingSkills": [string],
      "missingSkills": [string],
      "missingKeywords": [string],
      "aiAnalysis": {
        "strengths": [string],
        "weaknesses": [string],
        "suggestions": [string],
        "interviewQuestions": [string],
        "hiringRecommendation": "Strong Hire" | "Hire" | "Consider" | "Reject"
      }
    }
    `;

    const response = await openai.chat.completions.create({
      model: aiConfig.model,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: aiConfig.temperature
    });

    return JSON.parse(response.choices[0].message.content);
  }
}

module.exports = new AIService();
