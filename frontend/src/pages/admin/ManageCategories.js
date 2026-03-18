import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, InputGroup, Row, Col, Card, Pagination, Badge } from 'react-bootstrap';
import * as categoryService from '../../services/categoryService';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';

const ManageCategories = () => {
  // Mock data until API is fully integrated
  const mockCategories = [
    { id: 1, name: 'Water Supply', description: 'Issues related to water supply and maintenance', grievance_count: 5 },
    { id: 2, name: 'Road Maintenance', description: 'Street and road condition complaints', grievance_count: 8 },
    { id: 3, name: 'Electricity', description: 'Power supply and electrical issues', grievance_count: 3 },
    { id: 4, name: 'Sanitation', description: 'Garbage collection and sanitation problems', grievance_count: 6 }
  ];

  const [categories, setCategories] = useState(mockCategories);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      setCategories(response.data?.data || mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredCategories.length / pageSize);

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedCategory(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleEditClick = (category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setFormData({ name: category.name, description: category.description });
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
      setMessage({ type: 'success', text: 'Category deleted successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'danger', text: 'Category name is required' });
      return;
    }

    try {
      if (modalMode === 'add') {
        const newCategory = {
          id: Math.max(...categories.map(c => c.id), 0) + 1,
          ...formData,
          grievance_count: 0
        };
        setCategories([...categories, newCategory]);
        setMessage({ type: 'success', text: 'Category added successfully' });
      } else if (modalMode === 'edit') {
        setCategories(categories.map(c =>
          c.id === selectedCategory.id ? { ...c, ...formData } : c
        ));
        setMessage({ type: 'success', text: 'Category updated successfully' });
      }
      setShowModal(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving category:', error);
      setMessage({ type: 'danger', text: 'Failed to save category' });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <RedesignedMainLayout>
      <Container fluid className="py-4">
        <div style={{ marginBottom: '32px', borderBottom: '2px solid #dadce0', paddingBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 500 }}>📁 Manage Categories</h1>
          <p style={{ margin: 0, color: '#5f6368', fontSize: '14px' }}>Create and manage grievance categories</p>
        </div>
        <div className="mb-4">
          <Button variant="success" onClick={handleAddClick}>
            ➕ Add New Category
          </Button>
        </div>

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
                placeholder="Search by category name or description..."
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
                  <th>Description</th>
                  <th className="text-center">Grievances</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">Loading...</td>
                  </tr>
                ) : paginatedCategories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">No categories found</td>
                  </tr>
                ) : (
                  paginatedCategories.map(category => (
                    <tr key={category.id}>
                      <td className="fw-bold">{category.id}</td>
                      <td><strong>{category.name}</strong></td>
                      <td>{category.description}</td>
                      <td className="text-center">
                        <Badge bg="info">{category.grievance_count}</Badge>
                      </td>
                      <td className="text-center">
                        <Button variant="primary" size="sm" className="me-2" onClick={() => handleEditClick(category)}>
                          ✏️ Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteClick(category.id)}>
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

        <Pagination className="justify-content-center mt-4">
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

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {modalMode === 'add' ? '➕ Add New Category' : '✏️ Edit Category'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Category Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </RedesignedMainLayout>
  );
};

export default ManageCategories;
