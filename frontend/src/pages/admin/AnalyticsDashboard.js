import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import * as grievanceService from '../../services/grievanceService';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await grievanceService.getAllGrievances();
      const grievances = response.data?.data || [];

      const statistics = {
        total: grievances.length,
        open: grievances.filter(g => g.status === 'open').length,
        inProgress: grievances.filter(g => g.status === 'in_progress').length,
        resolved: grievances.filter(g => g.status === 'resolved').length,
        closed: grievances.filter(g => g.status === 'closed').length,
        high: grievances.filter(g => g.priority === 'high').length,
        medium: grievances.filter(g => g.priority === 'medium').length,
        low: grievances.filter(g => g.priority === 'low').length
      };

      setStats(statistics);
      setLoading(false);
    } catch (error) {
      console.error('Error loading statistics:', error);
      setLoading(false);
    }
  };

  const getPercentage = (value) => {
    return stats.total > 0 ? ((value / stats.total) * 100).toFixed(1) : 0;
  };

  return (
    <RedesignedMainLayout>
      <Container fluid className="py-4">
        <div style={{ marginBottom: '32px', borderBottom: '2px solid #dadce0', paddingBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 500 }}>📊 Analytics Dashboard</h1>
          <p style={{ margin: 0, color: '#5f6368', fontSize: '14px' }}>View detailed analytics and statistics</p>
        </div>

            {loading ? (
              <div className="text-center py-5">Loading statistics...</div>
            ) : (
              <>
                {/* Summary Cards */}
                <Row className="mb-4">
                  <Col md={3}>
                    <Card className="stat-card-modern total">
                      <Card.Body>
                        <div className="stat-icon">📋</div>
                        <h3>{stats.total}</h3>
                        <p>Total Complaints</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="stat-card-modern open">
                      <Card.Body>
                        <div className="stat-icon">🔓</div>
                        <h3>{stats.open}</h3>
                        <p>Open</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="stat-card-modern progress">
                      <Card.Body>
                        <div className="stat-icon">⚙️</div>
                        <h3>{stats.inProgress}</h3>
                        <p>In Progress</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="stat-card-modern resolved">
                      <Card.Body>
                        <div className="stat-icon">✅</div>
                        <h3>{stats.resolved}</h3>
                        <p>Resolved</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Status Chart */}
                <Row className="mb-4">
                  <Col md={6}>
                    <Card className="shadow-sm">
                      <Card.Body>
                        <h5 className="mb-4">Status Distribution</h5>
                        <div className="chart-container">
                          <div className="bar-chart">
                            <div className="bar-item">
                              <div className="bar-label">Open</div>
                              <div className="bar-wrapper">
                                <div className="bar bar-open" style={{ width: `${getPercentage(stats.open)}%` }}>
                                  {stats.open}
                                </div>
                              </div>
                              <div className="bar-percentage">{getPercentage(stats.open)}%</div>
                            </div>
                            <div className="bar-item">
                              <div className="bar-label">In Progress</div>
                              <div className="bar-wrapper">
                                <div className="bar bar-progress" style={{ width: `${getPercentage(stats.inProgress)}%` }}>
                                  {stats.inProgress}
                                </div>
                              </div>
                              <div className="bar-percentage">{getPercentage(stats.inProgress)}%</div>
                            </div>
                            <div className="bar-item">
                              <div className="bar-label">Resolved</div>
                              <div className="bar-wrapper">
                                <div className="bar bar-resolved" style={{ width: `${getPercentage(stats.resolved)}%` }}>
                                  {stats.resolved}
                                </div>
                              </div>
                              <div className="bar-percentage">{getPercentage(stats.resolved)}%</div>
                            </div>
                            <div className="bar-item">
                              <div className="bar-label">Closed</div>
                              <div className="bar-wrapper">
                                <div className="bar bar-closed" style={{ width: `${getPercentage(stats.closed)}%` }}>
                                  {stats.closed}
                                </div>
                              </div>
                              <div className="bar-percentage">{getPercentage(stats.closed)}%</div>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Priority Chart */}
                  <Col md={6}>
                    <Card className="shadow-sm">
                      <Card.Body>
                        <h5 className="mb-4">Priority Distribution</h5>
                        <div className="chart-container">
                          <div className="bar-chart">
                            <div className="bar-item">
                              <div className="bar-label">High Priority</div>
                              <div className="bar-wrapper">
                                <div className="bar bar-high" style={{ width: `${getPercentage(stats.high)}%` }}>
                                  {stats.high}
                                </div>
                              </div>
                              <div className="bar-percentage">{getPercentage(stats.high)}%</div>
                            </div>
                            <div className="bar-item">
                              <div className="bar-label">Medium Priority</div>
                              <div className="bar-wrapper">
                                <div className="bar bar-medium" style={{ width: `${getPercentage(stats.medium)}%` }}>
                                  {stats.medium}
                                </div>
                              </div>
                              <div className="bar-percentage">{getPercentage(stats.medium)}%</div>
                            </div>
                            <div className="bar-item">
                              <div className="bar-label">Low Priority</div>
                              <div className="bar-wrapper">
                                <div className="bar bar-low" style={{ width: `${getPercentage(stats.low)}%` }}>
                                  {stats.low}
                                </div>
                              </div>
                              <div className="bar-percentage">{getPercentage(stats.low)}%</div>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Performance Metrics */}
                <Row>
                  <Col md={4}>
                    <Card className="metric-card">
                      <Card.Body className="text-center">
                        <div className="metric-icon">📈</div>
                        <h3>{getPercentage(stats.resolved + stats.closed)}%</h3>
                        <p>Resolution Rate</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="metric-card">
                      <Card.Body className="text-center">
                        <div className="metric-icon">⚡</div>
                        <h3>{stats.open + stats.inProgress}</h3>
                        <p>Pending Complaints</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="metric-card">
                      <Card.Body className="text-center">
                        <div className="metric-icon">🎯</div>
                        <h3>{getPercentage(stats.high)}%</h3>
                        <p>High Priority</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
      </Container>
    </RedesignedMainLayout>
  );
};

export default AnalyticsDashboard;
