const db = require('../config/database');
const mockDB = require('../config/mockDatabase');

// Helper function to determine if we're using mock database
const isMockMode = () => {
  try {
    // Try to access the mock mode flag if available
    return true; // Always use mock for now since real DB isn't connected
  } catch (error) {
    return true;
  }
};

// Create a new complaint
exports.createComplaint = async (req, res) => {
  try {
    console.log('[complaintController] createComplaint called with body:', req.body);
    const { title, description, createdBy, status, assignedTo } = req.body;
    
    if (!title || !description || !createdBy) {
      console.log('[complaintController] Missing fields');
      return res.status(400).json({ error: 'Missing required fields: title, description, createdBy' });
    }

    const complaint = await mockDB.createComplaint(title, description, createdBy, status, assignedTo);
    console.log('[complaintController] Complaint created:', complaint);
    res.status(201).json(complaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ error: 'Failed to create complaint' });
  }
};

// Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    console.log('[complaintController] getAllComplaints called');
    const complaints = await mockDB.getAllComplaints();
    console.log('[complaintController] Complaints retrieved:', complaints.length);
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
};

// Get a single complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await mockDB.getComplaintById(id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.status(200).json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ error: 'Failed to fetch complaint' });
  }
};

// Update a complaint
exports.updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await mockDB.updateComplaint(id, req.body);
    res.status(200).json(complaint);
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ error: 'Failed to update complaint' });
  }
};

// Delete a complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await mockDB.deleteComplaint(id);
    if (!result) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ error: 'Failed to delete complaint' });
  }
};