# Testing & Validation Guide

## Complete System Verification

This guide helps you test all the new features and validate the system works correctly.

---

## 🧪 Test Environment Setup

### Prerequisites
1. ✅ MySQL running
2. ✅ Database created and migrated
3. ✅ Backend server running on :5000
4. ✅ Frontend server running on :3000
5. ✅ Browser opened to http://localhost:3000

---

## 📋 Test Phases

### Phase 1: System Health Check

#### 1.1 Backend Server Verification
```bash
# Terminal
npm start        # In backend directory
```

**Expected:**
- ✅ Server running on port 5000
- ✅ Database connected successfully
- ✅ No errors in terminal

**Verify in browser:**
- Open: http://localhost:5000/
- Should see response (error OK)

| Check | Expected | Status |
|-------|----------|--------|
| Backend responds | ✓ Response received | [ ] |
| No port conflict | No "EADDRINUSE" error | [ ] |
| DB connection | "connected" message | [ ] |

---

#### 1.2 Frontend Server Verification
```bash
# Terminal (new)
npm start        # In frontend directory
```

**Expected:**
- ✅ App compiled successfully
- ✅ Running on http://localhost:3000
- ✅ Browser opens automatically

**Verify:**
- Home page loads
- No console errors (F12)
- Navigation links visible

| Check | Expected | Status |
|-------|----------|--------|
| Frontend loads | Home page displays | [ ] |
| No errors | Console is clean | [ ] |
| Navigation works | Links clickable | [ ] |

---

### Phase 2: Authentication Testing

#### 2.1 User Registration Test

**Steps:**
1. Click "Register" on home page
2. Fill form:
   - Name: `Test User`
   - Email: `testuser@example.com`
   - Password: `TestPass123`
   - Phone: `9876543210` (optional)
3. Click "Register"
4. Check browser console (F12) for response

**Expected Results:**
- ✅ Form validates input
- ✅ No required field errors
- ✅ Successful submission response
- ✅ Redirects to login
- ✅ No console errors

**Testing Checklist:**
| Test Case | Expected | Result |
|-----------|----------|--------|
| Empty form submit | Error message | [ ] |
| Invalid email | Error message | [ ] |
| Short password | Error message | [ ] |
| Valid input | Success redirect | [ ] |
| Duplicate email | Error message | [ ] |

---

#### 2.2 User Login Test

**Steps:**
1. Go to login page (or redirected from register)
2. Enter credentials:
   - Email: `testuser@example.com`
   - Password: `TestPass123`
3. Click "Login"
4. Check browser for success

**Expected Results:**
- ✅ Validates email format
- ✅ Checks password length
- ✅ Successful login response
- ✅ Redirects to citizen dashboard
- ✅ User name displayed in header
- ✅ JWT token in localStorage (F12 → Storage)

**Testing Checklist:**
| Test Case | Expected | Result |
|-----------|----------|--------|
| Wrong password | Login fails | [ ] |
| Wrong email | Login fails | [ ] |
| Correct credentials | Success | [ ] |
| Token in storage | JWT visible | [ ] |
| Redirect to dashboard | Dashboard loads | [ ] |

---

### Phase 3: Citizen Features Testing

#### 3.1 Submit Complaint Feature

**Test Path:** `/citizen/submit-complaint`

**Steps:**
1. Go to Citizen Dashboard
2. Click "Submit Complaint" or navigate to `/citizen/submit-complaint`
3. Fill form:
   - Title: `Test Complaint About Water Supply`
   - Description: `Water supply is not available in my area for past 3 days`
   - Category: Select "Water Supply" from dropdown
   - Priority: Select "High"
   - Files: (Optional) Upload a few MB file
4. Click "Submit"
5. Check for success notification

**Expected Results:**
- ✅ Page loads correctly
- ✅ Category dropdown populated
- ✅ File upload works
- ✅ Form validates required fields
- ✅ Character count updates
- ✅ Success notification appears
- ✅ Can submit with/without files
- ✅ Redirects to complaints list

**Testing Checklist:**
| Test Case | Expected | Pass |
|-----------|----------|------|
| Load form | Renders correctly | [ ] |
| Category dropdown | Lists populated | [ ] |
| Title validation | Min 10 chars | [ ] |
| Desc validation | Min 50 chars | [ ] |
| Character count | Updates in real-time | [ ] |
| File upload | Accepts files <10MB | [ ] |
| File limit | Rejects >10MB | [ ] |
| Submit without files | Success | [ ] |
| Submit with files | Success | [ ] |
| Form reset | Fields clear after submit | [ ] |

---

#### 3.2 View Complaints Feature

**Test Path:** `/citizen/my-complaints`

**Steps:**
1. Go to Citizen Dashboard
2. Click "My Complaints" or navigate to `/citizen/my-complaints`
3. Verify list shows submitted complaint
4. Test filters:
   - Click "All" - See all complaints
   - Click "Open" - See open complaints
   - Click "In Progress" - See in-progress
   - Click "Resolved" - See resolved
5. Test search:
   - Search by complaint ID
   - Search by title keyword
6. Click on complaint card to view details

**Expected Results:**
- ✅ Loads submitted complaint
- ✅ Displays complaint details (id, title, category, priority)
- ✅ Status badges colored correctly
- ✅ Filter buttons work
- ✅ Search filters results
- ✅ Click opens details page
- ✅ No console errors

**Testing Checklist:**
| Test Case | Expected | Pass |
|-----------|----------|------|
| Load list | Recent complaint visible | [ ] |
| Display fields | ID, title, category, priority shown | [ ] |
| Status badge | Correct status displayed | [ ] |
| Filter "All" | Shows all complaints | [ ] |
| Filter "Open" | Shows only open | [ ] |
| Filter status | Works as expected | [ ] |
| Search by ID | Finds complaint | [ ] |
| Search by title | Finds complaint | [ ] |
| Click complaint | Opens tracker page | [ ] |

---

#### 3.3 Track Complaint Feature

**Test Path:** `/citizen/complaint/:id`

**Steps:**
1. From "My Complaints", click on a complaint
2. OR navigate directly: `/citizen/complaint/1` (replace 1 with actual ID)
3. Verify complaint details load:
   - Title, ID, description visible
   - Status with color badge
   - Category and priority info
4. Review status timeline
5. Check comments section (if any exist)
6. Check documents section (if uploaded)
7. Test comment functionality:
   - Type a test comment
   - Click "Add Comment"
   - Verify comment appears
8. Test document download (if files exist):
   - Click download button
   - File should download

**Expected Results:**
- ✅ Complaint details load
- ✅ Status timeline displays
- ✅ Comments section visible
- ✅ Documents list shows uploaded files
- ✅ Can add new comments
- ✅ Can view comment history
- ✅ Download links work
- ✅ No console errors

**Testing Checklist:**
| Test Case | Expected | Pass |
|-----------|----------|------|
| Load details | All info visible | [ ] |
| Status timeline | Shows history | [ ] |
| Timeline markers | Aligned correctly | [ ] |
| Comment input | Text area visible | [ ] |
| Add comment | Comment appears | [ ] |
| Comment timestamp | Shows date/time | [ ] |
| Document list | Shows files | [ ] |
| Download button | Clickable | [ ] |
| Download works | File downloads | [ ] |
| Back button | Returns to list | [ ] |

---

### Phase 4: Admin Features Testing

#### 4.1 Admin Login Test

**Steps:**
1. Logout current user (if logged in)
2. Login with admin credentials:
   - Email: `admin@grievance.gov`
   - Password: `Admin@123`
3. Verify redirect to admin dashboard
4. Check user role displays as "Admin"

**Expected Results:**
- ✅ Login successful
- ✅ Redirects to `/admin/dashboard`
- ✅ Admin menu items visible
- ✅ User role shows "Admin"

---

#### 4.2 Manage Complaints Feature

**Test Path:** `/admin/manage-complaints`

**Steps:**
1. From Admin Dashboard, click "Manage Complaints"
2. Or navigate: `/admin/manage-complaints`
3. Verify complaint table loads:
   - Shows all complaints
   - Displays ID, title, status, priority, category
4. Test filtering:
   - Filter by Status (Open, In Progress, Resolved, Closed)
   - Filter by Priority (Low, Medium, High)
   - Filter by Category
5. Test search:
   - Search by complaint ID or title
6. Test assign functionality:
   - Click "Assign" button on a complaint
   - Modal opens with staff list
   - Click staff member
   - Verify success message
   - Table updates (assigned_to shows staff name)
7. Test status update:
   - Click "Update Status" button
   - Modal opens with status options
   - Select new status
   - Verify table updates
   - Verify success message

**Expected Results:**
- ✅ Table loads all complaints
- ✅ Columns display correctly
- ✅ Filter dropdowns populate
- ✅ Filters work independently
- ✅ Combined filters work
- ✅ Search by ID works
- ✅ Search by title works
- ✅ Assign modal opens
- ✅ Staff list displays
- ✅ Assignment successful
- ✅ Status modal opens
- ✅ Status update successful
- ✅ Table reflects changes in real-time

**Testing Checklist:**
| Test Case | Expected | Pass |
|-----------|----------|------|
| Load table | All complaints visible | [ ] |
| Table columns | 6+ columns displayed | [ ] |
| Filter status | Works correctly | [ ] |
| Filter priority | Works correctly | [ ] |
| Filter category | Works correctly | [ ] |
| Combined filters | All work together | [ ] |
| Search ID | Finds complaint | [ ] |
| Search title | Finds complaint | [ ] |
| Assign modal | Opens correctly | [ ] |
| Staff list | Shows available staff | [ ] |
| Assign staff | Success message | [ ] |
| Update status | Modal opens | [ ] |
| Status options | All visible | [ ] |
| Status change | Updates successfully | [ ] |

---

#### 4.3 Complaint History & Analytics Feature

**Test Path:** `/admin/complaint-history`

**Steps:**
1. From Admin Dashboard, click "Complaint History"
2. Or navigate: `/admin/complaint-history`
3. Verify statistics cards load:
   - Total Complaints count
   - Open count
   - In Progress count
   - Resolved count
   - Closed count
   - High Priority count
   - Average Resolution Time
   - Resolution Rate %
4. Verify numbers are correct (match actual data)
5. Test timeframe filters:
   - Click "All Time" - should show all
   - Click "Last Week" - filter to 7 days
   - Click "Last Month" - filter to 30 days
6. Verify timeline loads:
   - Shows complaint activity chronologically
   - Displays dates and statuses
7. Check statistics update when timeframe changes

**Expected Results:**
- ✅ Page loads without errors
- ✅ All 8 statistics cards visible
- ✅ Numbers calculate correctly
- ✅ Timeframe buttons functional
- ✅ Timeline displays smoothly
- ✅ Data updates with filters
- ✅ Numbers recalculate correctly
- ✅ No console errors

**Testing Checklist:**
| Test Case | Expected | Pass |
|-----------|----------|------|
| Load stats | 8 cards visible | [ ] |
| Total count | Correct number | [ ] |
| Open count | Correct number | [ ] |
| In Progress | Correct number | [ ] |
| Resolved count | Correct number | [ ] |
| Closed count | Correct number | [ ] |
| High priority | Correct number | [ ] |
| Avg time | Shows in hours/days | [ ] |
| Resolution % | Shows percentage | [ ] |
| Timeframe "All" | Shows all data | [ ] |
| Timeframe "Week" | Filters correctly | [ ] |
| Timeframe "Month" | Filters correctly | [ ] |
| Timeline loads | Events visible | [ ] |
| Timeline dates | Show correctly | [ ] |
| Stats update | Refresh with filter | [ ] |

---

### Phase 5: Styling Verification

#### 5.1 CSS Classes Applied

**Steps:**
1. Open browser DevTools (F12)
2. Inspect elements on pages:
   - `/citizen/submit-complaint`
   - `/citizen/complaint/:id`
   - `/citizen/my-complaints`
   - `/admin/manage-complaints`
   - `/admin/complaint-history`
3. Verify class names match CSS file
4. Check styles applied correctly

**Expected Results:**
- ✅ All CSS classes in HTML match Complaints.css
- ✅ Styles render without errors
- ✅ Colors display correctly
- ✅ Spacing/padding reasonable
- ✅ Responsive on different sizes

**Testing Checklist:**
| Element | Class Name | Applied | Pass |
|---------|-----------|---------|------|
| Form container | `.complaint-form` | ✓ | [ ] |
| Tracker | `.tracker-container` | ✓ | [ ] |
| Grievance card | `.grievance-card` | ✓ | [ ] |
| Admin table | `.complaints-table` | ✓ | [ ] |
| Modal | `.modal-overlay` | ✓ | [ ] |
| Status badge | `.status-badge` | ✓ | [ ] |
| Timeline | `.timeline` | ✓ | [ ] |
| Buttons | `.submit-btn` | ✓ | [ ] |

---

#### 5.2 Responsive Design Test

**Steps:**
1. Resize browser window (test different breakpoints):
   - Desktop (1200px+)
   - Tablet (768px - 1200px)
   - Mobile (< 768px)
2. Verify layout adapts:
   - Elements stack on mobile
   - Text readable on all sizes
   - Buttons clickable on mobile
   - No horizontal scrolling

**Expected on Mobile:**
- ✅ Single column layout
- ✅ Readable text (16px+)
- ✅ Tap targets 44px+
- ✅ No overflow

**Testing Checklist:**
| Screen Size | Layout | Text | Buttons | Pass |
|-------------|--------|------|---------|------|
| Desktop | Grid | Clear | Visible | [ ] |
| Tablet | Adjusted | Clear | Accessible | [ ] |
| Mobile | Stacked | Clear | Tappable | [ ] |

---

### Phase 6: Data Validation Testing

#### 6.1 Form Validations Test

**Test Title Field:**
- Empty input - Show error
- 5 characters - Show error (min 10)
- Exactly 10 chars - Accept
- 255+ characters - Show error (max)

**Test Description Field:**
- Empty input - Show error
- 20 characters - Show error (min 50)
- Exactly 50 chars - Accept
- 5000+ characters - Show error (max)

**Test File Upload:**
- No file - Accept
- File < 10MB - Accept
- File > 10MB - Reject
- Multiple files - Accept (up to limit)

**Test Category Selection:**
- No selection - Show error
- Valid selection - Accept
- Verify options from database

**Testing Checklist:**
| Field | Test Case | Expected | Pass |
|-------|-----------|----------|------|
| Title | Empty | Error | [ ] |
| Title | Too short | Error | [ ] |
| Title | Valid | Accept | [ ] |
| Title | Too long | Error | [ ] |
| Desc | Empty | Error | [ ] |
| Desc | Too short | Error | [ ] |
| Desc | Valid | Accept | [ ] |
| Desc | Too long | Error | [ ] |
| Category | None | Error | [ ] |
| Category | Selected | Accept | [ ] |
| Files | None | Accept | [ ] |
| Files | Small | Accept | [ ] |
| Files | Large | Reject | [ ] |

---

### Phase 7: API Integration Testing

#### 7.1 Network Requests Test

**Steps:**
1. Open DevTools (F12) → Network tab
2. Perform these actions and monitor requests:
   - Submit a complaint
   - Fetch complaints list
   - Assign staff member
   - Update status
   - Add comment
   - Download document

**Expected Results for Each Request:**
- ✅ Status 200 (success) or appropriate error code
- ✅ Correct endpoint (e.g., `/api/grievances`)
- ✅ Correct method (POST, GET, PUT, DELETE)
- ✅ Response contains expected data
- ✅ No CORS errors
- ✅ Response time < 2 seconds

**Testing Checklist:**
| Action | Method | Endpoint | Status | Time | Pass |
|--------|--------|----------|--------|------|------|
| Submit | POST | /grievances | 201 | < 2s | [ ] |
| Fetch list | GET | /grievances | 200 | < 2s | [ ] |
| Get details | GET | /grievances/:id | 200 | < 2s | [ ] |
| Assign | PATCH | /grievances/:id/assign | 200 | < 2s | [ ] |
| Update status | PATCH | /grievances/:id/status | 200 | < 2s | [ ] |
| Get comments | GET | /comments/grievance/:id | 200 | < 2s | [ ] |
| Add comment | POST | /comments/grievance/:id | 201 | < 2s | [ ] |
| Get documents | GET | /documents/grievance/:id | 200 | < 2s | [ ] |
| Download | GET | /documents/download/:id | 200 | < 2s | [ ] |

---

#### 7.2 Error Handling Test

**Steps:**
1. Intentionally cause errors:
   - Access non-existent complaint: `/citizen/complaint/9999`
   - Submit with invalid data
   - Upload oversized file
   - Network disconnect (F12 → Network → Offline)
   - Try operations without authentication

**Expected Results:**
- ✅ Error message displays clearly
- ✅ No app crash
- ✅ User can retry
- ✅ Console shows error details
- ✅ Appropriate HTTP status codes

---

### Phase 8: Performance Testing

#### 8.1 Load Time Test

**Steps:**
1. F12 → Network tab → Slow 3G
2. Load each page and measure:
   - `/citizen/submit-complaint`
   - `/citizen/my-complaints`
   - `/admin/manage-complaints`
   - `/admin/complaint-history`

**Expected Results:**
- ✅ Initial load < 5 seconds
- ✅ API calls < 2 seconds each
- ✅ No blank screens while loading
- ✅ Loading indicator appears

**Testing Checklist:**
| Page | Load Time | Pass |
|------|-----------|------|
| Submit Form | < 2s | [ ] |
| Complaints List | < 3s | [ ] |
| Complaint Details | < 3s | [ ] |
| Admin Management | < 3s | [ ] |
| Admin Analytics | < 3s | [ ] |

---

#### 8.2 Memory Test

**Steps:**
1. F12 → Performance/Memory tab
2. Navigate between pages multiple times
3. Monitor memory usage
4. Check for memory leaks

**Expected Results:**
- ✅ Memory doesn't continuously increase
- ✅ No memory leaks detected
- ✅ Can navigate many times without slowdown

---

### Phase 9: Cross-Browser Testing

**Test on Multiple Browsers:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

**For Each Browser Test:**
1. Register/Login
2. Submit complaint
3. View complaints
4. Track complaint
5. (Admin) Manage complaints
6. (Admin) View analytics

**Expected:** All features work identically

---

### Phase 10: User Acceptance Testing

#### Real User Workflow Test

**Scenario 1: Citizen Journey**
```
1. Register → Success
2. Login → Dashboard loads
3. Submit complaint → Success
4. View in list → Complaint appears
5. Click to track → Details load
6. Add comment → Comment appears
7. View document → Downloads
8. Logout → Redirected to home
```

**Scenario 2: Admin Journey**
```
1. Login as admin → Admin dashboard
2. Go to manage → Table loads
3. Filter complaints → Works
4. Assign staff → Success
5. Update status → Updated
6. View analytics → Stats correct
7. Logout → Redirected
```

**Scenario 3: Staff Journey**
```
1. Login as staff → Staff dashboard
2. View assigned → Shows list
3. Click complaint → Details load
4. Add resolution → Saved
5. Update status → Changed
6. Logout → Redirected
```

---

## 📊 Test Results Summary

### Template
```
╔════════════════════════════════════════════════════════════════╗
║           TEST EXECUTION SUMMARY - [Date]                     ║
╚════════════════════════════════════════════════════════════════╝

Phase 1: System Health Check
├─ Backend Server: [ ] PASS [ ] FAIL
├─ Frontend Server: [ ] PASS [ ] FAIL
└─ Database: [ ] PASS [ ] FAIL

Phase 2: Authentication
├─ User Registration: [ ] PASS [ ] FAIL
└─ User Login: [ ] PASS [ ] FAIL

Phase 3: Citizen Features
├─ Submit Complaint: [ ] PASS [ ] FAIL
├─ View Complaints: [ ] PASS [ ] FAIL
└─ Track Complaint: [ ] PASS [ ] FAIL

Phase 4: Admin Features
├─ Admin Login: [ ] PASS [ ] FAIL
├─ Manage Complaints: [ ] PASS [ ] FAIL
└─ View Analytics: [ ] PASS [ ] FAIL

Phase 5: Styling
├─ CSS Classes: [ ] PASS [ ] FAIL
└─ Responsive Design: [ ] PASS [ ] FAIL

Phase 6: Data Validation: [ ] PASS [ ] FAIL
Phase 7: API Integration: [ ] PASS [ ] FAIL
Phase 8: Performance: [ ] PASS [ ] FAIL
Phase 9: Cross-Browser: [ ] PASS [ ] FAIL
Phase 10: User Acceptance: [ ] PASS [ ] FAIL

═══════════════════════════════════════════════════════════════════
OVERALL RESULT: [ ] READY FOR PRODUCTION [ ] NEEDS FIXES
═══════════════════════════════════════════════════════════════════

Issues Found:
─────────────────────────────────────────────────────────────────
1. [Issue Description]
   Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
   Action: [Fix required]

2. [Issue Description]
   Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
   Action: [Fix required]

─────────────────────────────────────────────────────────────────

Tester: _____________________
Date: _______________________
Signature: ___________________
```

---

## 🔍 Debugging Tips

### If Tests Fail

1. **Check Console Errors (F12)**
   - JavaScript errors
   - Network errors
   - CORS errors
   - Log messages

2. **Check Network Tab (F12 → Network)**
   - Request method (GET, POST, etc.)
   - Status code (200, 404, 500, etc.)
   - Response data
   - Request payload

3. **Check Backend Logs**
   - Terminal where `npm start` runs
   - Database errors
   - API errors

4. **Check Database**
   - Query results in MySQL
   - Verify data was created
   - Check foreign key constraints

5. **Common Issues**
   - Port already in use
   - Database not migrated
   - Invalid JWT token
   - CORS not configured
   - Component import errors

---

## ✅ Sign-Off

Once all tests pass, the system is ready for:
- ✅ User training
- ✅ Data migration
- ✅ Production deployment

**Sign-Off Checklist:**
- [ ] All phases passed
- [ ] No critical issues
- [ ] Performance acceptable
- [ ] Cross-browser verified
- [ ] User workflows tested

**Approved By:** ___________________
**Date:** ___________________

---

**Version:** 2.0
**Status:** Testing Documentation Complete
**Last Updated:** 2024

