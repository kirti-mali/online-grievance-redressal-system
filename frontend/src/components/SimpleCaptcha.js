import React, { useState, useEffect } from 'react';
import './SimpleCaptcha.css';

const SimpleCaptcha = ({ onVerify }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  // Generate random captcha text
  const generateCaptcha = React.useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput('');
    setIsVerified(false);
    setError('');
    onVerify(false);
  }, [onVerify]);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleVerify = () => {
    if (userInput === captchaText) {
      setIsVerified(true);
      setError('');
      onVerify(true);
    } else {
      setError('Incorrect CAPTCHA. Please try again.');
      setIsVerified(false);
      onVerify(false);
      generateCaptcha();
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    setError('');
  };

  return (
    <div className="captcha-container">
      <div className="captcha-box">
        <div className="captcha-text" style={{
          background: `linear-gradient(${Math.random() * 360}deg, #f0f0f0, #e0e0e0)`,
          fontFamily: 'monospace',
          fontSize: '24px',
          fontWeight: 'bold',
          padding: '10px 20px',
          borderRadius: '5px',
          letterSpacing: '5px',
          userSelect: 'none',
          textDecoration: 'line-through',
          color: '#333'
        }}>
          {captchaText}
        </div>
        <button 
          type="button" 
          onClick={generateCaptcha} 
          className="captcha-refresh"
          title="Refresh CAPTCHA"
        >
          🔄
        </button>
      </div>
      
      <div className="captcha-input-group">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Enter CAPTCHA"
          className={`captcha-input ${error ? 'error' : ''} ${isVerified ? 'success' : ''}`}
          disabled={isVerified}
        />
        {!isVerified && (
          <button 
            type="button" 
            onClick={handleVerify}
            className="captcha-verify-btn"
          >
            Verify
          </button>
        )}
        {isVerified && (
          <span className="captcha-success">✓ Verified</span>
        )}
      </div>
      
      {error && <div className="captcha-error">{error}</div>}
    </div>
  );
};

export default SimpleCaptcha;
