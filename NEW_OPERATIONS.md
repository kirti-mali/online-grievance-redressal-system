# New Operations Added to Online Grievance Redressal System

## Overview
This document describes all the new operations and APIs added to enhance the Online Grievance Redressal System. These operations provide advanced functionality for managing grievances, tracking progress, and improving system capabilities.

---

## 1. **Comments System** (`/api/comments`)

### Purpose
Allow users to add, view, and manage comments on grievances. Supports internal comments (staff/admin only) and public comments.

### Endpoints

#### Add Comment
- **POST** `/api/comments/:grievance_id/comments`
- **Auth**: Required
- **Body**:
  ```json
  {
    "comment": "Comment text",
    "is_internal": false
  }
  ```
- **Response**: 201 Created
  ```json
  {
    "success": true,
    "message": "Comment added successfully",
    "comment": {
      "id": 1,
      "grievance_id": 5,
      "user_id": 2,
      "comment": "Comment text",
      "is_internal": false
    }
  }
  ```

#### Get Comments
- **GET** `/api/comments/:grievance_id/comments`
- **Auth**: Required
- **Query**: None
- **Features**:
  - Citizens can only see public comments
  - Staff/Admin can see all comments including internal ones
- **Response**: 200 OK
  ```json
  {
    "success": true,
    "comments": [
      {
        "id": 1,
        "grievance_id": 5,
        "user_id": 2,
        "user_name": "John Doe",
        "user_role": "citizen",
        "comment": "Issue resolved!",
        "is_internal": false,
        "created_at": "2026-02-16T10:30:00Z"
      }
    ]
  }
  ```

#### Update Comment
- **PUT** `/api/comments/comments/:comment_id`
- **Auth**: Required (owner or admin)
- **Body**:
  ```json
  {
    "comment": "Updated comment text"
  }
  ```

#### Delete Comment
- **DELETE** `/api/comments/comments/:comment_id`
- **Auth**: Required (owner or admin)

---

## 2. **Escalation System** (`/api/escalations`)

### Purpose
Escalate unresolved grievances to higher authorities with tracking of escalation levels and status.

### Endpoints

#### Escalate Grievance
- **POST** `/api/escalations/:grievance_id/escalate`
- **Auth**: Required
- **Body**:
  ```json
  {
    "reason": "Not resolved within SLA",
    "escalated_to": 3
  }
  ```
- **Response**: 201 Created
  ```json
  {
    "success": true,
    "message": "Grievance escalated successfully",
    "escalation": {
      "id": 1,
      "grievance_id": 5,
      "reason": "Not resolved within SLA",
      "escalation_level": 1,
      "escalated_by": 2,
      "escalated_to": 3
    }
  }
  ```

#### Get Escalation History
- **GET** `/api/escalations/:grievance_id/escalations`
- **Auth**: Required
- **Response**: List of all escalations for the grievance

#### Update Escalation Status
- **PATCH** `/api/escalations/:escalation_id/status`
- **Auth**: Required (escalated_to user or admin)
- **Body**:
  ```json
  {
    "status": "acknowledged"
  }
  ```
- **Status Options**: "pending", "acknowledged", "in_progress", "resolved"

#### Get Pending Escalations
- **GET** `/api/escalations/`
- **Auth**: Required (admin/staff only)
- **Response**: All pending escalations in the system

---

## 3. **Feedback & Rating System** (`/api/feedback`)

### Purpose
Allow citizens to rate and provide feedback on resolved grievances. Generate satisfaction statistics.

### Endpoints

#### Submit Feedback
- **POST** `/api/feedback/:grievance_id/feedback`
- **Auth**: Required
- **Restrictions**: Only for resolved/closed grievances, one feedback per grievance
- **Body**:
  ```json
  {
    "rating": 5,
    "comment": "Issue was resolved satisfactorily"
  }
  ```
- **Response**: 201 Created

#### Get Feedback
- **GET** `/api/feedback/:grievance_id/feedback`
- **Auth**: Required
- **Response**:
  ```json
  {
    "success": true,
    "feedback": {
      "id": 1,
      "grievance_id": 5,
      "user_id": 2,
      "user_name": "John Doe",
      "rating": 5,
      "comment": "Satisfied",
      "created_at": "2026-02-16T10:30:00Z"
    }
  }
  ```

#### Get Feedback Statistics
- **GET** `/api/feedback/stats/all`
- **Auth**: Required (admin only)
- **Response**:
  ```json
  {
    "success": true,
    "stats": {
      "total_feedback": 50,
      "average_rating": 4.2,
      "min_rating": 1,
      "max_rating": 5,
      "five_star": 35,
      "four_star": 10,
      "three_star": 3,
      "two_star": 1,
      "one_star": 1
    }
  }
  ```

#### Get Feedback by Rating
- **GET** `/api/feedback/rating/:rating`
- **Auth**: Required (admin only)
- **Response**: All feedback with specific rating (1-5)

---

## 4. **Notification System** (`/api/notifications`)

### Purpose
Track and manage notifications for all users about grievance updates, escalations, and other events.

### Endpoints

#### Get Notifications
- **GET** `/api/notifications/`
- **Auth**: Required
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)
  - `unread_only`: Show only unread (true/false)
- **Response**:
  ```json
  {
    "success": true,
    "notifications": [
      {
        "id": 1,
        "user_id": 2,
        "grievance_id": 5,
        "type": "status_update",
        "title": "Grievance Status Changed",
        "message": "Your grievance has been marked as in_progress",
        "is_read": false,
        "created_at": "2026-02-16T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
  ```

#### Get Unread Count
- **GET** `/api/notifications/count/unread`
- **Auth**: Required
- **Response**:
  ```json
  {
    "success": true,
    "unread_count": 5
  }
  ```

#### Mark as Read
- **PATCH** `/api/notifications/:notification_id/read`
- **Auth**: Required

#### Mark All as Read
- **PATCH** `/api/notifications/all/read-all`
- **Auth**: Required

#### Delete Notification
- **DELETE** `/api/notifications/:notification_id`
- **Auth**: Required (owner or admin)

### Notification Types
- `status_update`: Grievance status changed
- `assignment`: Grievance assigned to staff
- `comment`: New comment on grievance
- `escalation`: Grievance escalated
- `feedback_requested`: Requesting feedback on resolved grievance

---

## 5. **Status History & Timeline** (`/api/status-history`)

### Purpose
Track all status changes of a grievance with timestamps and reasons.

### Endpoints

#### Get Status History
- **GET** `/api/status-history/:grievance_id/history`
- **Auth**: Required
- **Response**:
  ```json
  {
    "success": true,
    "history": [
      {
        "id": 1,
        "grievance_id": 5,
        "old_status": "open",
        "new_status": "in_progress",
        "changed_by": 3,
        "changed_by_name": "Staff Member 1",
        "reason": "Assigned to staff",
        "created_at": "2026-02-16T09:00:00Z"
      },
      {
        "id": 2,
        "grievance_id": 5,
        "old_status": "in_progress",
        "new_status": "resolved",
        "changed_by": 3,
        "changed_by_name": "Staff Member 1",
        "reason": "Issue fixed",
        "created_at": "2026-02-16T10:30:00Z"
      }
    ]
  }
  ```

#### Get Status Statistics
- **GET** `/api/status-history/stats/all`
- **Auth**: Required (admin only)
- **Response**: Statistics on status transitions and average time spent in each status

---

## 6. **Document Management** (`/api/documents`)

### Purpose
Upload, download, and manage documents/attachments related to grievances.

### Endpoints

#### Upload Document
- **POST** `/api/documents/:grievance_id/documents`
- **Auth**: Required
- **Content-Type**: multipart/form-data
- **Body**: Form file field named "file"
- **Allowed File Types**: PDF, JPG, PNG, DOC, DOCX, TXT
- **Max File Size**: 10MB
- **Response**: 201 Created
  ```json
  {
    "success": true,
    "message": "Document uploaded successfully",
    "document": {
      "id": 1,
      "grievance_id": 5,
      "original_filename": "proof.pdf",
      "stored_filename": "file-1676489400000-123456789.pdf",
      "file_size": 250000
    }
  }
  ```

#### Get Documents
- **GET** `/api/documents/:grievance_id/documents`
- **Auth**: Required
- **Response**:
  ```json
  {
    "success": true,
    "documents": [
      {
        "id": 1,
        "grievance_id": 5,
        "uploaded_by": 2,
        "uploaded_by_name": "John Doe",
        "original_filename": "proof.pdf",
        "stored_filename": "file-1676489400000-123456789.pdf",
        "file_size": 250000,
        "file_type": "application/pdf",
        "created_at": "2026-02-16T10:30:00Z"
      }
    ]
  }
  ```

#### Download Document
- **GET** `/api/documents/documents/:document_id/download`
- **Auth**: Required
- **Response**: File download

#### Delete Document
- **DELETE** `/api/documents/documents/:document_id`
- **Auth**: Required (uploader or admin)

#### Get Storage Statistics
- **GET** `/api/documents/stats/storage`
- **Auth**: Required (admin only)
- **Response**:
  ```json
  {
    "success": true,
    "stats": {
      "total_documents": 150,
      "total_size": 50000000,
      "avg_size": 333333,
      "max_size": 9500000
    }
  }
  ```

---

## Database Schema Changes

### New Tables Created:

1. **grievance_comments**
   - Stores comments on grievances
   - Supports internal (staff-only) comments

2. **grievance_status_history**
   - Tracks all status changes with timestamps
   - Records reason for each change

3. **grievance_escalations**
   - Tracks escalation requests
   - Manages escalation levels and status

4. **grievance_feedback**
   - Stores user feedback and ratings
   - One feedback per grievance per user

5. **grievance_documents**
   - Records uploaded documents
   - Tracks file metadata and uploader

6. **notifications**
   - Stores user notifications
   - Tracks read/unread status

7. **departments**
   - Department management for better organization
   - Next phase integration ready

### Modified Tables:

1. **users**
   - Added `department_id` field for department assignment

---

## Installation & Setup

### 1. Update Dependencies
```bash
cd backend
npm install
```

This will install the new `multer` package for file uploads.

### 2. Update Database
Run the updated `schema.sql` file to create new tables:
```bash
mysql -u your_user -p your_database < database/schema.sql
```

### 3. Create Uploads Directory
The `/backend/uploads` directory has been created automatically.

### 4. Start Server
```bash
npm start    # Production
npm run dev  # Development with nodemon
```

---

## Frontend Integration Examples

### Adding Comment
```javascript
const response = await fetch(`/api/comments/${grievanceId}/comments`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ comment: 'My comment', is_internal: false })
});
```

### Uploading Document
```javascript
const formData = new FormData();
formData.append('file', selectedFile);

const response = await fetch(`/api/documents/${grievanceId}/documents`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

### Getting Notifications
```javascript
const response = await fetch('/api/notifications?unread_only=true', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Submitting Feedback
```javascript
const response = await fetch(`/api/feedback/${grievanceId}/feedback`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ rating: 5, comment: 'Satisfied' })
});
```

### Escalating Grievance
```javascript
const response = await fetch(`/api/escalations/${grievanceId}/escalate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ reason: 'Not resolved', escalated_to: staffId })
});
```

---

## Authorization Levels

### Public (No Auth Required)
- View categories

### Citizen
- Can create grievances
- Can add public comments
- Can view their own grievances
- Can submit feedback for their resolved grievances
- Can upload documents to their grievances
- Can receive notifications

### Staff
- Can view assigned grievances
- Can add internal comments
- Can escalate grievances
- Can update escalation status
- Can add resolutions
- Can receive notifications

### Admin
- Can view all grievances
- Can add internal comments
- Can view all feedback statistics
- Can view all escalations
- Can manage users and categories
- Can view all notifications

---

## Key Features Summary

| Feature | Type | Purpose |
|---------|------|---------|
| Comments | System | Track discussion on grievances |
| Escalation | System | Handle unresolved grievances |
| Feedback | Analytics | Measure satisfaction |
| Notifications | User | Keep users informed |
| Status History | Tracking | Track grievance lifecycle |
| Documents | Storage | Store evidence & attachments |

---

## Future Enhancements

1. **Department Management** - Assign grievances to departments
2. **SLA Management** - Automatic escalation on SLA breach
3. **Email Notifications** - Send email alerts
4. **SMS Alerts** - Text message updates
5. **Advanced Analytics** - Dashboard with charts
6. **Batch Operations** - Bulk actions on grievances
7. **Export to CSV** - Export grievance data
8. **Web Sockets** - Real-time updates
9. **Mobile App** - Native mobile applications
10. **Audit Logging** - Comprehensive audit trail

---

## API Response Format

All endpoints follow this standard response format:

**Success (2xx)**:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error (4xx/5xx)**:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Error Codes

- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Support & Documentation

For more information, refer to the main README.md and SETUP_GUIDE.md files.
