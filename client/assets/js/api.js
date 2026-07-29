/**
 * API Fetch Client - Centralized REST Handler
 */

const API_BASE = '/api';

const API = {
  getToken() {
    return localStorage.getItem('ag_token') || '';
  },

  setToken(token) {
    localStorage.setItem('ag_token', token);
  },

  clearToken() {
    localStorage.removeItem('ag_token');
  },

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.warn(`[API Client Fallback] ${endpoint}: ${error.message}. Serving interactive mock payload for static web demo.`);
      return this.getMockResponse(endpoint, options);
    }
  },

  getMockResponse(endpoint, options) {
    if (endpoint.includes('/analytics/dashboard')) {
      return {
        success: true,
        stats: { totalCandidates: 284, newApplications: 42, shortlisted: 68, rejected: 31, interviewScheduled: 18, offersSent: 9, averageAtsScore: 86.4, averageExperienceYears: 4.8 },
        hiringFunnel: [{ stage: 'Resumes Received', count: 284 }, { stage: 'AI Screened', count: 210 }, { stage: 'Shortlisted', count: 68 }, { stage: 'Interviewed', count: 18 }, { stage: 'Offered', count: 9 }],
        skillsDistribution: [{ skill: 'JavaScript / Node.js', count: 142 }, { skill: 'Python / ML', count: 98 }, { skill: 'React / Frontend', count: 85 }, { skill: 'Docker / K8s', count: 74 }],
        radarMetrics: { labels: ['Technical Skill', 'Experience Match', 'ATS Formatting', 'Education', 'Culture Fit', 'Keyword Overlap'], candidateScores: [92, 88, 95, 84, 90, 86], jobBenchmark: [85, 80, 90, 80, 85, 80] }
      };
    }

    if (endpoint.includes('/candidates')) {
      return {
        success: true,
        count: 3,
        candidates: [
          { _id: 'cand-1', fullName: 'Alex Rivera', email: 'alex.rivera@example.com', phone: '+1 (555) 234-5678', totalExperienceYears: 5, overallAtsScore: 92, status: 'Shortlisted', skills: { hard: ['JavaScript', 'Node.js', 'Express.js', 'React', 'MongoDB', 'Python'] }, summary: 'Senior Software Engineer with 5+ years building cloud-native web services and AI applications.' },
          { _id: 'cand-2', fullName: 'Sophia Lin', email: 'sophia.lin@techworld.org', phone: '+1 (555) 876-5432', totalExperienceYears: 4, overallAtsScore: 88, status: 'Interview Scheduled', skills: { hard: ['Python', 'Django', 'Machine Learning', 'TensorFlow'] }, summary: 'AI & Data Science Specialist proficient in Python, machine learning models, and document processing.' },
          { _id: 'cand-3', fullName: 'David Miller', email: 'david.miller@cloudsoft.com', phone: '+1 (555) 345-6789', totalExperienceYears: 6, overallAtsScore: 85, status: 'New', skills: { hard: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'Golang'] }, summary: 'DevOps & Site Reliability Engineer specialized in Kubernetes, Docker, and AWS automation.' }
        ]
      };
    }

    if (endpoint.includes('/jobs')) {
      return {
        success: true,
        count: 3,
        jobs: [
          { _id: 'job-1', title: 'Senior AI / Full Stack Engineer', department: 'Engineering', location: 'Remote', minExperienceYears: 4, requiredSkills: ['JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Python'], description: 'We are seeking an AI & Full Stack Engineer to lead our next-generation automated recruitment engine.', status: 'Active' },
          { _id: 'job-2', title: 'Lead Technical Recruiter', department: 'Talent Acquisition', location: 'San Francisco, CA', minExperienceYears: 3, requiredSkills: ['Technical Sourcing', 'Interviewing', 'Agile Hiring'], description: 'Drive strategic hiring for engineering, product design, and AI executive roles.', status: 'Active' }
        ]
      };
    }

    if (endpoint.includes('/screening/match')) {
      return {
        success: true,
        matchResult: {
          overallMatchScore: 88,
          scoreBreakdown: { skillMatchScore: 90, keywordMatchScore: 85, experienceMatchScore: 95, atsScore: 92, educationMatchScore: 90 },
          matchingSkills: ['JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Python'],
          missingSkills: ['OpenAI', 'System Architecture'],
          aiAnalysis: {
            strengths: ['Strong core technical alignment across JavaScript, Node.js, and MongoDB', '5+ years relevant experience exceeds job requirements', 'High ATS score with complete education & contact profile'],
            weaknesses: ['Keyword optimization opportunity: Add System Architecture & GraphQL'],
            interviewQuestions: ['Explain your architecture design choices when working with scalable APIs.', 'How do you handle microservice error handling and logging?'],
            hiringRecommendation: 'Strong Hire'
          }
        }
      };
    }

    if (endpoint.includes('/interviews')) {
      return {
        success: true,
        interviews: [
          { _id: 'int-1', candidateName: 'Alex Rivera', jobTitle: 'Senior AI Engineer', interviewerName: 'Dr. Evelyn Reed', scheduledAt: new Date().toISOString(), durationMinutes: 45, locationType: 'Google Meet', meetingUrl: 'https://meet.google.com/anti-gravity-ats', status: 'Scheduled' }
        ]
      };
    }

    return { success: true, message: 'Static web fallback response.' };
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body)
    });
  },

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};
