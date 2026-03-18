import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import RedesignedMainLayout from '../../layouts/RedesignedMainLayout';

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
    <RedesignedMainLayout role="admin">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px', borderBottom: '2px solid #dadce0', paddingBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 500 }}>⚙️ System Settings</h1>
          <p style={{ margin: 0, color: '#5f6368', fontSize: '14px' }}>Manage your grievance redressal system configuration</p>
        </div>

        {saved && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '24px',
            borderRadius: '4px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb'
          }}>
            ✓ Settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* General Settings */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '24px', borderRadius: '8px', border: '1px solid #dadce0' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 600, color: '#202124', paddingBottom: '12px', borderBottom: '1px solid #dadce0' }}>
              General Settings
            </h2>
            
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#202124', fontSize: '14px' }}>
                  System Name
                </label>
                <input
                  type="text"
                  value={settings.systemName}
                  onChange={(e) => handleSettingChange('systemName', e.target.value)}
                  placeholder="System name"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #dadce0',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    color: '#202124',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#202124', fontSize: '14px' }}>
                  Support Email
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                  placeholder="Support email"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #dadce0',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    color: '#202124',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>
          </div>

          {/* File Upload Settings */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '24px', borderRadius: '8px', border: '1px solid #dadce0' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 600, color: '#202124', paddingBottom: '12px', borderBottom: '1px solid #dadce0' }}>
              📁 File Upload Settings
            </h2>
            
            <div style={{ marginTop: '16px'}}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#202124', fontSize: '14px' }}>
                Max Upload Size (MB)
              </label>
              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => handleSettingChange('maxUploadSize', e.target.value)}
                placeholder="5"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #dadce0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  color: '#202124',
                  fontFamily: 'inherit',
                  marginBottom: '8px'
                }}
              />
              <p style={{ margin: '0', fontSize: '12px', color: '#5f6368' }}>Maximum file size allowed for document uploads</p>
            </div>
          </div>

          {/* Automation Settings */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '24px', borderRadius: '8px', border: '1px solid #dadce0' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 600, color: '#202124', paddingBottom: '12px', borderBottom: '1px solid #dadce0' }}>
              🔄 Automation Settings
            </h2>
            
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 400, color: '#202124', fontSize: '14px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.autoAssignEnabled}
                  onChange={(e) => handleSettingChange('autoAssignEnabled', e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                Enable Auto-Assignment for High Priority Grievances
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 400, color: '#202124', fontSize: '14px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                Send Email Notifications
              </label>
            </div>
          </div>

          {/* Performance Targets */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '24px', borderRadius: '8px', border: '1px solid #dadce0' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 600, color: '#202124', paddingBottom: '12px', borderBottom: '1px solid #dadce0' }}>
              ⚡ Performance Targets
            </h2>
            
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#202124', fontSize: '14px' }}>
                  Escalation Threshold (Days)
                </label>
                <input
                  type="number"
                  value={settings.escalationDaysThreshold}
                  onChange={(e) => handleSettingChange('escalationDaysThreshold', e.target.value)}
                  placeholder="7"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #dadce0',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    color: '#202124',
                    fontFamily: 'inherit',
                    marginBottom: '8px'
                  }}
                />
                <p style={{ margin: '0', fontSize: '12px', color: '#5f6368' }}>Grievances not resolved within this period are auto-flagged for escalation</p>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#202124', fontSize: '14px' }}>
                  Resolution Target (Days)
                </label>
                <input
                  type="number"
                  value={settings.resolutionDaysTarget}
                  onChange={(e) => handleSettingChange('resolutionDaysTarget', e.target.value)}
                  placeholder="30"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #dadce0',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    color: '#202124',
                    fontFamily: 'inherit',
                    marginBottom: '8px'
                  }}
                />
                <p style={{ margin: '0', fontSize: '12px', color: '#5f6368' }}>Target number of days to resolve grievances</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: '#1a73e8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1565c0'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#1a73e8'}
          >
            💾 Save Settings
          </button>
        </form>
      </div>
    </RedesignedMainLayout>
  );
};

export default Settings;
