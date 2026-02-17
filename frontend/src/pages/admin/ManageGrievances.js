import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, InputGroup, Row, Col, Card, Pagination, Badge } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import MainLayout from '../../layouts/MainLayout';
import * as grievanceService from '../../services/grievanceService';

const ManageGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [formData, setFormData] = useState({
    status: 'open',
    assigned_to: '',
    priority: 'medium'
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const response = await grievanceService.getAllGrievances();
      setGrievances(response.data?.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching grievances:', error);
      setMessage({ type: 'danger', text: 'Failed to fetch grievances' });
      setLoading(false);
    }
  };

  const filteredGrievances = grievances.filter(g =>
    (g.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.user_name?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false
  );

  const paginatedGrievances = filteredGrievances.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredGrievances.length / pageSize);

  const handleViewClick = (grievance) => {
    setModalMode('view');
    setSelectedGrievance(grievance);
    setFormData({
      status: grievance.status,
      assigned_to: grievance.assigned_to || '',
      priority: grievance.priority
    });
    setShowModal(true);
  };

  const handleEditClick = (grievance) => {
    setModalMode('edit');
    setSelectedGrievance(grievance);
    setFormData({
      status: grievance.status,
      assigned_to: grievance.assigned_to || '',
      priority: grievance.priority
    });
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this grievance?')) {
      setGrievances(grievances.filter(g => g.id !== id));
      setMessage({ type: 'success', text: 'Grievance deleted successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleSave = async () => {
    try {
      if (modalMode === 'edit') {
        if (formData.status !== selectedGrievance.status) {
          await grievanceService.updateGrievanceStatus(selectedGrievance.id, formData.status);
        }
        
        setGrievances(grievances.map(g =>
          g.id === selectedGrievance.id ? { ...g, ...formData } : g
        ));
        setMessage({ type: 'success', text: 'Grievance updated successfully' });
      }
      setShowModal(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving grievance:', error);
      setMessage({ type: 'danger', text: 'Failed to update grievance' });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': 'danger',
      'in_progress': 'warning',
      'resolved': 'success',
      'closed': 'secondary'
    };
    return colors[status] || 'secondary';
  };

  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar role="admin" />
        <main style={{ flex: 1 }}>
          <Container fluid className="py-4">
            <Row className="mb-4">
              <Col>
                <h2 className="mb-2">📋 Manage Grievances</h2>
                <p className="text-muted">View, edit, and manage all grievances</p>
              </Col>
            </Row>

            {message.text && (
              <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                {message.text}
                <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
              </div>
            )}

            <Card className="mb-4">
              <Card.Body>
                <InputGroup>
                  <InputGroup.Text>🔍</InputGroup.Text>
                  <Form.Control
                    placeholder="Search by title or citizen name..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </InputGroup>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Body className="p-0">
                <Table hover responsive className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Citizen</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Assigned To</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4">Loading...</td>
                      </tr>
                    ) : paginatedGrievances.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4 text-muted">No grievances found</td>
                      </tr>
                    ) : (
                      paginatedGrievances.map(grievance => (
                        <tr key={grievance.id}>
                          <td className="fw-bold">{grievance.id}</td>
                          <td>{grievance.title?.substring(0, 20)}...</td>
                          <td>{grievance.user_name}</td>
                          <td>{grievance.category_name}</td>
                          <td>
                            <Badge bg={getStatusColor(grievance.status)}>
                              {grievance.status?.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={grievance.priority === 'high' ? 'danger' : grievance.priority === 'medium' ? 'warning' : 'info'}>
                              {grievance.priority?.toUpperCase()}
                            </Badge>
                          </td>
                          <td>{grievance.assigned_staff_name || 'Unassigned'}</td>
                          <td className="text-center">
                            <Button variant="info" size="sm" className="me-2" onClick={() => handleViewClick(grievance)}>
                              👁️ View
                            </Button>
                            <Button variant="primary" size="sm" className="me-2" onClick={() => handleEditClick(grievance)}>
                              ✏️ Edit
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteClick(grievance.id)}>
                              🗑️
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                  <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Pagination.Item key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
                      {page}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                  <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
              </div>
            )}
          </Container>
        </main>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'view' ? '👁️ View Grievance' : '✏️ Edit Grievance'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGrievance && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label><strong>Title</strong></Form.Label>
                <Form.Control type="text" value={selectedGrievance.title} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Description</strong></Form.Label>
                <Form.Control as="textarea" rows={3} value={selectedGrievance.description} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Status</strong></Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  disabled={modalMode === 'view'}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Priority</strong></Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleFormChange}
                  disabled={modalMode === 'view'}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {modalMode === 'edit' && (
            <Button variant="primary" onClick={handleSave}>
              Update Grievance
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default ManageGrievances;
