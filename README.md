# TaskFlow

A full-stack task management application built with React, Vite,
Node.js, Express and MongoDB.

## Features

- JWT Authentication (24h token expiry)
- OTP-based Password Reset via Email
- Task CRUD with Status Tracking (In Progress, Completed, Cancelled)
- Task Detail Modal with Truncated Card View
- Dark/Light Theme Toggle (persists, respects OS preference)
- Search, Filter by Status, Sort, and Pagination
- Profile Management and Account Deletion
- Protected & Guest Route Guards
- Security: Helmet, HPP, CORS, Rate Limiting, Input Validation

## Tech Stack

- Frontend: React 19, Vite 8, Tailwind CSS v4, React Router v7, Axios
- Backend: Node.js, Express 5, Mongoose 9, MongoDB
- Tools: oxlint, Nodemailer, validator.js, bcryptjs

## Project Structure

```text
taskflow/
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance with interceptors
│   │   ├── components/     # Sidebar, TaskCard, TaskModal, TaskDetailModal
│   │   ├── context/        # AuthContext, ThemeContext
│   │   ├── pages/          # Dashboard, Profile, Login, Register, ForgotPassword, VerifyOTP, ResetPassword
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── config/         # JWT token, email sending
│   │   ├── controllers/    # authController, taskController
│   │   ├── middlewares/     # authMiddleware, rateLimiter
│   │   ├── models/         # userModel, taskModel
│   │   └── services/       # authService, taskService
│   ├── routes/
│   │   └── api.js
│   ├── app.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Gmail account (for OTP emails) or any SMTP provider

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/taskflow.git
cd taskflow

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

**Backend** — create `backend/.env`:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taskflow
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

**Frontend** — create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### Running the App

```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Endpoints

Base URL: `/api`

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login (rate limited: 5/15min) |
| POST | `/verify-email` | Send OTP to email |
| POST | `/verify-otp` | Verify OTP code |
| POST | `/reset-password` | Reset password with OTP |

### Protected (requires Authorization header)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get current user profile |
| PUT | `/profile` | Update profile |
| PUT | `/change-password` | Change password |
| DELETE | `/account` | Delete account and all tasks |
| POST | `/tasks` | Create a task |
| GET | `/tasks` | Get all user tasks |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## Frontend Routes

| Path | Page | Access |
|------|------|--------|
| `/login` | Login | Guest only |
| `/register` | Register | Guest only |
| `/forgot-password` | Forgot Password | Guest only |
| `/verify-otp` | Verify OTP | Guest only |
| `/reset-password` | Reset Password | Guest only |
| `/` | Dashboard | Protected |
| `/profile` | Profile | Protected |
