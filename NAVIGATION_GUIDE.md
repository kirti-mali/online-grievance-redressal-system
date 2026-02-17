# Navigation Guide - Online Grievance Redressal System

## 🌐 Public Pages (No Login Required)

### 1. Home Page
- **URL**: `http://localhost:3000/`
- **Features**: 
  - Hero section with call-to-action
  - Step-by-step guide (4 steps)
  - 8 powerful features showcase
  - Role-based information
  - Statistics and impact
  - Beautiful animations

### 2. About Page
- **URL**: `http://localhost:3000/about`
- **Features**:
  - Mission and Vision
  - Why Choose Us
  - Our Impact statistics
  - How We Work process
  - Core Values

### 3. Contact Page
- **URL**: `http://localhost:3000/contact`
- **Features**:
  - Contact form
  - Email, Phone, Address info
  - Working hours
  - FAQ section

### 4. Register Page
- **URL**: `http://localhost:3000/register`
- **Features**:
  - User registration form
  - Role selection (Citizen/Staff/Admin)
  - Auto-login after registration

### 5. Login Page
- **URL**: `http://localhost:3000/login`
- **Features**:
  - User authentication
  - Remember me option
  - Forgot password link

---

## 👤 Citizen Dashboard (Role: citizen)

### Dashboard
- **URL**: `http://localhost:3000/citizen/dashboard`
- **Features**: Overview, statistics, recent complaints

### Submit Complaint
- **URL**: `http://localhost:3000/citizen/submit-complaint`
- **Features**:
  - Complaint form with title, description
  - Category selection
  - Priority level (Low/Medium/High)
  - File attachments
  - Form validation

### My Complaints
- **URL**: `http://localhost:3000/citizen/my-grievances`
- **Features**:
  - List of all user complaints
  - Filter by status
  - Search functionality
  - Sort options

### Complaint Details
- **URL**: `http://localhost:3000/citizen/grievance/:id`
- **Features**:
  - Full complaint details
  - Status history
  - Comments section
  - Document attachments
  - Resolution information

### Track Complaint
- **URL**: `http://localhost:3000/citizen/track`
- **Features**: Real-time tracking of complaint status

### Profile
- **URL**: `http://localhost:3000/profile`
- **Features**: View and edit user profile

---

## 👷 Staff Dashboard (Role: staff)

### Dashboard
- **URL**: `http://localhost:3000/staff/dashboard`
- **Features**: Assigned complaints, statistics, pending tasks

### My Tasks (Grievances)
- **URL**: `http://localhost:3000/staff/grievances`
- **Features**:
  - View assigned complaints
  - Update status
  - Add resolution notes
  - Manage workload

### Resolution History
- **URL**: `http://localhost:3000/staff/resolutions`
- **Features**: History of resolved complaints

### Performance
- **URL**: `http://localhost:3000/staff/performance`
- **Features**: Performance metrics and statistics

---

## 🔑 Admin Dashboard (Role: admin)

### Dashboard
- **URL**: `http://localhost:3000/admin/dashboard`
- **Features**: System overview, all statistics, analytics

### Manage Users
- **URL**: `http://localhost:3000/admin/users`
- **Features**:
  - View all users
  - Add/Edit/Delete users
  - Assign roles
  - User management

### Manage Grievances
- **URL**: `http://localhost:3000/admin/grievances`
- **Features**:
  - View all complaints
  - Assign to staff
  - Update status
  - Bulk operations

### Manage Categories
- **URL**: `http://localhost:3000/admin/categories`
- **Features**:
  - Add/Edit/Delete categories
  - Category management

### Reports
- **URL**: `http://localhost:3000/admin/reports`
- **Features**:
  - Generate reports
  - Analytics dashboard
  - Export data

### Settings
- **URL**: `http://localhost:3000/admin/settings`
- **Features**: System configuration and settings

---

## 🎨 Navigation Structure

### Header Navigation (Not Logged In)
- Home
- About
- Contact
- Login
- Register

### Header Navigation (Logged In - Citizen)
- Dashboard
- File Complaint
- Profile (dropdown)
- Logout (dropdown)

### Header Navigation (Logged In - Staff)
- Dashboard
- My Tasks
- Profile (dropdown)
- Logout (dropdown)

### Header Navigation (Logged In - Admin)
- Dashboard
- Users
- Grievances
- Categories
- Profile (dropdown)
- Logout (dropdown)

---

## 🚀 Quick Access URLs

**Main Application**: `http://localhost:3000`
**Backend API**: `http://localhost:5001/api`

### Test Accounts (if using mock database)
- **Citizen**: Register a new account with role "citizen"
- **Staff**: Register a new account with role "staff"
- **Admin**: Register a new account with role "admin"

---

## ✨ Key Features Available

1. ✅ User Registration & Login
2. ✅ Submit Complaints with attachments
3. ✅ Track complaint status
4. ✅ Comments & Discussion
5. ✅ Escalation System
6. ✅ Feedback & Ratings
7. ✅ Smart Notifications
8. ✅ Document Management
9. ✅ Status History
10. ✅ Admin Management Panel
11. ✅ Staff Assignment
12. ✅ Real-time Updates

---

## 📱 Responsive Design
All pages are fully responsive and work on:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px)

---

## 🎯 Getting Started

1. Open `http://localhost:3000`
2. Click "Register" to create an account
3. Choose your role (Citizen/Staff/Admin)
4. Login with your credentials
5. Start using the system!

**For Citizens**: Submit complaints, track status, provide feedback
**For Staff**: View assigned tasks, update status, resolve complaints
**For Admin**: Manage users, assign complaints, view reports
