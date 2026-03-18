# 📋 Online Grievance Redressal System

A full-stack web application that allows citizens to lodge, track, and resolve complaints efficiently. Built with React (frontend) and Node.js/Express (backend) with an in-memory mock database for development.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm

### 1. Start Backend
```bash
cd backend
npm install
node server.js
```
Backend runs on **http://localhost:5000**

### 2. Start Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs on **http://localhost:3000**

> **Note:** MySQL/XAMPP is NOT required. The system uses an in-memory mock database automatically.

---

## 🏗️ Project Structure

```
online-grievance-redressal-system/
├── backend/
│   ├── config/
│   │   ├── database.js        # DB config with mock fallback
│   │   └── mockDatabase.js    # In-memory mock database
│   ├── controllers/           # Route handlers
│   ├── middleware/            # Auth, upload middleware
│   ├── models/                # Data models
│   ├── routes/                # API routes
│   ├── utils/
│   │   ├── emailService.js    # Email notifications
│   │   └── smsService.js      # SMS alerts (Twilio)
│   ├── uploads/               # Uploaded files
│   ├── .env                   # Environment variables
│   └── server.js              # Entry point
│
├── frontend/
│   └── src/
│       ├── components/        # Reusable components
│       ├── context/           # Auth context
│       ├── pages/
│       │   ├── admin/         # Admin pages
│       │   ├── citizen/       # Citizen pages
│       │   └── user/          # User profile
│       ├── services/          # API service calls
│       └── styles/            # CSS files
```

---

## ✅ Features

### Core Features
- User registration & login (JWT authentication)
- Submit complaints with file attachments
- Track complaint status in real-time
- Admin dashboard to assign & resolve complaints
- Complaint history with full audit trail
- Role-based access control (Citizen, Staff, Admin)

### Advanced Features
- 📎 File Upload — PDF, JPG, PNG, DOC, TXT (max 10MB)
- 📍 Location Selection — District, Taluk, Ward + GPS auto-detect
- 🚨 Priority Levels — Low, Medium, High, Emergency
- 📧 Email Notifications — on submission and status updates
- 📱 SMS Alerts — via Twilio (console log in dev mode)
- ⭐ Feedback & Rating — 1–5 stars after resolution
- 📊 Reports & Analytics — charts, daily/monthly reports
- 🔍 Search & Filter — by category, date, status
- 🔒 Security — bcrypt passwords, CAPTCHA, JWT
- 🔔 In-app Notifications

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| Citizen | Submit complaints, track status, upload files, rate service |
| Staff | View assigned complaints, add resolutions, update status |
| Admin | Manage users, assign complaints, view analytics, manage categories |

---

## 🗂️ Categories

Default complaint categories:
1. Education
2. Health
3. Infrastructure
4. Service
5. Complaint (General)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/categories | Get all categories |
| POST | /api/grievances | Submit complaint |
| GET | /api/grievances | Get all complaints (admin) |
| GET | /api/grievances/my | Get user's complaints |
| PUT | /api/grievances/:id/status | Update status |
| POST | /api/documents/:id | Upload file |
| POST | /api/feedback | Submit rating |
| GET | /api/notifications | Get notifications |

---

## ⚙️ Environment Variables

Create `backend/.env`:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000

# MySQL (optional - falls back to mock DB if not set)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=grievance_redressal_system
DB_PORT=3306

# Email (optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# SMS via Twilio (optional)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 🛠️ Tech Stack

**Frontend**
- React 18
- React Router v6
- Axios
- CSS3 with gradient themes

**Backend**
- Node.js + Express
- JWT authentication
- bcrypt password hashing
- Multer (file uploads)
- Nodemailer (emails)
- Twilio (SMS)
- MySQL2 / Mock DB fallback

---

## 📱 Pages

- `/` — Home page with quick complaint form
- `/login` — Login
- `/register` — Register
- `/citizen/dashboard` — Citizen dashboard
- `/citizen/submit-complaint` — Submit complaint
- `/citizen/my-grievances` — View my complaints
- `/admin/dashboard` — Admin dashboard
- `/admin/manage-grievances` — Manage all complaints
- `/admin/analytics` — Reports & analytics
- `/staff/dashboard` — Staff dashboard

---

## 🔧 Troubleshooting

**MySQL/XAMPP errors?**
Ignore them. The system works without MySQL using the built-in mock database.

**Category dropdown empty?**
Make sure the backend is running on port 5000. Check browser console for errors.

**Port already in use?**
The backend auto-retries on the next available port (5001, 5002...).

---

## 📄 License

MIT License — free to use and modify.
