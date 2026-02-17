# Quick Start Guide - New Operations

This guide helps you quickly start using the new operations added to the system.

## Installation Steps

### 1. Update Dependencies
```bash
cd backend
npm install
```

### 2. Update Database
```bash
# Using MySQL CLI
mysql -u username -p database_name < database/schema.sql

# Or import the file through phpMyAdmin/MySQL client
```

### 3. Create Uploads Directory
The directory has been automatically created at `backend/uploads/`

### 4. Restart Server
```bash
npm run dev    # Development mode with auto-reload
# or
npm start      # Production mode
```

---

## API Quick Reference

### Comments
```bash
# Add comment
POST /api/comments/{grievanceId}/comments
Body: { "comment": "text", "is_internal": false }

# Get comments
GET /api/comments/{grievanceId}/comments

# Update comment
PUT /api/comments/comments/{commentId}
Body: { "comment": "updated text" }

# Delete comment
DELETE /api/comments/comments/{commentId}
```

### Escalations
```bash
# Escalate grievance
POST /api/escalations/{grievanceId}/escalate
Body: { "reason": "text", "escalated_to": userId }

# Get escalation history
GET /api/escalations/{grievanceId}/escalations

# Update escalation status
PATCH /api/escalations/{escalationId}/status
Body: { "status": "pending|acknowledged|in_progress|resolved" }

# Get pending escalations (Admin/Staff)
GET /api/escalations/
```

### Feedback
```bash
# Submit feedback (for resolved grievances)
POST /api/feedback/{grievanceId}/feedback
Body: { "rating": 1-5, "comment": "text" }

# Get feedback
GET /api/feedback/{grievanceId}/feedback

# Get feedback stats (Admin)
GET /api/feedback/stats/all

# Get feedback by rating (Admin)
GET /api/feedback/rating/{1-5}
```

### Notifications
```bash
# Get notifications
GET /api/notifications?page=1&limit=10&unread_only=true

# Get unread count
GET /api/notifications/count/unread

# Mark as read
PATCH /api/notifications/{notificationId}/read

# Mark all as read
PATCH /api/notifications/all/read-all

# Delete notification
DELETE /api/notifications/{notificationId}
```

### Status History
```bash
# Get status history
GET /api/status-history/{grievanceId}/history

# Get status statistics (Admin)
GET /api/status-history/stats/all
```

### Documents
```bash
# Upload document (multipart/form-data with 'file' field)
POST /api/documents/{grievanceId}/documents

# Get documents
GET /api/documents/{grievanceId}/documents

# Download document
GET /api/documents/documents/{documentId}/download

# Delete document
DELETE /api/documents/documents/{documentId}

# Get storage stats (Admin)
GET /api/documents/stats/storage
```

---

## Testing the APIs

### Using cURL

**Add Comment:**
```bash
curl -X POST http://localhost:5000/api/comments/1/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"comment":"Great work","is_internal":false}'
```

**Escalate Grievance:**
```bash
curl -X POST http://localhost:5000/api/escalations/1/escalate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"reason":"SLA breach","escalated_to":3}'
```

**Submit Feedback:**
```bash
curl -X POST http://localhost:5000/api/feedback/1/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"rating":5,"comment":"Satisfied"}'
```

**Upload Document:**
```bash
curl -X POST http://localhost:5000/api/documents/1/documents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@proof.pdf"
```

**Get Notifications:**
```bash
curl http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Create a new collection
2. Set Authorization tab to Bearer Token and enter your JWT token
3. Create requests with the endpoints above
4. For file uploads, select "form-data" body and set key to "file" with type "File"

---

## Frontend Integration Examples

### React Example - Add Comment
```javascript
const addComment = async (grievanceId, comment, isInternal = false) => {
  try {
    const response = await fetch(`/api/comments/${grievanceId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ comment, is_internal: isInternal })
    });
    const data = await response.json();
    if (data.success) {
      console.log('Comment added:', data.comment);
      // Update UI
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### React Example - Upload Document
```javascript
const uploadDocument = async (grievanceId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`/api/documents/${grievanceId}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    const data = await response.json();
    if (data.success) {
      console.log('Document uploaded:', data.document);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### React Example - Get Notifications
```javascript
const getNotifications = async () => {
  try {
    const response = await fetch('/api/notifications?unread_only=true', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (data.success) {
      console.log('Notifications:', data.notifications);
      console.log('Unread count:', data.pagination.total);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### React Example - Submit Feedback
```javascript
const submitFeedback = async (grievanceId, rating, comment) => {
  try {
    const response = await fetch(`/api/feedback/${grievanceId}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ rating, comment })
    });
    const data = await response.json();
    if (data.success) {
      console.log('Feedback submitted');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## Common Issues & Solutions

### Issue: "File upload fails with 413 error"
**Solution**: The server is rejecting large files. Check max file size and request size limits.

### Issue: "Cannot GET /api/documents/documents/:id/download"
**Solution**: Ensure the uploads directory exists and has proper read permissions.

### Issue: "CORS error when uploading files"
**Solution**: The CORS headers are properly set. Ensure you're sending the Authorization header.

### Issue: "Notifications not appearing"
**Solution**: Notifications are created automatically when:
- Status changes
- Document uploaded
- Comment added
- Grievance escalated

Make sure the system can properly track these events.

---

## Best Practices

1. **Comments**: Use internal comments for staff-to-staff discussion
2. **Escalations**: Escalate grievances when SLA is about to breach
3. **Feedback**: Request feedback only after resolving grievances
4. **Documents**: Upload evidence and supporting documents early
5. **Notifications**: Check unread count before fetching all notifications
6. **Status History**: Use it for SLA tracking and performance analysis

---

## Advanced Usage

### Get Recent Unread Notifications
```bash
curl "http://localhost:5000/api/notifications?page=1&limit=5&unread_only=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get High-Rated Feedback (Admin)
```bash
curl "http://localhost:5000/api/feedback/rating/5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Current Storage Usage (Admin)
```bash
curl "http://localhost:5000/api/documents/stats/storage" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Escalate to Highest Level
```bash
curl -X POST http://localhost:5000/api/escalations/5/escalate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "reason":"Critical - Impact on multiple citizens",
    "escalated_to":1
  }'
```

---

## File Upload Types Supported

- PDF (.pdf)
- Images (.jpg, .jpeg, .png)
- Documents (.doc, .docx)
- Text (.txt)

**Max file size**: 10MB per file

---

## Need Help?

- Check NEW_OPERATIONS.md for detailed API documentation
- Review SETUP_GUIDE.md for system setup
- Refer to README.md for general information
- Check backend logs for detailed error messages
