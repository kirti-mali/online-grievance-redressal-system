# Online Grievance Redressal System - Features Status

## ✅ Implemented Features

### 1. **Secure Authentication System**
- **Registration**: Users can create accounts with role selection (Citizen, Staff, Admin)
  - Backend: `POST /api/auth/register` with validation
  - Frontend: Register page with password confirmation
  - Security: bcryptjs password hashing, JWT tokens
  
- **Login**: Secure login with JWT token generation
  - Backend: `POST /api/auth/login` with credential verification
  - Frontend: Login page with role-based redirect
  - Storage: Tokens stored in localStorage, auto-logout on expiry
  
- **Password Reset**: Forgot password & reset functionality
  - Backend: `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`
  - Frontend: Password reset form

### 2. **Complaint/Grievance Submission**
- **Create Grievance**: Citizens can file complaints
  - Backend: `POST /api/grievances` with validation
  - Fields: Title, Description, Category, Priority
  - Frontend: Submit Complaint & Raise Grievance pages
  - Features: File upload support for documents
  
- **Categories**: Pre-defined complaint categories
  - 8 default categories included (Water, Roads, Electricity, etc.)
  - Admin can manage categories

### 3. **Complaint Status Tracking**
- **View All Grievances**: Admin/Staff can view system-wide grievances
  - Backend: `GET /api/grievances` with filters (status, category, priority)
  - Pagination support (10 items per page)
  
- **View My Grievances**: Citizens see their own filed complaints
  - Backend: `GET /api/grievances/my-grievances`
  - Pagination & sorting by latest first
  
- **Grievance Details**: Full complaint view with all metadata
  - Backend: `GET /api/grievances/:id`
  - Shows: Status, Priority, Category, Assigned Staff, Comments, Documents

- **Status History**: Tracks all status changes
  - DB Table: `grievance_status_history`
  - Records: Who changed it, When, From what status, To what status, Reason

### 4. **Admin Assignment & Resolution**
- **Assign to Staff**: Admin assigns grievances to staff members
  - Backend: `PATCH /api/grievances/:id/assign` 
  - Validates staff member exists
  - Records assignment in status history
  
- **Update Status**: Admin/Staff can change grievance status
  - Statuses: `open`, `in_progress`, `resolved`, `closed`
  - Backend: `PATCH /api/grievances/:id/status`
  - Records status change with reason
  
- **Add Resolution Notes**: Staff members document resolution actions
  - Backend: `POST /api/resolutions` (staff only)
  - Tracks which staff member added the note
  - Can update/delete own resolutions
  
- **View Resolutions**: See all resolution attempts for a grievance
  - Backend: `GET /api/resolutions/grievance/:id`

### 5. **Comments & Communication**
- **Add Comments**: Citizens and staff can comment on grievances
  - Backend: `POST /api/comments/grievance/:id`
  - Internal comments (staff-only) supported
  - Frontend: Comment section in grievance details

- **View Comments**: All comments displayed in grievance view
  - Sorted by latest first
  - Shows commenter name and timestamp

### 6. **Escalation System**
- **Escalate Grievance**: High-priority or stuck grievances can be escalated
  - Backend: `POST /api/escalations/:id` with reason
  - Escalation levels tracked
  - Status: pending, acknowledged, in_progress, resolved

### 7. **Feedback System**
- **Submit Feedback**: Citizens rate resolution (1-5 stars)
  - Backend: `POST /api/feedback/:id` (citizen only)
  - Comment field optional
  
- **View Feedback**: Staff/Admin can see citizen ratings
  - Helps improve service quality

### 8. **Document Management**
- **Upload Documents**: Citizens/Staff can upload supporting documents
  - Backend: `POST /api/documents/upload/:id` (multipart/form-data)
  - Stored in `/backend/uploads/` directory
  - File size & type validation
  
- **View Documents**: Access all documents for a grievance
  - Backend: `GET /api/documents/grievance/:id`

### 9. **Notifications**
- **Create Notifications**: System generates notifications for key events
  - Backend: `POST /api/notifications` (internal)
  - Triggered on: Assignment, Status Change, Comment Added
  
- **View Notifications**: Users see relevant updates
  - Backend: `GET /api/notifications`
  - Mark as read functionality

### 10. **Dashboard & Statistics**
- **Citizen Dashboard**: Overview of their grievances
  - Total filed, Open, In-Progress, Resolved counts
  - Quick links to file new & view all
  
- **Staff Dashboard**: View assigned workload
  - Assigned grievances list
  - View & resolve workflow
  
- **Admin Dashboard**: System-wide statistics
  - `GET /api/grievances/statistics`
  - Total grievances, breakdown by status & priority
  - Total users, staff count

### 11. **Role-Based Access Control**
- **Citizen Role**: File complaints, view own, comment, provide feedback
- **Staff Role**: View assigned, update status, add resolutions, comment
- **Admin Role**: Full access, assign grievances, manage categories, view all

---

## 🔧 Backend Tech Stack
- **Framework**: Express.js
- **Database**: MySQL with mysql2/promise
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: express-validator
- **File Upload**: multer
- **CORS**: Enabled for frontend integration

---

## 🎨 Frontend Tech Stack
- **Framework**: React.js
- **Routing**: React Router v6
- **API Client**: Axios with interceptors for JWT
- **Styling**: Custom CSS with responsive design
- **State Management**: Context API (AuthContext)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v14+ (verified: v24.11.1)
- MySQL 8.0+ running on localhost:3306
- npm or yarn

### Database Setup
```bash
# Apply schema
mysql -u root -p < database/schema.sql

# Or manually inside MySQL:
SOURCE /path/to/database/schema.sql;
```

### Backend Setup
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

---

## 📋 Default Test Credentials
After schema is applied:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@grievance.com | admin123 |
| Staff 1 | staff1@grievance.com | staff123 |
| Staff 2 | staff2@grievance.com | staff123 |
| Citizen 1 | john@example.com | citizen123 |
| Citizen 2 | jane@example.com | citizen123 |

---

## 📝 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Complete password reset
- `GET /api/auth/profile` - Get current user (protected)

### Grievances
- `POST /api/grievances` - Submit new complaint (citizen)
- `GET /api/grievances` - List all (admin), with filters
- `GET /api/grievances/my-grievances` - List user's (citizen)
- `GET /api/grievances/:id` - Get details
- `PATCH /api/grievances/:id/status` - Update status (admin/staff)
- `PATCH /api/grievances/:id/assign` - Assign to staff (admin)
- `GET /api/grievances/staff/assigned` - Staff's assigned (staff)
- `GET /api/grievances/statistics` - System stats (admin)

### Resolutions
- `POST /api/resolutions` - Add resolution notes (staff)
- `GET /api/resolutions/grievance/:id` - Get resolutions
- `PUT /api/resolutions/:id` - Update resolution (staff)
- `DELETE /api/resolutions/:id` - Delete resolution (staff)
- `GET /api/resolutions/staff/history` - Staff's history (staff)

### Comments
- `POST /api/comments/grievance/:id` - Add comment
- `GET /api/comments/grievance/:id` - Get comments

### Other
- `POST /api/escalations/:id` - Escalate grievance
- `POST /api/feedback/:id` - Submit feedback
- `POST /api/documents/upload/:id` - Upload document
- `GET /api/documents/grievance/:id` - Get documents
- `POST /api/notifications` - Create notification
- `GET /api/notifications` - Get notifications
- `GET /api/status-history/grievance/:id` - Get status history

---

## ⚠️ Known Issues & Next Steps

### Current Blockers
1. **MySQL Connection**: Server must be running on localhost:3306
   - Solution: Start MySQL service or provide connection string in .env

### Future Enhancements
- Email notifications (SMTP integration)
- File storage optimization (S3/Cloud)
- Advanced reporting & analytics
- Mobile app version
- Real-time updates (Socket.io)
- Multi-language support
- Performance optimization (caching, indexing)

---

## 🔒 Security Checklist
- ✅ Passwords hashed with bcryptjs (salt: 10)
- ✅ JWT tokens with 7-day expiry
- ✅ CORS enabled (configurable frontend URL)
- ✅ Role-based access control on all endpoints
- ✅ Input validation on all forms & API routes
- ✅ SQL injection prevention (parameterized queries)
- ⚠️ TODO: Rate limiting on auth endpoints
- ⚠️ TODO: HTTPS for production

---

## 📊 Database Schema
- **users**: User accounts with roles
- **categories**: Complaint categories
- **grievances**: Complaint records
- **grievance_comments**: Discussion threads
- **grievance_status_history**: Audit trail of changes
- **grievance_escalations**: Escalation tracking
- **grievance_feedback**: Resolution ratings
- **grievance_documents**: File attachments
- **resolutions**: Resolution notes
- **notifications**: User notifications
- **departments**: Organizational structure
- **password_reset_tokens**: Reset token management

