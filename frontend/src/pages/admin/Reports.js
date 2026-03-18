import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, ProgressBar, Badge } from 'react-bootstrap';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';

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
    <RedesignedMainLayout>
      <Container>
        <div style={{ marginBottom: '32px', borderBottom: '2px solid #dadce0', paddingBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 500 }}>Reports</h1>
          <p style={{ margin: 0, color: '#5f6368', fontSize: '14px' }}>View system reports and statistics</p>
        </div>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Count</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryStats.map((stat, index) => (
                      <tr key={index}>
                        <td>{stat.category}</td>
                        <td>{stat.count}</td>
                        <td>{stat.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </RedesignedMainLayout>
  );
};

export default Reports;
