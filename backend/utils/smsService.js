/**
 * SMS Service using Twilio
 * Sends SMS notifications for complaint updates
 */

// Check if Twilio is configured
const isTwilioConfigured = () => {
  return process.env.TWILIO_ACCOUNT_SID && 
         process.env.TWILIO_AUTH_TOKEN && 
         process.env.TWILIO_PHONE_NUMBER;
};

// Initialize Twilio client only if configured
let twilioClient = null;
if (isTwilioConfigured()) {
  try {
    const twilio = require('twilio');
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✓ Twilio SMS service initialized');
  } catch (error) {
    console.warn('⚠ Twilio not installed. Run: npm install twilio');
  }
}

/**
 * Send SMS notification
 * @param {string} to - Phone number with country code (e.g., +919876543210)
 * @param {string} message - SMS message content
 */
exports.sendSMS = async (to, message) => {
  try {
    // If Twilio not configured, log to console (development mode)
    if (!twilioClient) {
      console.log('\n📱 SMS Notification (Development Mode):');
      console.log(`To: ${to}`);
      console.log(`Message: ${message}`);
      console.log('---');
      return {
        success: true,
        mode: 'development',
        message: 'SMS logged to console (Twilio not configured)'
      };
    }

    // Send actual SMS via Twilio
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    console.log(`✓ SMS sent successfully to ${to}`);
    return {
      success: true,
      mode: 'production',
      sid: result.sid,
      status: result.status
    };

  } catch (error) {
    console.error('SMS sending failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send complaint submission SMS
 */
exports.sendComplaintSubmittedSMS = async (phoneNumber, complaintId, userName) => {
  const message = `Dear ${userName}, your complaint #${complaintId} has been submitted successfully. You will receive updates on this number. - Grievance Redressal System`;
  return await exports.sendSMS(phoneNumber, message);
};

/**
 * Send status update SMS
 */
exports.sendStatusUpdateSMS = async (phoneNumber, complaintId, oldStatus, newStatus, userName) => {
  const message = `Dear ${userName}, your complaint #${complaintId} status has been updated from "${oldStatus}" to "${newStatus}". Check the portal for details. - GRS`;
  return await exports.sendSMS(phoneNumber, message);
};

/**
 * Send resolution SMS
 */
exports.sendResolutionSMS = async (phoneNumber, complaintId, userName) => {
  const message = `Dear ${userName}, your complaint #${complaintId} has been resolved. Please login to view resolution details and provide feedback. - GRS`;
  return await exports.sendSMS(phoneNumber, message);
};

/**
 * Send assignment SMS to staff
 */
exports.sendAssignmentSMS = async (phoneNumber, complaintId, staffName) => {
  const message = `Dear ${staffName}, complaint #${complaintId} has been assigned to you. Please login to the portal to review and take action. - GRS`;
  return await exports.sendSMS(phoneNumber, message);
};

/**
 * Send emergency complaint SMS
 */
exports.sendEmergencySMS = async (phoneNumber, complaintId, title) => {
  const message = `🚨 EMERGENCY: Complaint #${complaintId} marked as EMERGENCY. Title: "${title}". Immediate action required! - GRS`;
  return await exports.sendSMS(phoneNumber, message);
};

module.exports = exports;
