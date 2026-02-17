# Quick Reference: New Features Navigation

## 🎯 Component Locations

| Component | Location | Route | Purpose |
|-----------|----------|-------|---------|
| **SubmitComplaint.js** | `/frontend/src/pages/citizen/` | `/citizen/submit-complaint` | File new complaint |
| **ComplaintTracker.js** | `/frontend/src/pages/citizen/` | `/citizen/complaint/:id` | Track complaint status |
| **MyGrievancesEnhanced.js** | `/frontend/src/pages/citizen/` | `/citizen/my-complaints` | View all complaints |
| **AdminManageComplaints.js** | `/frontend/src/pages/admin/` | `/admin/manage-complaints` | Manage all complaints |
| **ComplaintHistory.js** | `/frontend/src/pages/admin/` | `/admin/complaint-history` | View analytics |

---

## 🚀 Quick Start Commands

```bash
# Database Setup
mysql -u root -p < database/schema.sql

# Backend
cd backend
npm install
npm start          # Runs on http://localhost:5000

# Frontend (in new terminal)
cd frontend
npm install
npm start          # Runs on http://localhost:3000
```

---

## 📱 Feature Overview

### Citizen Dashboard
```
☐ Submit New Complaint → /citizen/submit-complaint
  ├─ Fill title & description
  ├─ Select category
  ├─ Set priority
  └─ Upload files

☐ Track Complaint → /citizen/complaint/:id
  ├─ View status timeline
  ├─ Read comments
  ├─ Download documents
  └─ Add comments

☐ View All Complaints → /citizen/my-complaints
  ├─ Filter by status
  ├─ Search by ID/title
  ├─ View priority & category
  └─ Click to track
```

### Admin Dashboard
```
☐ Manage Complaints → /admin/manage-complaints
  ├─ Filter by status/priority/category
  ├─ Assign to staff
  ├─ Update status
  └─ Add notes

☐ View History → /admin/complaint-history
  ├─ 8 statistics displayed
  ├─ Filter by timeframe
  ├─ View timeline
  └─ Export data
```

---

## 📊 Service Methods

### In `grievanceService.js`:
```javascript
// Existing
createGrievance(data)           // Create new complaint
getAllGrievances(page, limit)   // Get all complaints
getUserGrievances(page, limit)  // Get user's complaints
getGrievanceById(id)            // Get complaint details
updateGrievanceStatus(id, status) // Update status
assignGrievance(id, staffId)    // Assign to staff

// New Methods
getComments(grievanceId)        // Get comments
addComment(grievanceId, data)   // Add comment
getDocuments(grievanceId)       // Get documents
uploadDocument(id, formData)    // Upload document
downloadDocument(docId)         // Download file
deleteDocument(docId)           // Delete file
getStatusHistory(grievanceId)   // Get history
getStaffMembers()               // Get staff list
getCategories()                 // Get categories
```

---

## 🎨 CSS Classes

### Main Containers
- `.complaint-container` - Submit complaint form
- `.tracker-container` - Track complaint
- `.grievances-container` - List grievances
- `.admin-container` - Admin management
- `.history-container` - Analytics/history

### Cards & Sections
- `.complaint-card` - Complaint card
- `.grievance-card` - Grievance card
- `.stat-card` - Statistics card
- `.section` - Content section

### Common Elements
- `.status-badge` - Status label
- `.priority-badge` - Priority label
- `.submit-btn` - Submit button
- `.action-btn` - Action buttons
- `.filter-btn` - Filter button
- `.modal-overlay` - Modal background
- `.modal-content` - Modal dialog

---

## 🔐 Test Accounts

### Admin Account
```
Email: admin@grievance.gov
Password: Admin@123
Role: admin
```

### Staff Account
```
Email: staff@grievance.gov
Password: Staff@123
Role: staff
```

### Citizen Account
```
Email: citizen@example.com
Password: Citizen@123
Role: citizen
```

---

## 🗂️ Files Structure Summary

```
CREATED / MODIFIED:

✅ NEW Components (5)
  ├── SubmitComplaint.js (220 lines)
  ├── ComplaintTracker.js (280 lines)
  ├── MyGrievancesEnhanced.js (200 lines)
  ├── AdminManageComplaints.js (280 lines)
  └── ComplaintHistory.js (250 lines)

✅ NEW Styles (1)
  └── Complaints.css (900+ lines)

✅ NEW/UPDATED Services
  └── grievanceService.js (added 10 methods)

✅ NEW Documentation (3)
  ├── FRONTEND_FEATURES_GUIDE.md
  ├── COMPLETE_SETUP_GUIDE.md
  └── QUICK_REFERENCE.md (this file)

✅ UPDATED Routing
  └── App.js (added 5 new routes)

BACKEND:
✅ 6 New Controllers (1200+ lines)
✅ 6 New Route Files
✅ 7 New Database Tables
✅ Documentation (3 files)
```

---

## ⚡ Keyboard Shortcuts

### Browser
- `F12` - Open Developer Tools
- `Ctrl + Shift + I` - Inspector
- `Ctrl + Shift + Delete` - Clear Cache
- `F5` - Refresh Page
- `Ctrl + Shift + R` - Hard Refresh

### VS Code (if editing)
- `Ctrl + K + O` - Open Folder
- `Ctrl + Shift + P` - Command Palette
- `Ctrl + /` - Toggle Comment
- `Ctrl + F` - Find in File
- `Ctrl + H` - Find and Replace

---

## 📋 Checklist: Getting Started

- [ ] **Database**
  - [ ] MySQL installed
  - [ ] schema.sql executed
  - [ ] Tables verified in MySQL

- [ ] **Backend**
  - [ ] Navigate to backend folder
  - [ ] Run `npm install`
  - [ ] Update database config if needed
  - [ ] Run `npm start`
  - [ ] Server running on :5000 ✓

- [ ] **Frontend**
  - [ ] Open new terminal
  - [ ] Navigate to frontend folder
  - [ ] Run `npm install`
  - [ ] Run `npm start`
  - [ ] App opens on :3000 ✓

- [ ] **Testing**
  - [ ] Register new user
  - [ ] Login successfully
  - [ ] Submit a complaint
  - [ ] Track complaint status
  - [ ] (Admin) Manage complaints
  - [ ] (Admin) View analytics

---

## 🐛 Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Port 5000 already in use | Another process on port | Kill process or change port |
| Database connection failed | MySQL not running | Start MySQL service |
| Cannot find module | Dependencies not installed | Run `npm install` |
| API returns 404 | Route doesn't exist | Check backend implementation |
| CORS error | Request blocked | Check backend CORS config |
| Token expired | Session timeout | Logout and login again |
| File too large | Upload exceeds limit | Keep files under 10MB |

---

## 📞 API Endpoints Summary

### Base URL: `http://localhost:5000/api`

#### Grievances
- `POST /grievances` - Create grievance
- `GET /grievances` - Get all grievances
- `GET /grievances/:id` - Get single grievance
- `PATCH /grievances/:id/status` - Update status
- `PATCH /grievances/:id/assign` - Assign to staff

#### Comments
- `GET /comments/grievance/:id` - Get comments
- `POST /comments/grievance/:id` - Add comment
- `PUT /comments/:id` - Edit comment
- `DELETE /comments/:id` - Delete comment

#### Documents
- `GET /documents/grievance/:id` - Get documents
- `POST /documents/upload/:id` - Upload document
- `GET /documents/download/:id` - Download file
- `DELETE /documents/:id` - Delete document

#### Status History
- `GET /status-history/grievance/:id` - Get history

#### Categories
- `GET /categories` - Get all categories

#### Users
- `GET /users/staff` - Get staff members

#### Notifications
- `GET /notifications` - Get notifications
- `PATCH /notifications/:id/read` - Mark as read

#### Escalations
- `POST /escalations` - Create escalation
- `GET /escalations` - Get escalations

#### Feedback
- `POST /feedback` - Submit feedback
- `GET /feedback/grievance/:id` - Get feedback

---

## 🎓 Learning Path

### For New Users
1. **Explore:** Visit http://localhost:3000
2. **Register:** Create a new account
3. **Submit:** File a test complaint
4. **Track:** Monitor its progress
5. **Learn:** Explore all features

### For Administrators
1. **Login:** Use admin credentials
2. **Manage:** Assign complaints to staff
3. **Monitor:** Track progress
4. **Analyze:** View statistics
5. **Optimize:** Improve workflows

### For Developers
1. **Review:** Check component files
2. **Test:** Use browser dev tools
3. **Debug:** Review console errors
4. **Modify:** Customize as needed
5. **Deploy:** Move to production

---

## 💾 Data Backup

### Backup Database
```bash
# MySQL Dump
mysqldump -u root -p grievance_redressal_system > backup.sql

# Restore
mysql -u root -p grievance_redressal_system < backup.sql
```

### Backup Files
```bash
# Backup entire project
xcopy /S "online-grievance-redressal-system" "backup\project-2024"

# Or use Git
git clone <repo-url> backup/project
```

---

## 🔄 Common Workflows

### Filing a Complaint (Citizen)
1. Login → Dashboard → Submit Complaint
2. Fill form → Select category → Upload files
3. Click Submit → Success notification
4. View in "My Complaints" → Click to track
5. Check status, add comments, download docs

### Managing Complaints (Admin)
1. Login → Dashboard → Manage Complaints
2. View table with all complaints
3. Filter by status/priority/category
4. Click "Assign" → Select staff → Confirm
5. Click "Update Status" → Change → Save
6. Go to "Complaint History" to view analytics

### Resolving Complaint (Staff)
1. Login → Dashboard → View assigned
2. Click to open complaint details
3. Review description & comments
4. Add resolution notes
5. Update status to "Resolved"
6. Confirm → Complete

---

## 📈 Monitoring

### What to Monitor
- Request-response times
- Error rates
- User activity
- Database size
- Server resources (CPU, RAM, Disk)
- Network bandwidth

### Tools
- Browser DevTools (Network tab)
- MySQL Workbench
- System Monitor (Task Manager)
- Error logs (browser console, server logs)

---

## 🆘 Emergency Procedures

### Server Down
1. Check if Node.js process is running: `npm start`
2. Check port availability
3. Review server logs for errors
4. Restart backend server

### Database Down
1. Check MySQL service status
2. Restart MySQL service
3. Verify database files exist
4. Check disk space
5. Restore from backup if needed

### Frontend Not Loading
1. Check frontend server is running
2. Hard refresh browser (Ctrl + Shift + R)
3. Clear browser cache
4. Check console for errors
5. Restart frontend server

---

## 📱 Browser Support

### Tested Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

### Recommended
- Chrome (latest)
- Firefox (latest)
- Edge (latest)

---

## 🌐 Network Requirements

### Minimum
- Upload: 1 Mbps
- Download: 1 Mbps
- Latency: <100ms

### Recommended
- Upload: 5 Mbps
- Download: 5 Mbps
- Latency: <50ms

### File Transfer
- Max file: 10 MB
- Max files per complaint: 5
- Total per complaint: 50 MB

---

## 🎨 Customization Guide

### Change Colors
Edit `Complaints.css`:
```css
/* Find color definitions */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change hex codes to your colors */
```

### Change Text
Edit component files:
```javascript
// Change button text
<button>{t('submit_btn')}</button>

// Or directly
<button>Custom Text</button>
```

### Add New Fields
1. Update database schema
2. Modify backend controller
3. Update frontend component
4. Add API method in service
5. Update CSS if needed

---

**Last Updated:** 2024
**Status:** Ready to Use
**Version:** 2.0

For detailed information, see the other documentation files!
