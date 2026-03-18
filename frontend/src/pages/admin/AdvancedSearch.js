import React, { useState } from 'react';
import { Container, Card, Form, Row, Col, Button, Table, Badge } from 'react-bootstrap';
import * as grievanceService from '../../services/grievanceService';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';
import './AdvancedSearch.css';

const AdvancedSearch = () => {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    status: '',
    priority: '',
    category: '',
    startDate: '',
    endDate: '',
    assignedTo: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await grievanceService.getAllGrievances();
      let grievances = response.data?.data || [];

      // Apply filters
      if (searchParams.keyword) {
        grievances = grievances.filter(g =>
          g.title?.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
          g.description?.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
          g.user_name?.toLowerCase().includes(searchParams.keyword.toLowerCase())
        );
      }

      if (searchParams.status) {
        grievances = grievances.filter(g => g.status === searchParams.status);
      }

      if (searchParams.priority) {
        grievances = grievances.filter(g => g.priority === searchParams.priority);
      }

      if (searchParams.category) {
        grievances = grievances.filter(g => g.category_name?.toLowerCase().includes(searchParams.category.toLowerCase()));
      }

      if (searchParams.startDate) {
        grievances = grievances.filter(g => new Date(g.created_at) >= new Date(searchParams.startDate));
      }

      if (searchParams.endDate) {
        grievances = grievances.filter(g => new Date(g.created_at) <= new Date(searchParams.endDate));
      }

      setResults(grievances);
      setSearched(true);
      setLoading(false);
    } catch (error) {
      console.error('Search error:', error);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({
      keyword: '',
      status: '',
      priority: '',
      category: '',
      startDate: '',
      endDate: '',
      assignedTo: ''
    });
    setResults([]);
    setSearched(false);
  };

  const getStatusBadge = (status) => {
    const colors = {
      open: 'danger',
      in_progress: 'warning',
      resolved: 'success',
      closed: 'secondary'
    };
    return <Badge bg={colors[status] || 'secondary'}>{status?.toUpperCase()}</Badge>;
  };

  return (
    <RedesignedMainLayout>
      <Container fluid className="py-4">
        <div style={{ marginBottom: '32px', borderBottom: '2px solid #dadce0', paddingBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 500 }}>🔍 Advanced Search</h1>
          <p style={{ margin: 0, color: '#5f6368', fontSize: '14px' }}>Search for complaints with advanced filters</p>
        </div>

            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h5 className="mb-4">Search Filters</h5>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>🔎 Keyword Search</Form.Label>
                        <Form.Control
                          type="text"
                          name="keyword"
                          value={searchParams.keyword}
                          onChange={handleInputChange}
                          placeholder="Search in title, description, or citizen name..."
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>📊 Status</Form.Label>
                        <Form.Select name="status" value={searchParams.status} onChange={handleInputChange}>
                          <option value="">All Status</option>
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>⚡ Priority</Form.Label>
                        <Form.Select name="priority" value={searchParams.priority} onChange={handleInputChange}>
                          <option value="">All Priority</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>📁 Category</Form.Label>
                        <Form.Control
                          type="text"
                          name="category"
                          value={searchParams.category}
                          onChange={handleInputChange}
                          placeholder="Enter category name..."
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>📅 Start Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="startDate"
                          value={searchParams.startDate}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>📅 End Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="endDate"
                          value={searchParams.endDate}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2">
                    <Button variant="primary" onClick={handleSearch} disabled={loading}>
                      {loading ? 'Searching...' : '🔍 Search'}
                    </Button>
                    <Button variant="secondary" onClick={handleReset}>
                      🔄 Reset
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {searched && (
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Search Results</h5>
                    <Badge bg="primary" className="fs-6">{results.length} Results Found</Badge>
                  </div>

                  {results.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <div style={{ fontSize: '3rem' }}>🔍</div>
                      <p>No complaints found matching your search criteria</p>
                    </div>
                  ) : (
                    <Table hover responsive>
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Citizen</th>
                          <th>Category</th>
                          <th>Status</th>
                          <th>Priority</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map(complaint => (
                          <tr key={complaint.id}>
                            <td className="fw-bold">#{complaint.id}</td>
                            <td>{complaint.title}</td>
                            <td>{complaint.user_name}</td>
                            <td>{complaint.category_name}</td>
                            <td>{getStatusBadge(complaint.status)}</td>
                            <td>
                              <Badge bg={complaint.priority === 'high' ? 'danger' : complaint.priority === 'medium' ? 'warning' : 'info'}>
                                {complaint.priority?.toUpperCase()}
                              </Badge>
                            </td>
                            <td>{new Date(complaint.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
      </Container>
    </RedesignedMainLayout>
  );
};

export default AdvancedSearch;
