# 🚀 Anti-Gravity AI Resume Screening & Matchmaking Platform

An enterprise-level **AI Resume Screening, Parsing, and Candidate Matchmaking System** built with a futuristic **Anti-Gravity UI** design system (cosmic dark background, glowing neon cyan/violet accents, 60 FPS particle canvas, magnetic glassmorphism cards).

Built using **Node.js, Express.js, MongoDB (Mongoose), Vanilla HTML5/CSS3/JS, Chart.js, Multer, pdf-parse, Mammoth**, and a **Modular AI Scoring Engine**.

---

## 🌟 Key Features & Highlights

- **Anti-Gravity UI System**: Cosmic dark space theme (`#070a13`), animated canvas stars, orbital nebulae, translucent floating glassmorphism panels (`backdrop-filter: blur`), 3D tilt hover physics, and neon glow accents.
- **Multi-Format Resume Parser**: Supports drag-and-drop parsing for **PDF**, **DOCX**, **TXT**, and **Image Resumes (PNG/JPG)** with built-in OCR text extraction.
- **Modular AI Screening Engine**: Dual-mode engine supporting **OpenAI GPT-4o** API integration AND a built-in **Rule-Based NLP & TF-IDF Keyword Engine** that calculates multi-dimensional match scores without requiring paid API keys.
- **Keyword Match Heatmap**: Compares Candidate skills vs Job Description parameters and visualizes matching vs missing skills in real-time.
- **Interactive Analytics Studio**: Visualizations powered by **Chart.js** including Candidate Competency Radar Chart, Hiring Funnel Doughnut Chart, Skill Demand Bar Chart, and Department Analytics.
- **Candidate Pipeline Manager**: Instant search filtering, skill tagging, status transitions (Shortlisted, Interview Scheduled, Offered, Rejected), bookmarks, and bulk actions.
- **Role-Based Access Control (RBAC)**: Support for 5 enterprise roles: `Super Admin`, `HR Manager`, `Recruiter`, `Interviewer`, and `Candidate`.
- **Interview Hub**: Meeting scheduler, calendar timeline view, evaluation rating sliders (Technical, Culture Fit, Communication), and feedback notes.
- **Security & Protection**: Guarded with Helmet security headers, Express Rate Limiting, CORS, and centralized error handling.
- **Export Engine**: Export candidate reports in **CSV**, **JSON**, and **Printable PDF** formats.

---

## 🏗️ Project Architecture

```
AI-Base/
├── package.json                     # Server scripts & dependencies
├── .env.example                     # Environment variables template
├── README.md                        # Documentation
├── server/
│   ├── index.js                     # Main Express server entry point
│   ├── config/
│   │   ├── db.js                    # MongoDB connection & fallback mode
│   │   ├── jwt.js                   # JWT signing & verification utilities
│   │   └── aiConfig.js              # AI provider configuration
│   ├── models/                      # Mongoose schemas (User, Candidate, Resume, Job, etc.)
│   ├── controllers/                 # Express route logic controllers
│   ├── middleware/                  # Auth, RBAC, Upload (Multer), Error Handler, Rate Limiter
│   ├── routes/                      # REST API routing endpoints
│   ├── services/                    # Parser, OCR, AI Screening & Export services
│   └── uploads/                     # Storage for uploaded resume files
└── client/
    ├── index.html                   # Single-Page Application (SPA) shell
    └── assets/
        ├── css/
        │   ├── anti-gravity.css     # Theme tokens & keyframe animations
        │   ├── components.css       # Cards, dropzones, badges, modals, heatmaps
        │   └── layout.css           # Sidebar, topbar, grid layout, responsive rules
        └── js/
            ├── anti-gravity-fx.js   # 60 FPS Canvas particle engine & mouse parallax
            ├── api.js               # Centralized REST fetch wrapper
            ├── auth.js              # RBAC state manager & role simulator
            ├── dashboard.js         # Stat metric counter animators
            ├── resume-uploader.js   # Drag & drop upload & live parser preview
            ├── screening-engine.js  # Side-by-side AI score gauge & heatmap
            ├── candidate-manager.js # Candidate pipeline table & filters
            ├── job-manager.js       # Job Description requisition creator
            ├── interview-scheduler.js# Meeting scheduler & evaluation scorecard
            ├── analytics-view.js    # Chart.js radar, doughnut & bar charts
            ├── admin-panel.js       # Audit logs viewer & system backup/restore
            └── app.js               # Main launcher, router & notification manager
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB** *(Optional)*: Runs out-of-the-box in In-Memory Smart Store fallback mode if local MongoDB is not running.

### 1. Installation
```bash
# Install dependencies
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/anti_gravity_ats
JWT_SECRET=super_secret_anti_gravity_jwt_key_2035
OPENAI_API_KEY=your_openai_api_key_here_or_leave_blank_for_built_in_ai
```

### 3. Run Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5000
```

---

## 🔌 API Endpoint Documentation

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Register a new user |
| `/api/auth/login` | `POST` | User login & JWT issuance |
| `/api/resumes/upload` | `POST` | Upload and parse PDF/DOCX/TXT/Image resume |
| `/api/screening/match` | `POST` | Run AI Resume vs Job Description match engine |
| `/api/candidates` | `GET` | Query candidates list with search/filter/sort |
| `/api/jobs` | `GET` / `POST` | List and create Job Description requisitions |
| `/api/interviews` | `GET` / `POST` | List and schedule candidate interviews |
| `/api/analytics/dashboard` | `GET` | Get aggregate recruitment stats for Chart.js |
| `/api/reports/csv` | `GET` | Download candidate report in CSV format |
| `/api/reports/json` | `GET` | Download raw JSON candidate data |
| `/api/reports/pdf` | `GET` | View printable HTML/PDF executive report |

---

## 🚀 Deployment Guide

### Deploy to Render / Railway
1. Push repository to GitHub.
2. Create a new **Web Service** on Render or Railway.
3. Set Environment Variables: `PORT`, `MONGODB_URI`, `JWT_SECRET`.
4. Build Command: `npm install`
5. Start Command: `npm start`

### Docker Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 📄 License
This project is licensed under the MIT License.
