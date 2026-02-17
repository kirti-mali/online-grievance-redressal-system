import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, ProgressBar, Badge } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';

const Reports = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Mock data
  const stats = {
    totalGrievances: 145,
    openGrievances: 32,
    resolvedGrievances: 98,
    closedGrievances: 15,
    averageResolutionTime: '6.5 days'
  };

  const categoryStats = [
    { category: 'Water Supply', count: 45, percentage: 31 },
    { category: 'Road Maintenance', count: 38, percentage: 26 },
    { category: 'Electricity', count: 35, percentage: 24 },
    { category: 'Sanitation', count: 27, percentage: 19 }
  ];

  const priorityStats = [
    { priority: 'High', count: 32, percentage: 22 },
    { priority: 'Medium', count: 78, percentage: 54 },
    { priority: 'Low', count: 35, percentage: 24 }
  ];

  const statusStats = [
    { status: 'Open', count: 32, color: 'danger' },
    { status: 'In Progress', count: 45, color: 'warning' },
    { status: 'Resolved', count: 98, color: 'success' },
    { status: 'Closed', count: 15, color: 'secondary' }
  ];

  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar role="admin" />
        <main style={{ flex: 1 }}>
          <Container fluid className="py-4">
            <Row className="mb-4">
              <Col>
                <h2 className="mb-2">📊 Reports & Analytics</h2>
                <p className="text-muted">System-wide grievance statistics and reports</p>
              </Col>
            </Row>

            {/* Key Metrics */}
            <Row className="mb-4">
              <Col md={6} lg={3} className="mb-3">
                <Card className="shadow-sm border-left-primary">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted mb-2">Total Grievances</p>
                        <h3 className="mb-0">{stats.totalGrievances}</h3>
                      </div>
                      <div style={{ fontSize: '2.5rem' }}>📋</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={3} className="mb-3">
                <Card className="shadow-sm border-left-warning">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted mb-2">Open Grievances</p>
                        <h3 className="mb-0">{stats.openGrievances}</h3>
                      </div>
                      <div style={{ fontSize: '2.5rem' }}>📂</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={3} className="mb-3">
                <Card className="shadow-sm border-left-success">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted mb-2">Resolved</p>
                        <h3 className="mb-0">{stats.resolvedGrievances}</h3>
                      </div>
                      <div style={{ fontSize: '2.5rem' }}>✅</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={3} className="mb-3">
                <Card className="shadow-sm border-left-info">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p className="text-muted mb-2">Avg Resolution</p>
                        <h3 className="mb-0">{stats.averageResolutionTime}</h3>
                      </div>
                      <div style={{ fontSize: '2.5rem' }}>⏱️</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Charts Row */}
            <Row className="mb-4">
              {/* Category Stats */}
              <Col lg={6} className="mb-3">
                <Card className="shadow-sm">
                  <Card.Header className="bg-light">
                    <Card.Title className="mb-0">📁 Grievances by Category</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    {categoryStats.map((item, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span><strong>{item.category}</strong></span>
                          <span><Badge bg="info">{item.count}</Badge></span>
                        </div>
                        <ProgressBar now={item.percentage} label={`${item.percentage}%`} />
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>

              {/* Priority Stats */}
              <Col lg={6} className="mb-3">
                <Card className="shadow-sm">
                  <Card.Header className="bg-light">
                    <Card.Title className="mb-0">⚡ Grievances by Priority</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    {priorityStats.map((item, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span><strong>{item.priority}</strong></span>
                          <span><Badge bg={item.priority === 'High' ? 'danger' : item.priority === 'Medium' ? 'warning' : 'info'}>{item.count}</Badge></span>
                        </div>
                        <ProgressBar now={item.percentage} label={`${item.percentage}%`} />
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Status Stats Table */}
            <Row className="mb-4">
              <Col>
                <Card className="shadow-sm">
                  <Card.Header className="bg-light">
                    <Card.Title className="mb-0">📊 Grievances by Status</Card.Title>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table className="mb-0" hover>
                      <thead className="table-light">
                        <tr>
                          <th>Status</th>
                          <th>Count</th>
                          <th className="text-center">Percentage</th>
                          <th>Badge</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statusStats.map((item, index) => (
                          <tr key={index}>
                            <td><strong>{item.status}</strong></td>
                            <td>{item.count}</td>
                            <td className="text-center">{((item.count / stats.totalGrievances) * 100).toFixed(1)}%</td>
                            <td><Badge bg={item.color}>{item.status.toUpperCase()}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Export Section */}
            <Row>
              <Col>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <h5 className="mb-3">📥 Export Reports</h5>
                        <Row>
                          <Col xs={6} className="mb-2">
                            <Form.Group>
                              <Form.Label>Start Date</Form.Label>
                              <Form.Control type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} />
                            </Form.Group>
                          </Col>
                          <Col xs={6} className="mb-2">
                            <Form.Group>
                              <Form.Label>End Date</Form.Label>
                              <Form.Control type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                      <Col md={6} className="text-md-end">
                        <Button variant="primary" className="me-2 mt-md-4">
                          📄 Export PDF
                        </Button>
                        <Button variant="success" className="mt-md-4">
                          📊 Export Excel
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default Reports;
