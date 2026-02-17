# System Architecture & Component Overview

## Complete System Diagram

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                 ONLINE GRIEVANCE REDRESSAL SYSTEM v2.0                        ║
║                         COMPLETE ARCHITECTURE                                ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER (React)                             │
│                       http://localhost:3000                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ AUTHENTICATION                                                     │   │
│  ├────────────────────────────────────────────────────────────────────┤   │
│  │ • Login.js (existing)              AuthContext (JWT management)  │   │
│  │ • Register.js (existing)           Protected routes              │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ CITIZEN│  │   STAFF      │  │    ADMIN     │  │  COMPONENTS  │        │
│  │FEATURES│  │  FEATURES    │  │   FEATURES   │  │             │        │
│  ├────────┤  ├──────────────┤  ├──────────────┤  ├──────────────┤        │
│  │         │  │              │  │              │  │              │        │
│  │ NEW:    │  │ NEW:         │  │ NEW:         │  │ Other:       │        │
│  │ • Submit│  │ • View       │  │ • Manage     │  │ • Header.js  │        │
│  │   📋    │  │  Assigned    │  │  Complaints  │  │ • Sidebar.js │        │
│  │        │  │  📋         │  │  📊         │  │ • Footer.js  │        │
│  │ • Track│  │             │  │             │  │ • Auth pages │        │
│  │  Status│  │ • Resolve    │  │ • Assign    │  │ • Layouts    │        │
│  │  🔍    │  │  Content    │  │  Staff     │  │             │        │
│  │        │  │  ✏️          │  │  👥         │  │             │        │
│  │ • View │  │              │  │             │  │             │        │
│  │  All   │  │ • Track      │  │ • View      │  │             │        │
│  │  📱    │  │  Progress   │  │  Analytics  │  │             │        │
│  │        │  │  🎯         │  │  📈         │  │             │        │
│  │        │  │              │  │             │  │             │        │
│  │ FILE   │  │ + EXISTING:  │  │ + EXISTING: │  │             │        │
│  │ UPLOAD │  │ • Dashboard  │  │ • Dashboard │  │             │        │
│  │ 📤    │  │ • Profile    │  │ • Users     │  │             │        │
│  │        │  │ • History    │  │ • Categories│  │             │        │
│  │        │  │             │  │ • Reports   │  │             │        │
│  │        │  │             │  │             │  │             │        │
│  └────────┘  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ SERVICES LAYER                                                     │   │
│  ├────────────────────────────────────────────────────────────────────┤   │
│  │ • grievanceService.js (18 methods)   • categoryService.js         │   │
│  │ • authService.js                     • userService.js             │   │
│  │                                      • resolutionService.js        │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ STYLING - Complaints.css (900+ lines, fully responsive)            │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ HTTP/REST (Axios)
                         API Base URL: /api
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER (Express.js)                           │
│                       http://localhost:5000                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ API ENDPOINTS (25+ total)                                          │   │
│  ├────────────────────────────────────────────────────────────────────┤   │
│  │                                                                    │   │
│  │  GRIEVANCES (5 endpoints)                                          │   │
│  │  • POST   /grievances           Create grievance                  │   │
│  │  • GET    /grievances           Get all                           │   │
│  │  • GET    /grievances/:id       Get one                           │   │
│  │  • PATCH  /grievances/:id/status  Update status                   │   │
│  │  • PATCH  /grievances/:id/assign   Assign to staff                │   │
│  │                                                                    │   │
│  │  NEW: COMMENTS (4 endpoints)                                       │   │
│  │  • GET    /comments/grievance/:id             Get comments        │   │
│  │  • POST   /comments/grievance/:id             Add comment         │   │
│  │  • PUT    /comments/:id                       Edit comment        │   │
│  │  • DELETE /comments/:id                       Delete comment      │   │
│  │                                                                    │   │
│  │  NEW: DOCUMENTS (4 endpoints)                                      │   │
│  │  • GET    /documents/grievance/:id            Get documents       │   │
│  │  • POST   /documents/upload/:id               Upload file         │   │
│  │  • GET    /documents/download/:id             Download file       │   │
│  │  • DELETE /documents/:id                      Delete file         │   │
│  │                                                                    │   │
│  │  NEW: STATUS HISTORY (3 endpoints)                                │   │
│  │  • GET    /status-history/grievance/:id       Get history         │   │
│  │  • POST   /status-history                     Create entry        │   │
│  │  • GET    /status-history/stats               Get statistics      │   │
│  │                                                                    │   │
│  │  NEW: ESCALATIONS (4 endpoints)                                   │   │
│  │  • POST   /escalations                        Create escalation   │   │
│  │  • GET    /escalations                        Get all             │   │
│  │  • PATCH  /escalations/:id                    Update              │   │
│  │  • DELETE /escalations/:id                    Delete              │   │
│  │                                                                    │   │
│  │  NEW: FEEDBACK (4 endpoints)                                      │   │
│  │  • POST   /feedback                           Submit feedback     │   │
│  │  • GET    /feedback/grievance/:id             Get feedback        │   │
│  │  • GET    /feedback/stats                     Get statistics      │   │
│  │  • DELETE /feedback/:id                       Delete feedback     │   │
│  │                                                                    │   │
│  │  NEW: NOTIFICATIONS (5 endpoints)                                 │   │
│  │  • GET    /notifications                      Get all             │   │
│  │  • PATCH  /notifications/:id/read             Mark as read        │   │
│  │  • DELETE /notifications/:id                  Delete              │   │
│  │  • POST   /notifications                      Create              │   │
│  │  • GET    /notifications/unread               Get unread          │   │
│  │                                                                    │   │
│  │  CATEGORIES (2 endpoints)                                          │   │
│  │  • GET    /categories                        Get all              │   │
│  │  • POST   /categories                        Create new           │   │
│  │                                                                    │   │
│  │  USERS (2 endpoints)                                               │   │
│  │  • GET    /users/staff                       Get staff members    │   │
│  │  • POST   /users                             Create new user      │   │
│  │                                                                    │   │
│  │  AUTHENTICATION (2 endpoints)                                      │   │
│  │  • POST   /auth/login                        User login           │   │
│  │  • POST   /auth/register                     User registration    │   │
│  │                                                                    │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ CONTROLLERS (6 NEW)                                                │   │
│  ├────────────────────────────────────────────────────────────────────┤   │
│  │ • commentController.js         • feedbackController.js            │   │
│  │ • escalationController.js      • notificationController.js        │   │
│  │ • documentController.js        • statusHistoryController.js       │   │
│  │                                                                    │   │
│  │ + Existing controllers:                                            │   │
│  │ • grievanceController.js       • categoryController.js            │   │
│  │ • authController.js            • userController.js                │   │
│  │ • resolutionController.js                                          │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ MIDDLEWARE                                                         │   │
│  ├────────────────────────────────────────────────────────────────────┤   │
│  │ • Authentication (JWT verification)      • Error Handling         │   │
│  │ • Authorization (Role checking)          • CORS Configuration    │   │
│  │ • Input Validation                       • Logging               │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ MySQL Protocol
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER (MySQL)                                │
│                    grievance_redressal_system                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CORE TABLES (4 existing):                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────┐  ┌─────────────┐         │
│  │    users    │  │  grievances  │  │categories│  │ resolutions │         │
│  ├─────────────┤  ├──────────────┤  ├──────────┤  ├─────────────┤         │
│  │ id          │  │ id           │  │ id       │  │ id          │         │
│  │ name        │  │ user_id      │  │ name     │  │ grievance_id│         │
│  │ email       │  │ title        │  │ desc     │  │ staff_id    │         │
│  │ password    │  │ description  │  │          │  │ notes       │         │
│  │ role        │  │ category_id  │  │          │  │ created_at  │         │
│  │ phone       │  │ priority     │  │          │  │             │         │
│  │ address     │  │ status       │  │          │  │             │         │
│  │ created_at  │  │ assigned_to  │  │          │  │             │         │
│  └─────────────┘  │ created_at   │  └──────────┘  └─────────────┘         │
│       ↑           │ updated_at   │         ↑            ↑                  │
│       └───────────│              │─────────┼────────────┘                  │
│                   │              │         │                              │
│                   │ updated_at   │         │                              │
│                   └──────────────┘         │                              │
│                                           │                              │
│  NEW TABLES (7):                           │                              │
│  ┌──────────────────┐  ┌─────────────────┐│  ┌──────────────┐            │
│  │ grievance_       │  │ grievance_      ││  │ grievance_   │            │
│  │ comments         │  │ escalations     ││  │ documents    │            │
│  ├──────────────────┤  ├─────────────────┤│  ├──────────────┤            │
│  │ id               │  │ id              ││  │ id           │            │
│  │ grievance_id     │  │ grievance_id    ││  │ grievance_id │            │
│  │ user_id          │  │ escalation_to   ││  │ file_path    │            │
│  │ comment_type     │  │ reason          ││  │ file_size    │            │
│  │ comment          │  │ status          ││  │ uploaded_by  │            │
│  │ created_at       │  │ created_at      ││  │ created_at   │            │
│  │ updated_at       │  │ updated_at      ││  │              │            │
│  └──────────────────┘  └─────────────────┘│  └──────────────┘            │
│                                           │                              │
│  ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │ grievance_       │  │ grievance_   │  │notifications│               │
│  │ feedback         │  │status_history│  │             │               │
│  ├──────────────────┤  ├──────────────┤  ├──────────────┤               │
│  │ id               │  │ id           │  │ id           │               │
│  │ grievance_id     │  │ grievance_id │  │ user_id      │               │
│  │ rating           │  │ old_status   │  │ type         │               │
│  │ comment          │  │ new_status   │  │ message      │               │
│  │ submitted_by     │  │ changed_by   │  │ is_read      │               │
│  │ created_at       │  │ changed_at   │  │ created_at   │               │
│  │                  │  │ reason       │  │              │               │
│  └──────────────────┘  └──────────────┘  └──────────────┘               │
│                                                                             │
│  ┌──────────────────┐                                                      │
│  │    departments   │                                                      │
│  ├──────────────────┤                                                      │
│  │ id               │                                                      │
│  │ name             │                                                      │
│  │ description      │                                                      │
│  │ created_at       │                                                      │
│  └──────────────────┘                                                      │
│                                                                             │
│  All tables include:                                                       │
│  ✓ Primary Keys       ✓ Timestamps          ✓ Foreign Keys               │
│  ✓ Indexes           ✓ Constraints         ✓ Relationships              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    USER ACTIONS → SYSTEM RESPONSE                        │
└──────────────────────────────────────────────────────────────────────────┘

CITIZEN WORKFLOW:
═════════════════

1. REGISTER
   Register.js → authService.register()
                ↓
            /api/auth/register
                ↓
         authController.register()
                ↓
            MySQL: users table ← INSERT

2. LOGIN
   Login.js → authService.login()
            ↓
        /api/auth/login
            ↓
     authController.login()
            ↓
      Generate JWT Token
            ↓
   Store in localStorage
        ↓
   AuthContext updated

3. SUBMIT COMPLAINT
   SubmitComplaint.js → ValidationCheckList ✓
                    ↓
           grievanceService.createGrievance()
                    ↓
           /api/grievances (POST)
                    ↓
        grievanceController.create()
                    ↓
           MySQL: grievances ← INSERT
                    ↓
         notification sent to admin
                    ↓
       status_history entry created
                    ↓
           Success message shown

4. TRACK COMPLAINT
   MyGrievancesEnhanced.js ← shows list
                 ↓
          Click complaint
                 ↓
      ComplaintTracker.js
                 ↓
     grievanceService.getGrievanceById()
                 ↓
      /api/grievances/:id
                 ↓
   grievanceController.getById()
                 ↓
   MySQL: JOIN with comments, documents
                 ↓
       Display timeline with status history
                 ↓
        Comment system functional
                 ↓
     File download available

ADMIN WORKFLOW:
═══════════════

1. MANAGE COMPLAINTS
   AdminManageComplaints.js
                 ↓
   grievanceService.getAllGrievances()
                 ↓
   /api/grievances (GET)
                 ↓
   Table displayed with filters
                 ↓
   Click "ASSIGN"
                 ↓
   Modal shows staff list
                 ↓
   grievanceService.assignGrievance()
                 ↓
   /api/grievances/:id/assign (PATCH)
                 ↓
   grievanceController.assign()
                 ↓
   MySQL: grievances.assigned_to ← UPDATE
                 ↓
   notification sent to staff
                 ↓
   status_history entry created

2. VIEW ANALYTICS
   ComplaintHistory.js
                 ↓
   grievanceService.getAllGrievances()
                 ↓
   Calculate 8 statistics
                 ↓
   Filter by timeframe
                 ↓
   Display timeline
                 ↓
   Show performance metrics
```

---

## Data Flow Diagram

```
┌──────────────┐
│ User Input   │
└──────┬───────┘
       │
       ↓
┌──────────────────────────┐
│ Frontend Component       │
│ (React Functional)       │
│ • useState hooks         │
│ • useEffect for API      │
│ • Form validation        │
└──────┬───────────────────┘
       │
       ↓
┌──────────────────────────┐
│ Service Layer            │
│ (API Abstraction)        │
│ • axios requests         │
│ • Error handling         │
│ • Response parsing       │
└──────┬───────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ Backend API (Express)                │
│ • Route matching                     │
│ • Middleware processing              │
│ • Parameter extraction               │
└──────┬──────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ Controller                           │
│ • Business logic                     │
│ • Data transformation                │
│ • Validation                         │
└──────┬──────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ Database Layer                       │
│ • Query generation                   │
│ • Data persistence                   │
│ • Transaction handling               │
└──────┬──────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ MySQL Database                       │
│ • Table operations                   │
│ • Constraint enforcement             │
│ • Index usage                        │
└──────┬──────────────────────────────┘
       │
       ↓ (Response)
┌──────────────────────────────────────┐
│ Response JSON                        │
└──────┬──────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ Service Layer                        │
│ • Parse response                     │
│ • Handle errors                      │
│ • Return to component                │
└──────┬──────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ Frontend Component                   │
│ • Update state (useState)            │
│ • Re-render with new data            │
│ • Display results to user            │
└──────┬──────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ User Sees Updated UI                 │
└──────────────────────────────────────┘
```

---

## Security Layers

```
┌──────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                     │
└──────────────────────────────────────────────────────────────┘

Layer 1: FRONTEND SECURITY
└─────────────────────────
  ✓ Input validation before submit
  ✓ XSS prevention (React escaping)
  ✓ HTTPS/SSL in production
  ✓ Secure localStorage (HttpOnly cookies)

Layer 2: API COMMUNICATION
──────────────────────────
  ✓ JWT token in headers
  ✓ CORS validation
  ✓ Request signing
  ✓ Rate limiting (optional)

Layer 3: BACKEND MIDDLEWARE
───────────────────────────
  ✓ JWT verification
  ✓ Role validation
  ✓ Input sanitization
  ✓ SQL injection prevention

Layer 4: BUSINESS LOGIC
──────────────────────
  ✓ Authorization checks
  ✓ Permission validation
  ✓ Data ownership verification
  ✓ Audit logging

Layer 5: DATABASE
────────────────
  ✓ Foreign key constraints
  ✓ Data type validation
  ✓ Index optimization
  ✓ Backup strategy
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  PRODUCTION DEPLOYMENT                      │
└─────────────────────────────────────────────────────────────┘

Option 1: Single Server (Small Scale)
─────────────────────────────────────
Server 1:
├─ Operating System (Linux/Windows)
├─ Node.js Runtime
│  ├─ Express Server (Port 5000)
│  ├─ File Upload Handler
│  └─ JWT Manager
├─ MySQL Database
│  └─ Database & Tables
├─ Nginx (Reverse Proxy)
│  └─ Load balancer
└─ SSL Certificate
   └─ HTTPS

Option 2: Distributed Setup (Large Scale)
──────────────────────────────────────────
Load Balancer (SSL)
        │
        ├─→ API Server 1 (Node.js)
        ├─→ API Server 2 (Node.js)
        └─→ API Server 3 (Node.js)
              │
        Database Cluster
        ├─ MySQL Primary
        ├─ MySQL Replica 1
        └─ MySQL Replica 2

Cache Layer (Redis)
        └─ Session: In-memory

CDN (Static Files)
        └─ React Build
```

---

This completes the comprehensive system architecture documentation!

