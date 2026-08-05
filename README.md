# EV AI (Evolution Vector) Backend

EV AI is a personalized AI career navigator for technology roles. This backend exposes a JSON-only, versioned REST API for authentication, onboarding, dashboard data, AI chat, recommendations, resume analysis, GitHub analysis, learning tracking, feedback, analytics, notifications, and achievements.

## Stack

- Node.js, Express.js
- MySQL with Sequelize ORM and migrations
- JWT access and refresh tokens
- bcrypt password hashing
- express-validator validation
- OpenAI + Grok through the official `openai` SDK
- helmet, cors, rate limiting, morgan, cookie-parser
- multer uploads
- nodemailer reset-password email
- axios GitHub API integration

## Folder Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
      ai/
    utils/
    prompts/
    validators/
    database/
      migrations/
      seeders/
    constants/
    helpers/
    jobs/
  uploads/
  logs/
  src/server.js
  src/app.js
  .env.example
```

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

The API listens on `PORT` and exposes `GET /health`.

Useful diagnostics:

```bash
npm run check
npm run verify:env
npm run verify:external
npm run db:status
npm run smoke
```

`npm run smoke` starts the API briefly and calls `/health`. In development, if MySQL is not running, the API stays alive and `/health` returns `503` with a clear database error instead of letting nodemon crash-loop. In production, startup fails fast when the database cannot connect.

## Environment Variables

See `.env.example`. Required production secrets:

- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `COOKIE_SECRET`
- `OPENAI_API_KEY` and/or `GROK_API_KEY`
- `DB_*`
- `SMTP_*` for password reset email

Secrets are read only on the backend and are never returned by the API.

## Database

Run migrations with:

```bash
npm run db:migrate
```

This project uses MySQL through Sequelize only. It does not use MongoDB or Mongoose. Before running migrations, make sure a MySQL server is reachable using the `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` values in `.env`.

The `users` table contains profile and onboarding fields directly. `skills` and `interests` use MySQL JSON columns for hackathon speed; they can be normalized into join tables later if strict relational integrity is needed.

AI recommendations are stored in `recommendations`. User portfolio projects are stored separately in `projects` and should only contain projects explicitly added by the user.

## AI Provider Layer

All AI features call `src/services/ai/ai.service.js`.

- `AI_PROVIDER=openai` or `AI_PROVIDER=grok` selects the default.
- A service can pass `{ provider: "openai" | "grok" }` to override per request.
- Grok is called through the OpenAI SDK with `GROK_BASE_URL`.
- If the selected provider fails, the service retries once with the other provider and logs which provider served the response.

## Response Format

Success:

```json
{ "success": true, "message": "Success message", "data": {} }
```

Error:

```json
{ "success": false, "message": "Meaningful error", "errors": [] }
```

Validation errors are returned in `errors`.

## API Documentation

All routes are prefixed with `/api/v1`.

### Auth

| Method | Route | Auth | Body |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | `name`, `email`, `password` |
| POST | `/auth/login` | No | `email`, `password` |
| POST | `/auth/logout` | No | optional `refreshToken` if not using cookie |
| POST | `/auth/refresh` | No | optional `refreshToken` if not using cookie |
| POST | `/auth/forgot-password` | No | `email` |
| POST | `/auth/reset-password` | No | `token`, `password` |
| GET | `/auth/me` | Yes | none |
| PUT | `/auth/change-password` | Yes | `currentPassword`, `newPassword` |

### Profile

| Method | Route | Auth | Body |
| --- | --- | --- | --- |
| POST | `/profile/onboarding` | Yes | profile fields, required `profession`, `careerGoal` |
| GET | `/profile` | Yes | none |
| PUT | `/profile` | Yes | editable profile fields |

### Users

| Method | Route | Auth | Body |
| --- | --- | --- | --- |
| GET | `/users/me` | Yes | none |
| PUT | `/users/me` | Yes | editable account fields |

### Dashboard

| Method | Route | Auth |
| --- | --- | --- |
| GET | `/dashboard` | Yes |

Returns welcome message, current roadmap, today's tasks, weekly progress, skill progress, recommendations, resume score, GitHub suggestions, AI insights, chart data, notifications, and upcoming goals.

### Chat

| Method | Route | Auth | Body |
| --- | --- | --- | --- |
| POST | `/chat` | Yes | `message`, optional `provider` |
| GET | `/chat/history` | Yes | none |

Every chat call includes user profile, prior conversation, roadmap, completed tasks, and skill level in the AI prompt.

### AI

| Method | Route | Auth | Body |
| --- | --- | --- | --- |
| GET | `/ai/status` | Yes | none |
| POST | `/ai/generate` | Yes | `prompt`, optional `provider` |

### Recommendations

| Method | Route | Auth |
| --- | --- | --- |
| GET | `/recommendations?type=project` | Yes |
| POST | `/recommendations/regenerate` | Yes |

Recommendations include projects, courses, internships, resources, books, repos, interview questions, certifications, and roadmaps as typed records.

### Resume

| Method | Route | Auth | Body |
| --- | --- | --- | --- |
| POST | `/resume/analyze` | Yes | multipart field `resume` |
| GET | `/resume/history` | Yes | none |

Returns score, strengths, weaknesses, ATS suggestions, missing skills, projects to add, and certifications.

### GitHub

| Method | Route | Auth | Body |
| --- | --- | --- | --- |
| POST | `/github/analyze` | Yes | `username` |
| GET | `/github/history` | Yes | none |

Uses GitHub REST API through axios, then sends repo context to the AI provider.

### Learning Tracker

| Method | Route | Auth | Body |
| --- | --- | --- | --- |
| POST | `/tasks` | Yes | `title`, optional task fields |
| GET | `/tasks` | Yes | none |
| PUT | `/tasks/:id/complete` | Yes | optional `hoursSpent` |
| DELETE | `/tasks/:id` | Yes | none |

### Feedback

| Method | Route | Auth | Body |
| --- | --- | --- | --- |
| POST | `/feedback/like/:recommendationId` | Yes | none |
| POST | `/feedback/dislike/:recommendationId` | Yes | none |
| POST | `/feedback/rate-ai-response` | Yes | `rating`, optional `comment`, `metadata` |
| POST | `/feedback` | Yes | `type`, optional `rating`, `comment`, `metadata` |

### Analytics

| Method | Route | Auth |
| --- | --- | --- |
| GET | `/analytics/weekly-progress` | Yes |
| GET | `/analytics/monthly-progress` | Yes |
| GET | `/analytics/learning-hours` | Yes |
| GET | `/analytics/skills-growth` | Yes |
| GET | `/analytics/roadmap-completion` | Yes |
| GET | `/analytics/category-distribution` | Yes |

Analytics endpoints are read-only aggregations over learning tracker and roadmap data.

### Notifications & Achievements

| Method | Route | Auth |
| --- | --- | --- |
| GET | `/notifications` | Yes |
| PUT | `/notifications/:id/read` | Yes |
| GET | `/achievements` | Yes |

## Deployment

This backend is env-driven and deployable on Render with a managed MySQL database. Set all `.env.example` values in the Render dashboard, run migrations during release, and expose only the API service. CORS should point to the deployed frontend URL through `CLIENT_URL`.

## OpenAPI

The route surface is documented in `docs/openapi.json`. Keep it in sync with `src/routes` whenever endpoints are added or renamed.

## Future Scope

- Normalize skills/interests into join tables.
- Add background jobs for recommendation refreshes.
- Add OpenAPI generation.
- Add Redis-backed rate limiting for multi-instance deployments.
- Add test suites for auth, AI fallback, and analytics.

## License

MIT
