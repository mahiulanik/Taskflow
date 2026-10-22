# TaskFlow

> A full-stack task management application with secure user accounts, personal task tracking, status-based workflows, searchable dashboards, profile management, OTP-based password recovery, and a responsive light/dark interface.

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Frontend Routes](#frontend-routes)
- [REST API Reference](#rest-api-reference)
- [Database Schema](#database-schema)
- [Authentication and Authorization](#authentication-and-authorization)
- [Task Management Workflow](#task-management-workflow)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Deployment Notes](#deployment-notes)
- [Implementation Notes and Limitations](#implementation-notes-and-limitations)
- [Author and License](#author-and-license)

## Overview

TaskFlow is a full-stack personal task management application built with a React/Vite frontend and an Express/MongoDB backend. Registered users can create and manage their own tasks, follow task status, search and organize their task list, and manage their accounts. Authentication and task ownership checks are enforced by backend middleware and database queries.

The codebase separates Express routes, controllers, services, MongoDB/Mongoose models, and configuration. The frontend organizes API communication, context providers, reusable components, and pages into dedicated directories.

## Core Features

### Task Dashboard

- Create, view, edit, and delete personal tasks.
- Track tasks with **In Progress**, **Completed**, and **Cancelled** statuses.
- Task cards and detailed task modal views.
- Status counts and status-based dashboard filtering.
- Search tasks, sort results, and paginate the filtered task list.
- User-specific task access: backend queries scope records to the authenticated user.
- Responsive dashboard with sidebar navigation.

### User Accounts

- Register and sign in with email and password.
- JWT-based authentication and protected frontend routes.
- Profile viewing and updates.
- Change password using the current password.
- Email-based password recovery using a six-digit OTP.
- Delete an account and its associated tasks.
- Guest-only access for authentication and recovery pages.

### User Experience and Security

- Light/dark theme toggle, saved in local storage and initialized from the operating-system preference.
- Centralized Axios client with token injection.
- Password hashing with bcryptjs.
- Helmet, HPP, CORS, and global/auth-specific request rate limiting.
- Mongoose schema validation and basic registration/password validation.
- Health endpoint for deployment monitoring.

## Architecture

```text
                  Browser / Authenticated User
                             |
                 React 19 + Vite + Tailwind
                             |
                React Router + Context API
                  |                    |
              Auth/Theme             Axios
               Context          (JWT header)
                                      |
                                REST API /api
                                      |
                                Express 5
                                      |
                     Routes -> Controllers -> Services
                         |                         |
                   Auth middleware          Mongoose models
                         |                         |
                    JWT verify                 MongoDB
                                                   |
                                            users / tasks

                         SMTP / Nodemailer
                                  |
                         Password reset OTP
```

Backend conventions: `routes/` registers endpoints, `controllers/` handles HTTP requests, `services/` implements business logic, `models/` defines Mongoose schemas, `middlewares/` enforces authentication and rate limits, and `config/` contains token and email utilities.

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite 8, JavaScript (JSX) |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| HTTP client | Axios |
| State | React Context API, React hooks |
| Backend | Node.js, Express 5 (ES modules) |
| Database | MongoDB with Mongoose 9 |
| Authentication | JSON Web Tokens, bcryptjs |
| Email | Nodemailer, SMTP |
| Validation | Mongoose validation, validator.js |
| Security | Helmet, HPP, CORS, express-rate-limit |
| Tooling | Oxlint, Vite development server |

## Project Structure

```text
Taskflow/
├── backend/
│   ├── app.js                       # Express setup, MongoDB connection, health check
│   ├── app/
│   │   ├── config/
│   │   │   ├── emailSending.js      # SMTP/Nodemailer utility
│   │   │   └── token.js             # JWT signing and verification
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   ├── taskModel.js
│   │   │   └── userModel.js
│   │   └── services/
│   │       ├── authService.js
│   │       └── taskService.js
│   ├── routes/
│   │   └── api.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js             # Axios client and JWT header interceptor
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskDetailModal.jsx
│   │   │   └── TaskModal.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── VerifyOTP.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
├── LICENSE
└── README.md
```

## Frontend Routes

The routes below are defined in `frontend/src/App.jsx`.

| Path | Page | Access |
| --- | --- | --- |
| `/` | Task dashboard | Authenticated |
| `/profile` | Account profile | Authenticated |
| `/login` | Login | Guest only |
| `/register` | Registration | Guest only |
| `/forgot-password` | Request recovery OTP | Guest only |
| `/verify-otp` | Verify recovery OTP | Guest only |
| `/reset-password` | Reset password | Guest only |
| `*` | Redirect to `/` | Fallback |

`ProtectedRoute` redirects unauthenticated users to `/login`. `GuestRoute` redirects signed-in users to the dashboard. These frontend guards improve navigation; backend authentication is the security boundary.

## REST API Reference

All API routes are registered under `/api` in `backend/routes/api.js`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/register` | Public | Register an account |
| POST | `/api/login` | Public, auth-rate-limited | Authenticate and return JWT |
| POST | `/api/verify-email` | Public, auth-rate-limited | Generate and send recovery OTP |
| POST | `/api/verify-otp` | Public, auth-rate-limited | Check submitted OTP |
| POST | `/api/reset-password` | Public, auth-rate-limited | Reset password with email and OTP |
| GET | `/api/profile` | Authenticated | Read current user profile |
| PUT | `/api/profile` | Authenticated | Update profile |
| PUT | `/api/change-password` | Authenticated, auth-rate-limited | Change current password |
| DELETE | `/api/account` | Authenticated | Delete user account and tasks |
| POST | `/api/tasks` | Authenticated | Create task |
| GET | `/api/tasks` | Authenticated | Retrieve user's tasks |
| PUT | `/api/tasks/:id` | Authenticated | Update owned task |
| DELETE | `/api/tasks/:id` | Authenticated | Delete owned task |

**Additional endpoint:** `GET /health` returns `{ "status": "OK", "uptime": ... }` and is not under `/api`.

### Example request payloads

**Register** — `POST /api/register`

```json
{
  "email": "user@example.com",
  "firstName": "Alex",
  "lastName": "Smith",
  "mobile": "+15551234567",
  "password": "example123"
}
```

**Login** — `POST /api/login`

```json
{ "email": "user@example.com", "password": "example123" }
```

**Create task** — `POST /api/tasks`

```json
{
  "title": "Complete documentation",
  "description": "Write the TaskFlow README",
  "status": "In Progress"
}
```

**Update task** — `PUT /api/tasks/:id` currently expects `title`, `description`, and `status` together; it is not implemented as a partial PATCH.

**Reset password** — `POST /api/reset-password`

```json
{ "email": "user@example.com", "otp": "123456", "password": "newpass123" }
```

### Authentication header

The frontend sends the raw JWT in the `authorization` header:

```http
authorization: <JWT_TOKEN>
```

**Important:** The current backend middleware passes this header directly to `jwt.verify()`. It does **not** parse a `Bearer <token>` prefix. API clients must match this implementation unless the middleware is changed.

## Database Schema

TaskFlow uses two Mongoose models.

### `users`

| Field | Type | Notes |
| --- | --- | --- |
| `_id` | ObjectId | MongoDB identifier |
| `email` | String | Required, unique, normalized lowercase |
| `firstName` | String | Required |
| `lastName` | String | Required |
| `mobile` | String | Required, unique |
| `password` | String | Required; stores bcrypt hash |
| `otp` | String | Recovery code, default `"0"` |
| `otpExpiresAt` | Date | Recovery code expiry |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps |

### `tasks`

| Field | Type | Notes |
| --- | --- | --- |
| `_id` | ObjectId | MongoDB identifier |
| `user_id` | ObjectId | Required, indexed; references `users` |
| `title` | String | Required, trimmed |
| `description` | String | Required, trimmed |
| `status` | String | Required; `In Progress`, `Completed`, `Cancelled` |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps |

Each task belongs to a user. The backend scopes task reads, updates, and deletes by `user_id`; deleting an account removes that user's tasks first.

## Authentication and Authorization

1. A new user registers; the backend validates email, mobile number, and password and hashes the password with bcryptjs.
2. Login verifies credentials and returns an HS256 JWT containing the user's email and ID.
3. The token currently expires after **30 days**, as configured in `backend/app/config/token.js`.
4. The frontend stores the token in `localStorage` and adds it to authenticated Axios requests.
5. The auth middleware verifies the JWT and attaches the authenticated identity to `req.user`.
6. Profile and task endpoints use that identity rather than accepting a user ID from the client.

### Password recovery

1. `POST /api/verify-email` creates a six-digit OTP with a **five-minute** expiry and sends it by SMTP.
2. `POST /api/verify-otp` validates the OTP and expiry.
3. `POST /api/reset-password` rechecks the OTP, hashes the new password, and clears the OTP fields.

The OTP is currently stored as plaintext in the user document; hashing OTPs and limiting verification attempts are recommended hardening improvements. The mail helper catches send failures internally, so a successful API response alone does not prove delivery.

## Task Management Workflow

- **Create:** Authenticated user submits title, description, and status.
- **Read:** Backend retrieves tasks filtered by the authenticated user's `user_id`.
- **Organize:** The React dashboard performs search, status filtering, sorting, and pagination in the browser after fetching tasks.
- **Update:** Backend matches both task ID and authenticated user ID before updating.
- **Delete:** Backend matches both task ID and authenticated user ID before deleting.

Client-side pagination is suitable for smaller personal task lists; large datasets would benefit from server-side pagination and indexed filtering.

## Environment Variables

Create environment files from the provided examples. Never commit real credentials.

### Backend — `backend/.env`

```env
# SERVER
PORT=3000
NODE_ENV=development

# MONGODB
MONGO_URI=mongodb://localhost:27017/taskflow

# FRONTEND ORIGIN / CORS
CLIENT_URL=http://localhost:5173

# JWT
JWT_SECRET=replace_with_a_long_random_secret

# SMTP / EMAIL
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=/api
```

The included `frontend/.env.example` uses `http://localhost:3000/api`, which also works locally. Using `/api` in development takes advantage of the Vite proxy defined in `frontend/vite.config.js`. For separately deployed frontend and backend services, set `VITE_API_URL` to the complete deployed API URL.

Only frontend variables prefixed with `VITE_` are exposed to the browser. Never put JWT or SMTP secrets in frontend environment variables.

## Local Development

### Prerequisites

- Node.js compatible with Vite 8 (Node.js **20.19+ or 22.12+**; a current supported LTS version is recommended).
- npm.
- Local MongoDB or MongoDB Atlas.
- SMTP credentials for testing email recovery.

### 1. Clone the repository

```bash
git clone <YOUR_TASKFLOW_REPOSITORY_URL>
cd Taskflow
```

### 2. Start the backend

```bash
cd backend
npm install
cp .env.example .env
# Configure the values in .env
npm run dev
```

The Express server defaults to `http://localhost:3000`. Check `http://localhost:3000/health` for a basic health response.

### 3. Start the frontend

In a separate terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Vite typically serves the app at `http://localhost:5173`.

On Windows Command Prompt, use `copy .env.example .env` instead of `cp`.

### Available scripts

| Directory | Command | Action |
| --- | --- | --- |
| `backend` | `npm run dev` | Start Node with watch mode |
| `backend` | `npm start` | Start Express server |
| `backend` | `npm test` | Placeholder; no automated test suite configured |
| `frontend` | `npm run dev` | Start Vite dev server |
| `frontend` | `npm run build` | Create production frontend bundle |
| `frontend` | `npm run preview` | Preview production build locally |
| `frontend` | `npm run lint` | Run Oxlint |

## Deployment Notes

### Frontend

- Build the `frontend/` directory with `npm run build` and deploy `dist/` to a static frontend host.
- Set `VITE_API_URL` to the production backend API base URL, including `/api`.
- Configure SPA fallback rewrites so routes such as `/profile` and `/reset-password` work on refresh.
- Ensure the frontend origin matches the backend `CLIENT_URL` setting.

### Backend

- Deploy `backend/` as a Node.js service with `npm start`.
- Configure `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and SMTP variables.
- Use HTTPS for production authentication and API requests.
- Monitor `GET /health` and check MongoDB connection logs.
- Ensure network access to MongoDB and the configured SMTP provider.
- Set a production-safe proxy and rate-limit configuration appropriate for the hosting platform.

## Implementation Notes and Limitations

This README is based on the supplied source archive, not a completed end-to-end production security or load test. Before treating TaskFlow as production-ready, consider the following:

1. **JWT lifetime:** The source uses a 30-day JWT, despite the original README claiming 24 hours. Shorter-lived access tokens and a secure refresh/revocation strategy would reduce exposure.
2. **Token storage:** The frontend stores the JWT in `localStorage`; review XSS defenses and consider an appropriate secure cookie/session design.
3. **OTP storage and delivery:** OTPs are stored in plaintext; hash them, add attempt limits, and propagate SMTP send failures so API success reflects actual delivery.
4. **Password changes and account deletion:** Existing JWTs are not centrally revoked when passwords change or accounts are deleted. Consider token invalidation/session versioning.
5. **API validation:** Some service methods assume strings are present and call `.trim()` directly. Add consistent request schemas and error handling for malformed inputs.
6. **Rate limiting:** Login and OTP endpoints use a 5-requests-per-15-minutes limiter; the global limiter allows 100 requests per 15 minutes per IP. Evaluate shared rate-limit storage when running multiple instances.
7. **Data retrieval:** The dashboard currently filters, sorts, and paginates tasks client-side. Add server-side pagination for larger task volumes.
8. **MongoDB connection:** The server starts listening independently of successful database connection. Consider awaiting the DB connection before accepting requests.
9. **Automated tests:** The backend test script is a placeholder; add authentication, task-ownership, recovery, and API integration tests.
10. **Account deletion consistency:** Deleting tasks and then the user happens in separate database operations; consider a transaction if atomic deletion is required.

These are code-review considerations, not claims that the deployed application has been exploited.

## Author and License

**Mahiul Hasan Anik**  
GitHub: [@mahiulanik](https://github.com/mahiulanik)

The repository includes an [ISC License](LICENSE).
