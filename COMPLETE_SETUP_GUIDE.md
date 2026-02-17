# Complete System Setup and Launch Guide

## Project: Online Grievance Redressal System
This guide provides step-by-step instructions to set up and launch the complete system with all new features.

---

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)
- A **Text Editor/IDE** (VS Code recommended)

Verify installation:
```bash
node --version
npm --version
mysql --version
```

---

## 🗂️ Project Structure Overview

```
online-grievance-redressal-system/
├── backend/                    # Express.js API server
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   ├── config/                # Configuration files
│   ├── controllers/           # Business logic (6 new modules)
│   ├── routes/                # API endpoints (6 new routes)
│   ├── middleware/            # Auth & validation
│   └── utils/                 # Helper functions
├── frontend/                  # React.js UI
│   ├── package.json           # Frontend dependencies
│   ├── src/
│   │   ├── App.js            # Main app with routing
│   │   ├── pages/
│   │   │   ├── citizen/      # Citizen pages (3 new)
│   │   │   ├── admin/        # Admin pages (2 new)
│   │   │   └── staff/        # Staff pages
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API service layer
│   │   ├── context/          # React context (auth)
│   │   └── styles/           # CSS files (1 new)
│   └── public/
├── database/
│   └── schema.sql             # Database schema
├── README.md                  # Project documentation
├── SETUP_GUIDE.md             # Basic setup docs
└── FRONTEND_FEATURES_GUIDE.md # This comprehensive guide
```

---

## 🗄️ Step 1: Database Setup

### 1.1 Create Database
Open MySQL and run the schema:

**Option A: Using MySQL CLI**
```bash
cd d:\online-grievance-redressal-system
mysql -u root -p < database/schema.sql
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Go to File → Open SQL Script
4. Select `database/schema.sql`
5. Execute (Ctrl + Enter)

### 1.2 Verify Database Creation
```sql
-- Connect to MySQL
mysql -u root -p

-- Check database
SHOW DATABASES;

-- Use the database
USE grievance_redressal_system;

-- Check tables
SHOW TABLES;

-- Verify tables
DESC users;
DESC grievances;
DESC categories;
-- ... etc
```

**Expected Tables:**
- ✓ users
- ✓ categories
- ✓ grievances
- ✓ resolutions
- ✓ password_reset_tokens
- ✓ grievance_comments (new)
- ✓ grievance_escalations (new)
- ✓ grievance_feedback (new)
- ✓ grievance_documents (new)
- ✓ grievance_status_history (new)
- ✓ notifications (new)
- ✓ departments (new)

---

## 🗂️ Step 2: Backend Setup

### 2.1 Navigate to Backend Directory
```bash
cd d:\online-grievance-redressal-system\backend
```

### 2.2 Install Dependencies
```bash
npm install
```

Expected packages:
- express
- mysql2
- axios
- jsonwebtoken
- bcryptjs
- dotenv
- multer (version 1.4.5-lts.1)

### 2.3 Configure Database Connection
Check `config/database.js`:

```javascript
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',           // Change if your MySQL user is different
  password: 'your_password',  // Change to your MySQL password
  database: 'grievance_redressal_system'
});
```

### 2.4 Start Backend Server
```bash
npm start
```

**Expected Output:**
```
Server running on port 5000
Database connected successfully
```

**Verify Backend:**
Open browser and visit: `http://localhost:5000/`
Should see a response (even if it's an error, means server is running)

---

## 💻 Step 3: Frontend Setup

### 3.1 Open New Terminal (Keep Backend Running)

### 3.2 Navigate to Frontend Directory
```bash
cd d:\online-grievance-redressal-system\frontend
```

### 3.3 Install Dependencies
```bash
npm install
```

Expected packages:
- react
- react-router-dom
- axios
- react-toastify
- react-dom

### 3.4 Configure API Connection
Check `src/services/api.js`:

```javascript
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api'
});
```

### 3.5 Start Frontend Server
```bash
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view the app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## 🚀 Step 4: Access the Application

### 4.1 Open in Browser
Navigate to: **http://localhost:3000**

### 4.2 Register New User
1. Click "Register"
2. Fill in details:
   - Name: Your Name
   - Email: your@email.com
   - Password: Your Password
   - Phone: Your Phone (optional)
3. Click "Register"
4. You'll be redirected to login

### 4.3 Login
1. Email: your@email.com
2. Password: Your Password
3. Click "Login"

---

## 📱 Step 5: Test Features

### For Citizen (Regular User)

#### Submit a Complaint
1. Navigate to: **Citizen Dashboard**
2. Click "Submit Complaint" or go to `/citizen/submit-complaint`
3. Fill details:
   - Title: Your complaint title
   - Description: Detailed description
   - Category: Select from dropdown
   - Priority: Select priority level
   - Attachments: (Optional) Upload files
4. Click "Submit"
5. Success message appears

#### Track Complaint
1. Go to: `/citizen/my-complaints` (or "My Complaints" link)
2. Click on any complaint to view details
3. View status timeline, comments, and documents
4. Add comments if needed

### For Staff Member

#### View Assigned Complaints
1. Navigate to: **Staff Dashboard**
2. View complaints assigned to you
3. Click on complaint to view details
4. Add resolution notes
5. Update status to "Resolved"

### For Admin

#### Manage All Complaints
1. Navigate to: **Admin Dashboard**
2. Go to: `/admin/manage-complaints`
3. View all complaints in table format
4. Filter by status, priority, or category
5. Click "Assign" to assign to staff
6. Click "Update Status" to change status
7. Save changes

#### View History & Analytics
1. Go to: `/admin/complaint-history`
2. View statistics:
   - Total complaints
   - Open, In Progress, Resolved counts
   - Average resolution time
   - Resolution rate
3. Filter by timeframe (All, Week, Month)
4. View activity timeline

---

## 🔗 System URLs Reference

### Frontend URLs
- **Home:** http://localhost:3000
- **Login:** http://localhost:3000/login
- **Register:** http://localhost:3000/register

### Citizen URLs
- **Dashboard:** http://localhost:3000/citizen/dashboard
- **Submit Complaint:** http://localhost:3000/citizen/submit-complaint
- **View Complaints:** http://localhost:3000/citizen/my-complaints
- **Track Complaint:** http://localhost:3000/citizen/complaint/:id

### Admin URLs
- **Dashboard:** http://localhost:3000/admin/dashboard
- **Manage Complaints:** http://localhost:3000/admin/manage-complaints
- **History & Analytics:** http://localhost:3000/admin/complaint-history

### Staff URLs
- **Dashboard:** http://localhost:3000/staff/dashboard
- **Assigned Grievances:** http://localhost:3000/staff/grievances

### Backend API
- **Base URL:** http://localhost:5000/api
- **Grievances:** /grievances
- **Comments:** /comments
- **Documents:** /documents
- **Status History:** /status-history
- **Notifications:** /notifications
- **Categories:** /categories
- **Escalations:** /escalations
- **Feedback:** /feedback

---

## 📊 Test Data

### Admin Account (for testing)
- Email: admin@grievance.gov
- Password: Admin@123
- Role: admin

### Test Categories (Insert in MySQL)
```sql
USE grievance_redressal_system;

INSERT INTO categories (name, description) VALUES
('Water Supply', 'Issues related to water supply and quality'),
('Electricity', 'Power outage and electricity issues'),
('Roads & Infrastructure', 'Damaged roads and infrastructure'),
('Waste Management', 'Garbage collection and waste issues'),
('Healthcare', 'Hospital and health service complaints'),
('Education', 'School and education-related issues');
```

### Sample Citizen Account
- Email: citizen@example.com
- Password: Citizen@123
- Role: citizen

---

## ⚙️ Troubleshooting

### Issue: Backend not connecting to database
**Solution:**
- Check MySQL is running
- Verify database credentials in `config/database.js`
- Ensure schema.sql was executed
- Check port 3306 is not blocked

### Issue: Frontend showing blank page
**Solution:**
- Check browser console for errors (F12)
- Ensure backend is running on :5000
- Check npm start completed without errors
- Clear browser cache (Ctrl + Shift + Delete)

### Issue: Cannot login
**Solution:**
- Verify user exists in database
- Check password is correct
- Ensure backend is running
- Check JWT token in localStorage (F12 → Application)

### Issue: Complaint submission fails
**Solution:**
- Check file size is under 10MB
- Verify category is selected
- Check internet connection
- Inspect API response in browser console

### Issue: Port already in use
**Solution:**
- For port 5000: `npx kill-port 5000`
- For port 3000: `npx kill-port 3000`
- Or change port in server.js and App.js

### Issue: "Cannot POST /api/..." error
**Solution:**
- Check backend routes are implemented
- Verify request method (GET/POST/PUT/DELETE)
- Check API path is correct
- Inspect request in browser network tab (F12)

---

## 🔒 Security Notes

### Important:
1. **Change default admin password** after first login
2. **Use strong passwords** (8+ chars, mixed case, numbers)
3. **Keep JWT_SECRET secure** in production
4. **Enable HTTPS** in production
5. **Set environment variables** for sensitive data
6. **Implement rate limiting** for login attempts
7. **Use CORS** to restrict API access

### Best Practices:
- Never commit `.env` files with secrets
- Use environment variables for database credentials
- Validate all user inputs
- Implement proper error handling
- Use HTTPS in production
- Keep dependencies updated

---

## 📈 Performance Tips

### Frontend:
- Use code splitting for large components
- Implement lazy loading for routes
- Optimize images before upload
- Cache API responses
- Minimize CSS/JS bundle size

### Backend:
- Add database indexes on frequently queried columns
- Implement pagination for large datasets
- Cache query results
- Use connection pooling
- Monitor CPU and memory usage

### Database:
- Index primary and foreign keys
- Archive old records periodically
- Optimize query performance
- Regular backups
- Monitor table sizes

---

## 📝 Development Workflow

### Making Changes:

#### Backend Changes:
1. Edit controller/route files
2. Backend auto-restarts (if using nodemon)
3. Test via browser or Postman
4. Commit changes to git

#### Frontend Changes:
1. Edit component files
2. Frontend auto-refreshes (hot reload)
3. Check browser developer tools
4. Commit changes to git

### Testing:
1. Unit test individual components
2. Integration test features end-to-end
3. Manual user acceptance testing
4. Load testing for performance
5. Security testing for vulnerabilities

---

## 🚀 Deployment

### To Deploy to Production:

#### Backend:
1. Set environment variables
2. Use production database
3. Enable HTTPS
4. Set NODE_ENV=production
5. Deploy to server (Heroku, AWS, DigitalOcean, etc.)

#### Frontend:
1. Build production bundle: `npm run build`
2. Deploy to CDN (Netlify, Vercel, etc.)
3. Configure API endpoint for production
4. Enable caching headers
5. Optimize bundle size

---

## 📚 Additional Resources

### Documentation Files:
- [README.md](README.md) - Project overview
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Basic setup
- [FRONTEND_FEATURES_GUIDE.md](FRONTEND_FEATURES_GUIDE.md) - Feature details
- [NEW_OPERATIONS.md](NEW_OPERATIONS.md) - Backend operations
- [QUICK_START_NEW_OPS.md](QUICK_START_NEW_OPS.md) - Quick reference
- [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) - Checklist

### External Resources:
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MySQL Documentation](https://dev.mysql.com/doc)
- [Axios Documentation](https://axios-http.com)

---

## ✅ Verification Checklist

- [ ] MySQL database installed and running
- [ ] Schema created via schema.sql
- [ ] Backend dependencies installed
- [ ] Backend server running on :5000
- [ ] Frontend dependencies installed
- [ ] Frontend server running on :3000
- [ ] Can access http://localhost:3000
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can submit complaint
- [ ] Can view complaint status
- [ ] Admin can manage complaints
- [ ] Admin can view analytics
- [ ] All 5 new components accessible
- [ ] CSS styling applied correctly
- [ ] No console errors in browser
- [ ] No errors in backend terminal

---

## 🎯 Next Steps

1. **Complete Setup** - Follow steps 1-5 above
2. **Test Features** - Try all citizen and admin features
3. **Customize** - Modify colors, text, categories as needed
4. **Add Users** - Create test accounts for different roles
5. **Train Users** - Teach end-users how to use the system
6. **Monitor** - Watch for errors and performance issues
7. **Optimize** - Improve based on usage patterns
8. **Deploy** - Move to production when ready

---

## 📞 Support & Help

### Common Issues:
1. Check the Troubleshooting section above
2. Review browser console (F12) for errors
3. Check backend terminal for server errors
4. Inspect network requests in browser
5. Review database for data issues

### Getting Help:
1. Check documentation files
2. Review code comments
3. Search GitHub issues
4. Ask team members
5. Consult external documentation

---

## 📅 System Maintenance

### Daily:
- Monitor server logs
- Check for errors
- Monitor performance

### Weekly:
- Review user feedback
- Update list of issues
- Back up database
- Check disk space

### Monthly:
- Optimize database
- Archive old records
- Update dependencies
- Review security logs
- Performance analysis

---

**Version:** 2.0 (With New Features)
**Last Updated:** 2024
**Status:** Ready for Production
**Authors:** Development Team

---

## Summary

You now have a complete **Online Grievance Redressal System** with:

✅ **Backend API** - 25+ endpoints for all operations
✅ **Frontend UI** - 5+ new components with full functionality
✅ **Database** - 12 tables with complete schema
✅ **Authentication** - JWT-based secure login
✅ **Authorization** - Role-based access control (citizen, staff, admin)
✅ **Features**:
   - User Registration & Login
   - Submit & Track Complaints
   - Comments System
   - Document Management
   - Status History Tracking
   - Admin Management
   - Analytics & Reporting
   - Notification System
   - Escalation Management
   - Feedback & Rating System

**Ready to Launch!** 🚀

Follow the setup steps above and you'll have a fully functional system in minutes.

