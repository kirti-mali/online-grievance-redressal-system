import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Nav, Alert } from 'react-bootstrap';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';
import * as grievanceService from '../../services/grievanceService';

const Performance = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    avgResolutionTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchStaffTasks();
  }, []);

  const fetchStaffTasks = async () => {
    try {
      setLoading(true);
      const response = await grievanceService.getStaffGrievances?.(1, 50);
      const data = response?.data?.data || [];
      setTasks(data);
      
      // Calculate stats
      setStats({
        totalAssigned: data.length,
        open: data.filter(t => t.status === 'open').length,
        inProgress: data.filter(t => t.status === 'in_progress').length,
        resolved: data.filter(t => t.status === 'resolved').length,
        avgResolutionTime: 8 // days (mock value)
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTasks = () => {
    if (filter === 'all') return tasks;
    return tasks.filter(task => task.status === filter);
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

  return (
    <RedesignedMainLayout role="staff">
      <Container fluid className="py-4" style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ marginBottom: '32px', borderBottom: '2px solid #dadce0', paddingBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 500 }}>⚡ Performance Metrics</h1>
          <p style={{ margin: 0, color: '#5f6368', fontSize: '14px' }}>Track your grievance resolution performance and metrics</p>
        </div>

        <Row className="mb-4">
          <Col>
                <h2 className="mb-2">📊 My Performance & Task Management</h2>
                <p className="text-muted">Track your assigned grievances and resolution metrics</p>
              </Col>
            </Row>

            {/* Stats Grid */}
            <Row className="mb-4">
              <Col md={6} lg={4} className="mb-3">
                <Card className="shadow-sm border-0 text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <Card.Body className="text-center">
                    <h3 className="mb-2">{stats.totalAssigned}</h3>
                    <p className="mb-0">Total Assigned</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={4} className="mb-3">
                <Card className="shadow-sm border-0 text-white" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  <Card.Body className="text-center">
                    <h3 className="mb-2">{stats.open}</h3>
                    <p className="mb-0">Open</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={4} className="mb-3">
                <Card className="shadow-sm border-0 text-white" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                  <Card.Body className="text-center">
                    <h3 className="mb-2">{stats.inProgress}</h3>
                    <p className="mb-0">In Progress</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={4} className="mb-3">
                <Card className="shadow-sm border-0 text-white" style={{ background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}>
                  <Card.Body className="text-center">
                    <h3 className="mb-2">{stats.resolved}</h3>
                    <p className="mb-0">Resolved</p>
                  </Card.Body>9
                </Card>
              </Col>
              <Col md={6} lg={4} className="mb-3">
                <Card className="shadow-sm border-0 text-white" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
                  <Card.Body className="text-center">
                    <h3 className="mb-2 text-dark">{stats.avgResolutionTime}</h3>
                    <p className="mb-0 text-dark">Avg Days</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Filter Tabs */}
            <div className="mb-4">
              <Nav variant="pills" className="gap-2">
                {['all', 'open', 'in_progress', 'resolved'].map(f => (
                  <Nav.Item key={f}>
                    <Nav.Link
                      active={filter === f}
                      onClick={() => setFilter(f)}
                      className="cursor-pointer"
                    >
                      {f.replace('_', ' ').toUpperCase()}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </div>

            {/* Task List */}
            <Row>
              <Col>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">📋 Your Assigned Tasks</h5>
                    
                    {loading ? (
                      <Alert variant="info">Loading tasks...</Alert>
                    ) : getFilteredTasks().length === 0 ? (
                      <Alert variant="warning">No tasks found in this category</Alert>
                    ) : (
                      <div>
                        {getFilteredTasks().map((task, index) => (
                          <Card key={task.id} className="mb-3 border-left border-0 border-primary shadow-sm">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-2">
                                    <strong>#{task.id} - {task.title}</strong>
                                  </h6>
                                  <div className="mb-2">
                                    <Badge bg={getPriorityBg(task.priority)} className="me-2">
                                      {task.priority?.toUpperCase()} PRIORITY
                                    </Badge>
                                    <Badge bg={getStatusBg(task.status)}>
                                      {task.status?.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-muted mb-2">
                                <small>
                                  <strong>Category:</strong> {task.category_name} | <strong>Filed by:</strong> {task.user_name}
                                </small>
                              </p>
                              
                              <p className="mb-2">{task.description?.substring(0, 100)}...</p>
                              
                              <p className="text-muted mb-0">
                                <small>Created: {task.created_at ? new Date(task.created_at).toLocaleDateString() : 'N/A'}</small>
                              </p>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
        </Container>
    </RedesignedMainLayout>
  );
};

export default Performance;
