import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Badge, ProgressBar, Alert, Pagination } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import * as grievanceService from '../../services/grievanceService';

const TrackStatus = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGrievances(page);
  }, [page]);

  const fetchGrievances = async (pageNum) => {
    try {
      setLoading(true);
      const response = await grievanceService.getUserGrievances?.(pageNum, 10);
      setGrievances(response?.data?.data || []);
      setTotalPages(response?.data?.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching grievances:', error);
      setGrievances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId) {
      const found = grievances.find(g => g.id.toString() === searchId);
      if (found) {
        navigate(`/citizen/grievance/${found.id}`);
      } else {
        alert('Grievance not found');
      }
    }
  };

  const getStatusBg = (status) => {
    const colors = {
      'open': 'danger',
      'in_progress': 'warning',
      'resolved': 'success',
      'closed': 'secondary'
    };
    return colors[status] || 'secondary';
  };

  const getPriorityBg = (priority) => {
    const colors = {
      'high': 'danger',
      'medium': 'warning',
      'low': 'success'
    };
    return colors[priority] || 'secondary';
  };

  const getProgressPercentage = (status) => {
    switch(status) {
      case 'open': return 25;
      case 'in_progress': return 50;
      case 'resolved': return 100;
      case 'closed': return 100;
      default: return 0;
    }
  };

  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar role="citizen" />
        <main style={{ flex: 1 }}>
          <Container fluid className="py-4">
            {/* Header */}
            <Row className="mb-4">
              <Col>
                <h2 className="mb-2">📍 Track Your Complaint Status</h2>
                <p className="text-muted">Monitor your grievances and get real-time updates</p>
              </Col>
            </Row>

            {/* Search Section */}
            <Row className="mb-4">
              <Col lg={8} className="mx-auto">
                <Card className="shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">🔍 Quick Complaint Search</h5>
                    <Form onSubmit={handleSearch}>
                      <Row className="g-2">
                        <Col xs={12} sm={9}>
                          <Form.Control
                            type="text"
                            placeholder="Enter Complaint ID (e.g., 123)"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                          />
                        </Col>
                        <Col xs={12} sm={3}>
                          <Button variant="primary" type="submit" className="w-100">
                            🔍 Search
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Main Tracking Area */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h5 className="mb-4">📋 Your Complaints</h5>
                
                {loading ? (
                  <Alert variant="info">Loading your complaints...</Alert>
                ) : grievances.length === 0 ? (
                  <Alert variant="warning">
                    <p>You haven't filed any complaints yet</p>
                    <Button 
                      variant="success"
                      onClick={() => navigate('/citizen/raise-grievance')}
                    >
                      File Your First Complaint
                    </Button>
                  </Alert>
                ) : (
                  <>
                    <Row className="g-3">
                      {grievances.map(grievance => (
                        <Col md={6} lg={4} key={grievance.id}>
                          <Card 
                            className="h-100 shadow-sm cursor-pointer"
                            onClick={() => navigate(`/citizen/grievance/${grievance.id}`)}
                            style={{ cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.02)' } }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            {/* Card Header */}
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="text-muted mb-1">
                                    Complaint #{grievance.id}
                                  </h6>
                                  <h5 className="mb-0">{grievance.title}</h5>
                                </div>
                                <Badge bg={getStatusBg(grievance.status)} className="rounded-pill">
                                  {grievance.status?.replace('_', ' ').toUpperCase()}
                                </Badge>
                              </div>

                              {/* Progress Bar */}
                              <div className="mt-3 mb-3">
                                <ProgressBar 
                                  now={getProgressPercentage(grievance.status)} 
                                  label={`${getProgressPercentage(grievance.status)}%`}
                                  variant={getStatusBg(grievance.status)}
                                />
                              </div>

                              {/* Details */}
                              <div className="border-top pt-3">
                                <Row className="g-3">
                                  <Col xs={6}>
                                    <small className="text-muted d-block mb-1">Category:</small>
                                    <span className="fw-bold">{grievance.category_name}</span>
                                  </Col>
                                  <Col xs={6}>
                                    <small className="text-muted d-block mb-1">Priority:</small>
                                    <Badge bg={getPriorityBg(grievance.priority)}>
                                      {grievance.priority?.toUpperCase()}
                                    </Badge>
                                  </Col>
                                </Row>
                                
                                {grievance.assigned_staff_name && (
                                  <div className="mt-2">
                                    <small className="text-muted d-block mb-1">Assigned To:</small>
                                    <span className="fw-bold">{grievance.assigned_staff_name}</span>
                                  </div>
                                )}
                              </div>

                              {/* Footer */}
                              <div className="border-top mt-3 pt-3 d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                  Filed: {grievance.created_at ? new Date(grievance.created_at).toLocaleDateString() : 'N/A'}
                                </small>
                                <Button variant="link" size="sm" className="p-0">
                                  View Details →
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-center mt-4">
                        <Pagination>
                          <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
                          <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 1} />
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>
                              {p}
                            </Pagination.Item>
                          ))}
                          <Pagination.Next onClick={() => setPage(page + 1)} disabled={page === totalPages} />
                          <Pagination.Last onClick={() => setPage(totalPages)} disabled={page === totalPages} />
                        </Pagination>
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>

            {/* Info Box */}
            <Alert variant="info">
              <h5 className="alert-heading">📌 How to Track Your Complaint</h5>
              <ul className="mb-0 ms-3">
                <li><strong>Open:</strong> Your complaint has been received and is waiting for review</li>
                <li><strong>In Progress:</strong> Our staff is actively working on resolving your complaint</li>
                <li><strong>Resolved:</strong> Your complaint has been resolved and is awaiting closure</li>
                <li><strong>Closed:</strong> Your complaint has been successfully closed</li>
              </ul>
            </Alert>
          </Container>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default TrackStatus;
