# EV AI — Empower & Evolve

> **Personalized AI Career Navigator & Skill Velocity Acceleration Engine**

[![Vercel Deployment](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://github.com/devaharsha588-ctrl/EV-1.git)
[![Render Backend](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://github.com/devaharsha588-ctrl/EV-1.git)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB?logo=react)](https://react.dev/)
[![Framer Motion](https://img.shields.io/badge/Motion-Framer-0055FF?logo=framer)](https://www.framer.com/motion/)

EV AI is an engineering-grade full-stack application built to empower software engineers, developers, students, and career switchers to accelerate their learning trajectory, build production-grade portfolios, and navigate milestone career objectives.

---

## 🌟 Core Features & Stack

### 🎨 Frontend (React + Vite + Tailwind CSS + Framer Motion)
- **Design Aesthetic**: Minimalist Nothing-style engineering theme with high-contrast typography and WCAG AA accessibility standards.
- **10-Step Onboarding Engine**: Interactive multi-step personalization collecting role, target domains, skill level, milestone goals, weekly hours, and tech stack.
- **Smart Chat Hero Transitions**: Smooth Framer Motion spring physics collapsing the hero greeting block on active chat and restoring it on clear.
- **GitHub Intelligence**: Real-time analysis of public repository velocity, contributions, and language breakdown.
- **Milestone Roadmap**: Tailored step-by-step career phase milestones based on profile goals.
- **ATS Resume Builder**: Metric-driven resume scoring and AI optimization suggestions.
- **Learning Analytics**: Filterable score trajectory charts (Week / Month / All Time) with dynamic stat cards.

### ⚙️ Backend (Node.js + Express + Supabase + Multi-AI Engine)
- **Framework**: Express.js with modular clean architecture and strict input validation.
- **AI Integrations**: Google Gemini API (`gemini-1.5-flash`), OpenAI GPT-4o, Grok, and fallback AI generator.
- **Database Support**: Supabase PostgreSQL & MySQL with relational migrations.
- **Authentication**: JWT access & refresh token rotation with bcrypt password hashing.

---

## 📁 Repository Structure

```text
Empower and Evolve/
├── frontend/                        # React 19 + TypeScript + Vite Frontend
│   ├── src/
│   │   ├── api/                     # Axios API Client & Interceptors
│   │   ├── components/              # Reusable UI Components & Headers
│   │   ├── constants/               # Route Definitions & App Constants
│   │   ├── context/                 # Auth, Sidebar, Theme, & App Providers
│   │   ├── hooks/                   # Custom Hooks (useProfile, useAuth)
│   │   ├── layouts/                 # Root Layout, Sidebar, & TopNavbar
│   │   ├── pages/                   # Application Page Views
│   │   │   ├── analytics/           # Learning Trajectory Analytics
│   │   │   ├── auth/                # Login & Registration Pages
│   │   │   ├── dashboard/           # Home & AI Chat Workspace
│   │   │   ├── github/              # GitHub Activity Intelligence
│   │   │   ├── onboarding/          # 10-Step Personalization Flow
│   │   │   ├── profile/             # User Profile & Indexed Tech Stack
│   │   │   ├── resume/              # ATS Resume Builder
│   │   │   ├── roadmap/             # Career Milestone Roadmap
│   │   │   └── settings/            # Account & AI Settings
│   │   ├── services/                # Profile, Chat, GitHub, & Generator Services
│   │   └── styles/                  # Global Tailwind CSS Tokens
│   └── package.json
│
├── backend/                         # Node.js + Express API Backend
│   ├── src/
│   │   ├── controllers/             # REST Request Handlers
│   │   ├── middleware/              # Auth, Rate Limiting, & Error Handling
│   │   ├── models/                  # Supabase & DB Data Models
│   │   ├── routes/                  # API v1 Endpoint Routes
│   │   └── services/                # Gemini, OpenAI, & Supabase Services
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will launch locally at `http://localhost:5173`.

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 4. Build Production Bundle
```bash
npm --prefix frontend run build
```

---

## 🌐 Live Deployments

- **GitHub Repository**: [https://github.com/devaharsha588-ctrl/EV-1.git](https://github.com/devaharsha588-ctrl/EV-1.git)
- **Frontend Hosting**: Deployed live on Vercel.
- **Backend Hosting**: Deployed live on Render.

---

## 📄 License

MIT © EV AI Team
