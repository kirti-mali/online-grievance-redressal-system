import React, { useState, useEffect } from 'react';
import * as grievanceService from '../../services/grievanceService';
import './Admin.css'; // Corrected the relative path to Admin.css
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';

const AdminManageComplaints = () => {
  const [grievances, setGrievances] = useState([]);
  const [filteredGrievances, setFilteredGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  });

  useEffect(() => {
    loadGrievances();
    loadStaff();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [grievances, filters]);

  const loadGrievances = async () => {
    try {
      const response = await grievanceService.getAllGrievances();
      if (response.data.success) {
        setGrievances(response.data.grievances);
      }
    } catch (err) {
      console.error('Failed to load grievances');
    } finally {
      setLoading(false);
    }
  };

  const loadStaff = async () => {
    try {
      const response = await grievanceService.getStaffMembers();
      if (response.data.success) {
        setStaffList(response.data.staff);
      }
    } catch (err) {
      console.error('Failed to load staff');
    }
  };

  const applyFilters = () => {
    let filtered = grievances;

    if (filters.status !== 'all') {
      filtered = filtered.filter(g => g.status === filters.status);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(g => g.priority === filters.priority);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(g => g.category_id === parseInt(filters.category));
    }

    if (filters.search) {
      filtered = filtered.filter(g =>
        g.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        g.id.toString().includes(filters.search)
      );
    }

    setFilteredGrievances(filtered);
  };

  const handleAssignStaff = async (staffId) => {
    try {
      await grievanceService.assignGrievance(selectedGrievance.id, staffId);
      setShowAssignModal(false);
      loadGrievances();
    } catch (err) {
      console.error('Failed to assign grievance');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await grievanceService.updateGrievanceStatus(selectedGrievance.id, newStatus);
      setShowStatusModal(false);
      loadGrievances();
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  return (
    <RedesignedMainLayout>
      <div className="admin-page-container">
        <div style={{ marginBottom: '32px', borderBottom: '2px solid #dadce0', paddingBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 500 }}>⚙️ Manage Complaints</h1>
          <p style={{ margin: 0, color: '#5f6368', fontSize: '14px' }}>Review, assign, and resolve all complaints</p>
        </div>

        {/* Filters */}
        <div className="admin-filters">
          <input
            type="text"
            placeholder="Search by ID or title..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="filter-input"
          />
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="filter-select"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Complaints Table */}
        <div className="complaints-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8">Loading...</td></tr>
              ) : filteredGrievances.length > 0 ? (
                filteredGrievances.map(grievance => (
                  <tr key={grievance.id}>
                    <td>#{grievance.id}</td>
                    <td className="title-cell">{grievance.title}</td>
                    <td>{grievance.category_name}</td>
                    <td>
                      <span className={`priority-badge priority-${grievance.priority}`}>
                        {grievance.priority.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${grievance.status}`}>
                        {grievance.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{grievance.assigned_staff_name || 'Unassigned'}</td>
                    <td>{new Date(grievance.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedGrievance(grievance);
                          setShowAssignModal(true);
                        }}
                        className="action-btn assign-btn"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => {
                          setSelectedGrievance(grievance);
                          setShowStatusModal(true);
                        }}
                        className="action-btn status-btn"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8">No complaints found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Assign Modal */}
        {showAssignModal && selectedGrievance && (
          <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Assign Complaint #{selectedGrievance.id}</h3>
              <div className="staff-list">
                {staffList.map(staff => (
                  <button
                    key={staff.id}
                    onClick={() => handleAssignStaff(staff.id)}
                    className="staff-option"
                  >
                    {staff.name} ({staff.email})
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAssignModal(false)} className="close-btn">
                Close
              </button>
            </div>
          </div>
        )}

        {/* Status Modal */}
        {showStatusModal && selectedGrievance && (
          <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Update Status for Complaint #{selectedGrievance.id}</h3>
              <div className="status-options">
                {['open', 'in_progress', 'resolved', 'closed'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(status)}
                    className={`status-option ${selectedGrievance.status === status ? 'current' : ''}`}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowStatusModal(false)} className="close-btn">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </RedesignedMainLayout>
  );
};

export default AdminManageComplaints;
