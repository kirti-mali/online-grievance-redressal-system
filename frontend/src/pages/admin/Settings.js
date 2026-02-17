import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';

const Settings = () => {
  const [settings, setSettings] = useState({
    systemName: 'Online Grievance Redressal System',
    supportEmail: 'support@grievance.com',
    maxUploadSize: 5,
    autoAssignEnabled: true,
    emailNotifications: true,
    escalationDaysThreshold: 7,
    resolutionDaysTarget: 30
  });

  const [saved, setSaved] = useState(false);

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    setSaved(false);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar role="admin" />
        <main style={{ flex: 1 }}>
          <Container className="py-4">
            <Row className="mb-4">
              <Col lg={8} className="mx-auto">
                <h2 className="mb-2">⚙️ System Settings</h2>
                <p className="text-muted">Manage your grievance redressal system configuration</p>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col lg={8} className="mx-auto">
                {saved && (
                  <Alert variant="success" dismissible onClose={() => setSaved(false)}>
                    ✓ Settings saved successfully!
                  </Alert>
                )}

                <Card className="shadow-sm">
                  <Card.Body>
                    <Form onSubmit={handleSaveSettings}>
                      {/* General Settings */}
                      <div className="mb-4">
                        <h5 className="mb-3 pb-2 border-bottom">General Settings</h5>
                        
                        <Form.Group className="mb-3">
                          <Form.Label><strong>System Name</strong></Form.Label>
                          <Form.Control
                            type="text"
                            value={settings.systemName}
                            onChange={(e) => handleSettingChange('systemName', e.target.value)}
                            placeholder="System name"
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label><strong>Support Email</strong></Form.Label>
                          <Form.Control
                            type="email"
                            value={settings.supportEmail}
                            onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                            placeholder="Support email"
                          />
                        </Form.Group>
                      </div>

                      {/* File Upload Settings */}
                      <div className="mb-4">
                        <h5 className="mb-3 pb-2 border-bottom">📁 File Upload Settings</h5>
                        
                        <Form.Group className="mb-3">
                          <Form.Label><strong>Max Upload Size (MB)</strong></Form.Label>
                          <Form.Control
                            type="number"
                            value={settings.maxUploadSize}
                            onChange={(e) => handleSettingChange('maxUploadSize', e.target.value)}
                            placeholder="5"
                          />
                          <Form.Text className="d-block mt-2">Maximum file size allowed for document uploads</Form.Text>
                        </Form.Group>
                      </div>

                      {/* Automation Settings */}
                      <div className="mb-4">
                        <h5 className="mb-3 pb-2 border-bottom">🔄 Automation Settings</h5>
                        
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="autoAssign"
                            checked={settings.autoAssignEnabled}
                            onChange={(e) => handleSettingChange('autoAssignEnabled', e.target.checked)}
                            label="Enable Auto-Assignment for High Priority Grievances"
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            id="emailNotif"
                            checked={settings.emailNotifications}
                            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                            label="Send Email Notifications"
                          />
                        </Form.Group>
                      </div>

                      {/* Performance Targets */}
                      <div className="mb-4">
                        <h5 className="mb-3 pb-2 border-bottom">⚡ Performance Targets</h5>
                        
                        <Form.Group className="mb-3">
                          <Form.Label><strong>Escalation Threshold (Days)</strong></Form.Label>
                          <Form.Control
                            type="number"
                            value={settings.escalationDaysThreshold}
                            onChange={(e) => handleSettingChange('escalationDaysThreshold', e.target.value)}
                            placeholder="7"
                          />
                          <Form.Text className="d-block mt-2">Grievances not resolved within this period are auto-flagged for escalation</Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label><strong>Resolution Target (Days)</strong></Form.Label>
                          <Form.Control
                            type="number"
                            value={settings.resolutionDaysTarget}
                            onChange={(e) => handleSettingChange('resolutionDaysTarget', e.target.value)}
                            placeholder="30"
                          />
                          <Form.Text className="d-block mt-2">Target number of days to resolve grievances</Form.Text>
                        </Form.Group>
                      </div>

                      <Button variant="success" type="submit" size="lg" className="w-100">
                        💾 Save Settings
                      </Button>
                    </Form>
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

export default Settings;
