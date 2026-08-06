# EV AI (Evolution Vector) — Frontend Integration Guide

Welcome Frontend Engineers! This document provides all API contracts, authentication flows, data structures, and integration examples needed to connect any React, Next.js, or mobile frontend to the EV AI backend seamlessly.

---

## 1. Core Configuration

* **Base URL (Local)**: `http://localhost:5000/api/v1`
* **Base URL (Production)**: `https://ev-ai-backend.onrender.com/api/v1` (or your Render URL)
* **Health Check**: `GET /health` (Unauthenticated)

### Standard Headers
```http
Content-Type: application/json
Authorization: Bearer <access_token>
```

---

## 2. Standardized JSON Response Schema

### Success Format (`2xx`)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Format (`4xx / 5xx`)
```json
{
  "success": false,
  "message": "Human readable error summary",
  "errors": [
    { "field": "email", "message": "Valid email address is required" }
  ]
}
```

---

## 3. Authentication Flow

### Register Account
* **POST** `/auth/register`
* **Body**:
```json
{
  "name": "Alex Rivera",
  "email": "alex@example.com",
  "password": "Password123!",
  "profession": "Software Engineer"
}
```
* **Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": 1, "name": "Alex Rivera", "email": "alex@example.com" },
    "tokens": {
      "accessToken": "eyJhbGci...",
      "refreshToken": "eyJhbGci..."
    }
  }
}
```

### Login
* **POST** `/auth/login`
* **Body**:
```json
{
  "email": "alex@example.com",
  "password": "Password123!"
}
```

### Refresh Token
* **POST** `/auth/refresh`
* **Body**: `{ "refreshToken": "eyJhbGci..." }` (or via HttpOnly cookie)

---

## 4. Key Module Endpoints

### 🤖 AI & Real-Time Mentor Chat
* **GET** `/ai/status` — Returns active AI providers (Gemini, OpenAI, Grok, OpenRouter).
* **POST** `/chat` — Send prompt to personalized career mentor.
  * **Request**: `{ "message": "How do I transition into AI Engineering?", "provider": "gemini" }`
  * **Response**: `{ "success": true, "data": { "reply": "...", "provider": "gemini" } }`
* **GET** `/chat/history` — Get previous user chat threads.

### 🗺️ Roadmaps & Recommendations
* **GET** `/roadmap` — Retrieve active roadmaps and milestones.
* **POST** `/roadmap/generate` — Trigger AI to synthesize personalized roadmap based on profile & completed tasks.
* **GET** `/recommendations` — Get AI suggested projects, courses, internships, and resources.

### 📄 Resume & GitHub Portfolio Analysis
* **POST** `/resume/analyze` (Multipart form-data: `resume` file field).
* **POST** `/github/analyze` — Request: `{ "username": "ToshitSai" }`.

### 📊 Dashboard & Analytics
* **GET** `/dashboard` — Returns summary metrics, learning hours, upcoming tasks, and roadmap progress.
* **GET** `/analytics/skills-growth` — Skills radar / progression telemetry.

---

## 5. Error Handling Best Practices (Frontend)

```typescript
async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'An unexpected API error occurred');
  }

  return data.data;
}
```
