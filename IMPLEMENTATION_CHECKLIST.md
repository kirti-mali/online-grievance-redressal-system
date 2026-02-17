# Migration & Implementation Checklist

Complete this checklist to fully implement the new operations in your system.

## Phase 1: Backend Setup ✓

- [x] Database schema updated with new tables
- [x] New controllers created (6 files)
- [x] New routes created (6 files)
- [x] Validation middleware updated
- [x] Main server.js updated with new routes
- [x] Multer dependency added to package.json
- [x] Uploads directory created

### To Complete Phase 1:
```bash
cd backend
npm install           # Install multer
npm run dev          # Start development server
```

## Phase 2: Database Migration

- [ ] Backup existing database
  ```bash
  mysqldump -u user -p database > backup.sql
  ```

- [ ] Run migration script
  ```bash
  mysql -u user -p database < database/schema.sql
  ```

- [ ] Verify new tables created
  ```bash
  # In MySQL client:
  SHOW TABLES;
  # Should show: grievance_comments, escalations, feedback, etc.
  ```

- [ ] Check data integrity
  ```bash
  SELECT COUNT(*) FROM grievances;
  SELECT COUNT(*) FROM users;
  SELECT COUNT(*) FROM categories;
  ```

## Phase 3: Environment & Configuration

- [ ] `.env` file has required variables:
  ```
  DATABASE_HOST=localhost
  DATABASE_USER=your_user
  DATABASE_PASSWORD=your_password
  DATABASE_NAME=grievance_redressal_system
  JWT_SECRET=your_jwt_secret
  FRONTEND_URL=http://localhost:3000
  PORT=5000
  NODE_ENV=development
  ```

- [ ] Uploads directory writable
  ```bash
  chmod 755 backend/uploads
  ```

- [ ] CORS properly configured for frontend origin

## Phase 4: Testing APIs

### Test Comments API
- [ ] Add comment to grievance
  ```bash
  POST /api/comments/1/comments
  ```
- [ ] Get comments
  ```bash
  GET /api/comments/1/comments
  ```
- [ ] Update comment
- [ ] Delete comment
- [ ] Verify public vs internal comments work

### Test Escalations API
- [ ] Escalate grievance
  ```bash
  POST /api/escalations/1/escalate
  ```
- [ ] Get escalation history
- [ ] Update escalation status
- [ ] Get pending escalations (admin)

### Test Feedback API
- [ ] Submit feedback on resolved grievance
  ```bash
  POST /api/feedback/1/feedback
  ```
- [ ] Get feedback
- [ ] Get feedback stats (admin)
- [ ] Get feedback by rating (admin)

### Test Notifications API
- [ ] Get notifications
  ```bash
  GET /api/notifications
  ```
- [ ] Get unread count
- [ ] Mark as read
- [ ] Mark all as read
- [ ] Delete notification

### Test Documents API
- [ ] Upload document
  ```bash
  POST /api/documents/1/documents
  ```
- [ ] Get documents
- [ ] Download document
- [ ] Delete document
- [ ] Storage stats (admin)

### Test Status History API
- [ ] Get status history
  ```bash
  GET /api/status-history/1/history
  ```
- [ ] Get status statistics (admin)

## Phase 5: Frontend Integration

### Comments Component
- [ ] Create comment input component
- [ ] Display comments list
- [ ] Add edit/delete functionality
- [ ] Show internal flag for staff
- [ ] Real-time comment refresh

### Escalation Feature
- [ ] Add escalate button to grievance details
- [ ] Show escalation history
- [ ] Escalation status update form
- [ ] Pending escalations dashboard

### Feedback System
- [ ] Create feedback form (star rating)
- [ ] Show after grievance is resolved
- [ ] Display feedback stats (admin)
- [ ] Feedback analytics/charts

### Notification System
- [ ] Notification icon with unread count
- [ ] Notification dropdown/list
- [ ] Mark as read functionality
- [ ] Delete notification option
- [ ] Notification bell badge

### Document Management
- [ ] File upload widget
- [ ] Documents list with download
- [ ] File preview capability
- [ ] Delete document functionality

### Status Timeline
- [ ] Timeline component showing status changes
- [ ] Timestamps and responsible user
- [ ] Reason for each change

## Phase 6: Admin Dashboard Updates

- [ ] Feedback analytics widget
- [ ] Escalations management page
- [ ] Status statistics chart
- [ ] Document storage stats
- [ ] Notification management panel

## Phase 7: Security & Permissions

- [ ] Verify role-based access control
  - [ ] Citizens: Can add comments, upload docs, submit feedback
  - [ ] Staff: Can add internal comments, escalate, resolve
  - [ ] Admin: Can view all, access stats, manage everything

- [ ] Test authorization
  - [ ] Citizens cannot see internal comments
  - [ ] Staff cannot delete others' documents
  - [ ] Admin can access everything

- [ ] File upload security
  - [ ] File type validation
  - [ ] File size limits enforced
  - [ ] Malicious filename handling

## Phase 8: Performance Optimization

- [ ] Add database indexes if missing
  ```sql
  CREATE INDEX idx_user_notifications ON notifications(user_id, is_read);
  CREATE INDEX idx_grievance_status ON grievance_status_history(grievance_id);
  ```

- [ ] Implement pagination for lists (already in code)

- [ ] Cache frequently accessed data (future enhancement)

- [ ] Monitor query performance

## Phase 9: Documentation

- [ ] Update API documentation
- [ ] Update user guides
- [ ] Create video tutorials
- [ ] Document new workflows
- [ ] Update ERD diagram

## Phase 10: Testing & QA

- [ ] Unit tests for new controllers
- [ ] Integration tests for new routes
- [ ] User acceptance testing
- [ ] Load testing
- [ ] Security testing

### Test Scenarios to Cover:
- [ ] Normal happy path for each feature
- [ ] Error scenarios (missing data, unauthorized)
- [ ] Edge cases (large files, many comments)
- [ ] Concurrent operations
- [ ] Token expiration handling

## Phase 11: Deployment

- [ ] Update production database
- [ ] Deploy new code to production
- [ ] Verify all APIs working in production
- [ ] Monitor error logs
- [ ] Performance monitoring

## Phase 12: Post-Deployment

- [ ] Gather user feedback
- [ ] Monitor system performance
- [ ] Check for bugs
- [ ] Optimize based on usage patterns
- [ ] Plan Phase 2 enhancements

---

## Implementation Priority Matrix

### Must Have (Sprint 1):
1. Comments system
2. Document upload/download
3. Notifications basic setup
4. Status history tracking

### Should Have (Sprint 2):
1. Escalation system
2. Feedback system
3. Notification enhancements
4. Admin dashboards

### Nice to Have (Future):
1. Real-time updates (WebSockets)
2. Email/SMS notifications
3. Advanced analytics
4. Department management
5. SLA automation

---

## Resource Requirements

### Backend
- Node.js server running
- MySQL/MariaDB database
- 100-500MB disk for file uploads (scalable)
- At least 512MB RAM

### Frontend
- React updated with new components
- Additional npm packages (optional):
  - react-star-ratings (for feedback)
  - react-file-upload (for documents)
  - react-toastify (for notifications)

---

## Common Issues During Migration

### Issue: "Table already exists" error
**Solution**: Drop old tables first or use ALTER commands

### Issue: "Foreign key constraint fails"
**Solution**: Ensure dependent tables are created in correct order

### Issue: "Permission denied" for uploads directory
**Solution**:
```bash
chmod 755 backend/uploads
chown www-data:www-data backend/uploads
```

### Issue: "CORS error" when uploading
**Solution**: Verify CORS configuration in server.js

---

## Rollback Plan

If something goes wrong:

1. Stop the server
2. Restore database backup:
   ```bash
   mysql -u user -p database < backup.sql
   ```
3. Revert code to previous version
4. Address issues
5. Test thoroughly before deploying again

---

## Success Criteria

- [ ] All new APIs respond successfully
- [ ] Database queries execute without errors
- [ ] File uploads working (max 10MB)
- [ ] Notifications created automatically
- [ ] Role-based access control working
- [ ] No security vulnerabilities
- [ ] Performance acceptable (< 200ms per request)
- [ ] All unit tests passing
- [ ] Documentation complete
- [ ] Users trained and satisfied

---

## Follow-up Actions

After implementation:

1. **Week 1**: Monitor system performance and fix critical bugs
2. **Week 2**: Gather feedback from users and staff
3. **Week 3**: Implement feedback improvements
4. **Week 4**: Plan next phase enhancements

---

## Support & Escalation

- **Technical Issues**: Check logs and refer to NEW_OPERATIONS.md
- **Database Issues**: Consult DBA or database documentation
- **Frontend Integration**: Refer to frontend integration examples
- **Critical Production Issues**: Activate rollback plan

---

## Sign-Off

- [ ] Project Manager: _______________  Date: _______
- [ ] Dev Lead: _______________  Date: _______
- [ ] QA Lead: _______________  Date: _______
- [ ] Product Owner: _______________  Date: _______

---

*Last Updated: February 16, 2026*
*Version: 1.0*
