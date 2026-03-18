import React from 'react';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const RedesignedDashboard = () => {
  return (
    <RedesignedMainLayout>
      <Container fluid className="py-4">
        <div style={{ marginBottom: '32px', borderBottom: '2px solid #dadce0', paddingBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 500 }}>Admin Dashboard</h1>
          <p style={{ margin: 0, color: '#5f6368', fontSize: '14px' }}>Manage the entire grievance redressal system efficiently.</p>
        </div>
        <Row>
          <Col md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Manage Users</Card.Title>
                <Card.Text>View, add, and manage all users in the system.</Card.Text>
                <Button variant="primary" href="/admin/users">Go to Users</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Manage Grievances</Card.Title>
                <Card.Text>Track and resolve grievances efficiently.</Card.Text>
                <Button variant="primary" href="/admin/grievances">Go to Grievances</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Reports</Card.Title>
                <Card.Text>View detailed analytics and reports.</Card.Text>
                <Button variant="primary" href="/admin/reports">Go to Reports</Button>
              </Card.Body>
            </Card>
          </Col>
      </Container>
    </RedesignedMainLayout>
  );
};

export default RedesignedDashboard;