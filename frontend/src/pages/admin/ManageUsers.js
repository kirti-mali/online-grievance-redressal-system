import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, InputGroup, Row, Col, Card, Pagination, Badge } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import MainLayout from '../../layouts/MainLayout';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'citizen',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const mockUsers = [
        { id: 1, name: 'Admin User', email: 'admin@grievance.com', role: 'admin', phone: '5551234567', created_at: '2026-01-01' },
        { id: 2, name: 'John Citizen', email: 'john@example.com', role: 'citizen', phone: '5551111111', created_at: '2026-01-05' },
        { id: 3, name: 'Jane Staff', email: 'staff1@grievance.com', role: 'staff', phone: '5552222222', created_at: '2026-01-10' },
        { id: 4, name: 'Bob Smith', email: 'bob@example.com', role: 'citizen', phone: '5553333333', created_at: '2026-01-15' },
      ];
      setUsers(mockUsers);
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to fetch users' });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedUser(null);
    setFormData({ name: '', email: '', role: 'citizen', phone: '', address: '' });
    setShowModal(true);
  };

  const handleEditClick = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || ''
    });
    setShowModal(true);
  };

  const handleDeleteClick = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
      setMessage({ type: 'success', text: 'User deleted successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      setMessage({ type: 'danger', text: 'Name and email are required' });
      return;
    }

    if (modalMode === 'add') {
      const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        ...formData,
        created_at: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
      setMessage({ type: 'success', text: 'User added successfully' });
    } else {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
      setMessage({ type: 'success', text: 'User updated successfully' });
    }
    
    setShowModal(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <MainLayout role="admin">
      <Sidebar role="admin" />
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="mb-2">👥 Manage Users</h2>
            <p className="text-muted">Add, edit, delete, and search users</p>
          </Col>
          <Col className="text-end">
            <Button variant="success" size="lg" onClick={handleAddClick}>
              ➕ Add New User
            </Button>
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
                placeholder="Search by name or email..."
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">Loading...</td>
                  </tr>
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">No users found</td>
                  </tr>
                ) : (
                  paginatedUsers.map(user => (
                    <tr key={user.id}>
                      <td className="fw-bold">{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={user.role === 'admin' ? 'danger' : user.role === 'staff' ? 'warning' : 'info'}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </td>
                      <td>{user.phone || '-'}</td>
                      <td>{user.created_at}</td>
                      <td className="text-center">
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditClick(user)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(user.id)}
                        >
                          🗑️ Delete
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

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'add' ? '➕ Add New User' : '✏️ Edit User'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Enter full name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role *</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
              >
                <option value="citizen">Citizen</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="Enter phone number"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="Enter address"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {modalMode === 'add' ? 'Add User' : 'Update User'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </MainLayout>
  );
};

export default ManageUsers;
