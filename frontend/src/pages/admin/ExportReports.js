import React, { useState } from 'react';
import { Container, Card, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import * as grievanceService from '../../services/grievanceService';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';

const ExportReports = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'all',
    priority: 'all',
    format: 'csv'
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const exportToCSV = async () => {
    try {
      setLoading(true);
      const response = await grievanceService.getAllGrievances();
      const grievances = response.data?.data || [];

      // Filter data
      let filteredData = grievances;
      if (filters.status !== 'all') {
        filteredData = filteredData.filter(g => g.status === filters.status);
      }
      if (filters.priority !== 'all') {
        filteredData = filteredData.filter(g => g.priority === filters.priority);
      }
      if (filters.startDate) {
        filteredData = filteredData.filter(g => new Date(g.created_at) >= new Date(filters.startDate));
      }
      if (filters.endDate) {
        filteredData = filteredData.filter(g => new Date(g.created_at) <= new Date(filters.endDate));
      }

      // Create CSV content
      const headers = ['ID', 'Title', 'Description', 'Category', 'Status', 'Priority', 'Citizen', 'Created Date'];
      const csvContent = [
        headers.join(','),
        ...filteredData.map(g => [
          g.id,
          `"${g.title}"`,
          `"${g.description?.substring(0, 100)}"`,
          g.category_name,
          g.status,
          g.priority,
          g.user_name,
          new Date(g.created_at).toLocaleDateString()
        ].join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `complaints_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();

      setMessage({ type: 'success', text: `Successfully exported ${filteredData.length} complaints to CSV` });
      setLoading(false);
    } catch (error) {
      console.error('Export error:', error);
      setMessage({ type: 'danger', text: 'Failed to export report' });
      setLoading(false);
    }
  };

  const exportToJSON = async () => {
    try {
      setLoading(true);
      const response = await grievanceService.getAllGrievances();
      const grievances = response.data?.data || [];

      // Filter data
      let filteredData = grievances;
      if (filters.status !== 'all') {
        filteredData = filteredData.filter(g => g.status === filters.status);
      }
      if (filters.priority !== 'all') {
        filteredData = filteredData.filter(g => g.priority === filters.priority);
      }

      // Download JSON
      const blob = new Blob([JSON.stringify(filteredData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `complaints_report_${new Date().toISOString().split('T')[0]}.json`;
      a.click();

      setMessage({ type: 'success', text: `Successfully exported ${filteredData.length} complaints to JSON` });
      setLoading(false);
    } catch (error) {
      console.error('Export error:', error);
      setMessage({ type: 'danger', text: 'Failed to export report' });
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (filters.format === 'csv') {
      exportToCSV();
    } else {
      exportToJSON();
    }
  };

  return (
    <RedesignedMainLayout>
      <Container fluid className="py-4">
        <div style={{ marginBottom: '32px', borderBottom: '2px solid #dadce0', paddingBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 500 }}>📊 Export Reports</h1>
          <p style={{ margin: 0, color: '#5f6368', fontSize: '14px' }}>Export complaint data in various formats</p>
        </div>

            {message.text && (
              <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                {message.text}
              </Alert>
            )}

            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="mb-4">Export Filters</h5>
                
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="startDate"
                          value={filters.startDate}
                          onChange={handleFilterChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="endDate"
                          value={filters.endDate}
                          onChange={handleFilterChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select name="status" value={filters.status} onChange={handleFilterChange}>
                          <option value="all">All Status</option>
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Priority</Form.Label>
                        <Form.Select name="priority" value={filters.priority} onChange={handleFilterChange}>
                          <option value="all">All Priority</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Export Format</Form.Label>
                        <Form.Select name="format" value={filters.format} onChange={handleFilterChange}>
                          <option value="csv">CSV (Excel)</option>
                          <option value="json">JSON</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2">
                    <Button variant="primary" onClick={handleExport} disabled={loading}>
                      {loading ? 'Exporting...' : '📥 Export Report'}
                    </Button>
                    <Button variant="secondary" onClick={() => setFilters({
                      startDate: '',
                      endDate: '',
                      status: 'all',
                      priority: 'all',
                      format: 'csv'
                    })}>
                      🔄 Reset Filters
                    </Button>
                  </div>
                </Form>

                <hr className="my-4" />

                <div className="alert alert-info">
                  <h6>📋 Export Information:</h6>
                  <ul className="mb-0">
                    <li>CSV format can be opened in Excel or Google Sheets</li>
                    <li>JSON format is useful for data analysis and backup</li>
                    <li>Use date filters to export specific time periods</li>
                    <li>Filter by status and priority for targeted reports</li>
                  </ul>
                </div>
              </Card.Body>
            </Card>
      </Container>
    </RedesignedMainLayout>
  );
};

export default ExportReports;
