import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, InputGroup, Row, Col, Card, Pagination, Badge } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import * as categoryService from '../../services/categoryService';

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
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar role="admin" />
        <main style={{ flex: 1 }}>
          <Container fluid className="py-4">
            <Row className="mb-4 align-items-center">
              <Col>
                <h2 className="mb-2">📁 Manage Categories</h2>
                <p className="text-muted">Create and manage grievance categories</p>
              </Col>
              <Col xs="auto">
                <Button variant="success" onClick={handleAddClick}>
                  ➕ Add New Category
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
            {modalMode === 'add' ? '➕ Add New Category' : '✏️ Edit Category'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label><strong>Category Name *</strong></Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="e.g., Water Supply"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><strong>Description</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Enter category description..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {modalMode === 'add' ? 'Add Category' : 'Update Category'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default ManageCategories;
