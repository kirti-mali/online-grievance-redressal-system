const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

// Create a new complaint
router.post('/', complaintController.createComplaint);

// Get all complaints
router.get('/', complaintController.getAllComplaints);

// Get a single complaint by ID
router.get('/:id', complaintController.getComplaintById);

// Update a complaint
router.put('/:id', complaintController.updateComplaint);

// Delete a complaint
router.delete('/:id', complaintController.deleteComplaint);

module.exports = router;