# EV AI (Evolution Vector) Backend

> **Your Personalized AI Career Navigator**

EV AI is a production-ready, personalized AI career navigation engine for software engineers, students, and technology professionals. It features multi-provider AI support (Google Gemini API, OpenAI, Grok, OpenRouter), Supabase & MySQL database connectors, real-time mentor chat, automated roadmap synthesis, portfolio & resume analysis, learning progress analytics, and comprehensive security hardening.

---

## 🌟 Core Features & Stack

- **Framework**: Node.js, Express.js (Modular clean architecture)
- **AI Integrations**: Google Gemini API (`gemini-1.5-flash`), OpenAI GPT-4o, Grok, OpenRouter (Auto-fallback)
- **Database Support**: Supabase PostgreSQL & MySQL (Sequelize ORM with relational migrations)
- **Authentication**: JWT access & refresh tokens with HTTP-only cookies, bcrypt (12 rounds)
- **Security**: Helmet security headers, CORS protection, express-rate-limit, request sanitization, zero plain secrets
- **Validation**: express-validator schemas with strict input checks
- **Telemetry & Logging**: Winston structured logger, morgan HTTP logger, live `/health` telemetry
- **Testing**: Jest test suites & automated smoke diagnostics

---

## 📁 Project Architecture

```text
backend/
├── docs/
│   ├── openapi.json                 # OpenAPI 3.0 API Specification
│   ├── API.md                       # Comprehensive API Reference Manual
│   ├── FRONTEND_INTEGRATION_GUIDE.md# Frontend integration guide & TypeScript snippets
│   └── EV_AI.postman_collection.json# Complete Postman Collection
├── scripts/
│   ├── seed-demo.js                 # Demo data seeder script
│   ├── check.js                     # Static code analysis scanner
│   ├── smoke.js                     # Automated smoke test diagnostic
│   ├── verify-env.js                # Environment variable validator
│   ├── verify-external.js           # Supabase, DB & AI provider verifier
│   └── db-status.js                 # Database connection inspector
├── src/
│   ├── config/                      # Environment, DB & security configs
│   ├── controllers/                 # Business logic & API request handlers
│   ├── middleware/                  # Auth, rate limiting, error handling, DB middleware
│   ├── models/                      # Sequelize & Supabase data models
│   ├── routes/                      # Versioned REST endpoints (/api/v1)
│   ├── services/                    # AI providers (Gemini, OpenAI, Grok), Supabase, DB
│   └── utils/                       # AppError, Winston logger, JSON helpers
├── render.yaml                      # Render 1-click cloud deployment spec
└── package.json
```

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create `.env` from `.env.example`:
```bash
cp .env.example .env
```

### 3. Run Diagnostic Verification
```bash
npm run check          # Validates code syntax and import graph across 80+ files
npm run verify:env     # Checks environment variable integrity
npm run smoke          # Executes automated server boot smoke test
```

### 4. Seed Demo Data (Optional)
```bash
npm run seed:demo
```

### 5. Start Development Server
```bash
npm run dev
```

---

## 🤖 Multi-Provider AI Architecture (Gemini Default)

All AI interactions flow through `src/services/ai/ai.service.js` with dynamic failover:

```text
[Request] ──► Google Gemini API (Primary)
                  │ (If error / rate limit)
                  ▼
              OpenAI / Grok / OpenRouter (Fallback)
```

Set your primary provider in `.env`:
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

---

## 📊 Health Check Endpoint

- **Endpoint**: `GET /health` or `GET /api/v1/health`
- **Auth**: None
- **Sample Output**:
```json
{
  "success": true,
  "message": "EV AI API is operational",
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2026-08-06T00:30:00.000Z",
    "uptime": 142.8,
    "database": { "connected": true, "dialect": "mysql" },
    "supabase": { "configured": true, "connected": true },
    "ai": { "provider": "gemini", "geminiConfigured": true }
  }
}
```

---

## 🔒 Security Hardening

- **JWT Expiration**: 15m access tokens, 7d refresh tokens with automatic rotation.
- **Password Hashing**: Salted bcrypt (12 rounds).
- **Helmet Headers**: Disables `X-Powered-By`, enables HSTS, frameguard, and CSP defenses.
- **SQL Injection Defense**: Parameterized queries via ORM and Supabase query builder.

---

## 🌐 Deployment (Render)

Deploy seamlessly to Render using `render.yaml`:
1. Connect your GitHub repository `https://github.com/ToshitSai/EV`.
2. Select **New Blueprint Instance** in Render.
3. Configure `GEMINI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY`.

---

## 📄 License

MIT © EV AI Team
