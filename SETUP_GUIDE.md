# SETUP GUIDE - Online Grievance Redressal System

## 🚀 Quick Start Guide

### Step 1: Database Setup
```bash
1. Open MySQL Command Line:
   mysql -u root -p

2. Run the SQL script:
   SOURCE database/schema.sql;

3. Verify:
   USE grievance_redressal_system;
   SHOW TABLES;
```

### Step 2: Backend Setup
```bash
cd backend
npm install
cp .env.example .env

# Update .env with:
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=grievance_redressal_system
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000

npm run dev
```

Backend runs on: http://localhost:5000

### Step 3: Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

## 🔐 Demo Login Credentials

### Admin Account
- Email: admin@grievance.com
- Password: admin123

### Staff Account
- Email: staff1@grievance.com
- Password: staff123

### Citizen Accounts
- Email: john@example.com
  Password: citizen123
- Email: jane@example.com
  Password: citizen123

## 📁 Project Structure

BACKEND:
- config/ - Database configuration
- controllers/ - Business logic (Auth, User, Grievance, Category, Resolution)
- middleware/ - Authentication & validation
- routes/ - API endpoints
- utils/ - Token and password utilities
- server.js - Express server

FRONTEND:
- components/ - Header, Footer, Sidebar, Pagination, LoadingSpinner
- pages/ - Login, Register, Home, Dashboard pages
- services/ - API communication
- context/ - AuthContext for state management
- styles/ - Responsive CSS
- ProtectedRoute.js - Route protection wrapper

DATABASE:
- schema.sql - Complete database schema with sample data

## 📡 Available Endpoints

AUTH:
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile

GRIEVANCES:
POST /api/grievances
GET /api/grievances
GET /api/grievances/my-grievances
GET /api/grievances/:id

CATEGORIES:
GET /api/categories
POST /api/categories (Admin)
PUT /api/categories/:id (Admin)
DELETE /api/categories/:id (Admin)

USERS:
GET /api/users (Admin)
PUT /api/users/:id (Admin)
DELETE /api/users/:id (Admin)

RESOLUTIONS:
POST /api/resolutions (Staff)
GET /api/resolutions/grievance/:id

## ✨ Key Features Implemented

✅ Role-based authentication (Admin, Staff, Citizen)
✅ JWT token-based security
✅ Password encryption (bcrypt)
✅ Protected routes with role checks
✅ Grievance management (Create, Read, Update, Assign)
✅ Category management with CRUD operations
✅ Resolution tracking system
✅ User profile management
✅ Pagination for list views
✅ Search and filter functionality
✅ Responsive mobile-friendly design
✅ Toast notifications for user feedback
✅ Loading spinners
✅ Form validation (client & server)
✅ Error handling

## 🛠️ Technology Stack

BACKEND:
- Node.js (Runtime)
- Express.js (Web Framework)
- MySQL (Database)
- JWT (Authentication)
- bcryptjs (Password Hashing)
- express-validator (Validation)

FRONTEND:
- React 18 (UI Library)
- React Router v6 (Routing)
- Axios (HTTP Client)
- Context API (State Management)
- React Toastify (Notifications)
- CSS3 (Styling)

## 📊 Database Schema

Tables Created:
1. users - User accounts
2. categories - Grievance categories
3. grievances - Grievance records
4. resolutions - Resolution notes
5. password_reset_tokens - Password reset functionality

## 🔒 Security Implemented

✅ JWT token validation
✅ Role-based route protection
✅ Password hashing with bcrypt
✅ Input validation
✅ CORS enabled
✅ SQL injection prevention
✅ Protected API endpoints

## 🎯 User Workflows

CITIZEN FLOW:
1. Register → Login → Dashboard → Raise Grievance → Track Status

STAFF FLOW:
1. Login → Staff Dashboard → View Assigned Grievances → Add Resolution

ADMIN FLOW:
1. Login → Admin Dashboard → Manage Users/Categories/Grievances

## 📱 Responsive Breakpoints

Mobile: < 480px
Tablet: 480px - 768px
Desktop: > 768px

All components are fully responsive and mobile-optimized.

## 💾 Sample Data Pre-loaded

Users:
- 1 Admin
- 2 Staff members
- 3 Citizens

Categories:
- Water Supply
- Roads & Infrastructure
- Electricity
- Sanitation
- Public Transport
- Healthcare
- Education
- Civic Amenities

Grievances:
- 5 sample grievances with various statuses

## 🐛 Common Issues & Solutions

ISSUE: Can't connect to database
SOLUTION: Verify MySQL credentials in .env

ISSUE: Port already in use
SOLUTION: Change PORT in .env or kill existing process

ISSUE: CORS error
SOLUTION: Verify FRONTEND_URL in backend .env

ISSUE: API calls failing
SOLUTION: Ensure backend is running on correct port

## 📝 Next Steps

1. Start MySQL server
2. Run database schema
3. Configure backend .env
4. Start backend (npm run dev)
5. Configure frontend
6. Start frontend (npm start)
7. Login with demo credentials

## 🎓 Learning Outcomes

This project covers:
- Full-stack web development
- REST API design
- React hooks and state management
- Database design
- Authentication & authorization
- Form handling
- Error handling
- Responsive design
- Security best practices

## 📖 Additional Documentation

For detailed information see:
- Backend documentation in backend/README.md
- Frontend documentation in frontend/README.md
- API documentation in the main README.md
- Database schema documentation in database/schema.sql

---
Happy coding! 🎉
