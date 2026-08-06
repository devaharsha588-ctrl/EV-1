# EV AI (Evolution Vector) — API Reference Manual

Complete REST API documentation for the EV AI Backend.

---

## Base URLs
- Local: `http://localhost:5000/api/v1`
- Production: `https://ev-ai-backend.onrender.com/api/v1`

---

## Public & System Endpoints

### Health Check
- **Method**: `GET`
- **URL**: `/health` (also available at `/api/v1/health`)
- **Auth**: None
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "EV AI API is operational",
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2026-08-06T00:30:00.000Z",
    "uptime": 120.4,
    "database": { "connected": true, "dialect": "mysql" },
    "supabase": { "configured": true, "connected": true },
    "ai": { "provider": "gemini", "geminiConfigured": true }
  }
}
```

---

## Authentication Endpoints (`/auth`)

### Register
- **Method**: `POST`
- **URL**: `/api/v1/auth/register`
- **Body**:
```json
{
  "name": "Alex Rivera",
  "email": "alex@example.com",
  "password": "Password123!",
  "profession": "Full Stack Engineer"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": 1, "name": "Alex Rivera", "email": "alex@example.com" },
    "tokens": { "accessToken": "...", "refreshToken": "..." }
  }
}
```

### Login
- **Method**: `POST`
- **URL**: `/api/v1/auth/login`
- **Body**: `{ "email": "alex@example.com", "password": "Password123!" }`

### Logout
- **Method**: `POST`
- **URL**: `/api/v1/auth/logout`
- **Auth**: Bearer Token

---

## AI & Career Mentor Endpoints (`/ai`, `/chat`)

### Send Chat Prompt
- **Method**: `POST`
- **URL**: `/api/v1/chat`
- **Auth**: Bearer Token
- **Body**: `{ "message": "Give me top 3 tips for technical interviews", "provider": "gemini" }`

### Get Chat History
- **Method**: `GET`
- **URL**: `/api/v1/chat/history`
- **Auth**: Bearer Token

---

## Roadmap Endpoints (`/roadmap`)

### Get User Roadmaps
- **Method**: `GET`
- **URL**: `/api/v1/roadmap`
- **Auth**: Bearer Token

### Synthesize AI Roadmap
- **Method**: `POST`
- **URL**: `/api/v1/roadmap/generate`
- **Auth**: Bearer Token

---

## Analytics Endpoints (`/analytics`)

### Weekly Learning Progress
- **Method**: `GET`
- **URL**: `/api/v1/analytics/weekly-progress`
- **Auth**: Bearer Token

---

## Error Codes Reference
- `400 Bad Request` — Validation error / missing parameters.
- `401 Unauthorized` — Invalid or expired JWT token.
- `403 Forbidden` — Insufficient role / permission.
- `404 Not Found` — Resource or route does not exist.
- `429 Too Many Requests` — Rate limit exceeded.
- `503 Service Unavailable` — AI or database provider unavailable.
