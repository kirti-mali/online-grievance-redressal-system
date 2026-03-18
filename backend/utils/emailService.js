// Email Service for sending notifications
// Note: Configure with your email provider (Gmail, SendGrid, etc.)

const nodemailer = require('nodemailer');

// Create transporter (configure with your email service)
const createTransporter = () => {
  // For development, use ethereal email (fake SMTP)
  // For production, use real SMTP credentials
  
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  
  // Default: Log emails to console in development
  return {
    sendMail: async (mailOptions) => {
      console.log('\n📧 Email would be sent:');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Body:', mailOptions.text || mailOptions.html);
      console.log('---\n');
      return { messageId: 'dev-' + Date.now() };
    }
  };
};

const transporter = createTransporter();

/**
 * Send complaint submission confirmation email
 */
exports.sendComplaintSubmissionEmail = async (userEmail, userName, complaintId, complaintTitle) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@grievance.com',
    to: userEmail,
    subject: `Complaint Submitted Successfully - ID: ${complaintId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Complaint Submitted Successfully</h2>
        <p>Dear ${userName},</p>
        <p>Your complaint has been successfully submitted to our system.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Complaint ID:</strong> ${complaintId}</p>
          <p><strong>Title:</strong> ${complaintTitle}</p>
          <p><strong>Status:</strong> Open</p>
        </div>
        
        <p>You can track your complaint status using the Complaint ID provided above.</p>
        <p>We will notify you of any updates regarding your complaint.</p>
        
        <p>Thank you for using our Grievance Redressal System.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #7f8c8d; font-size: 12px;">
          This is an automated email. Please do not reply to this message.
        </p>
      </div>
    `,
    text: `Dear ${userName},\n\nYour complaint has been successfully submitted.\n\nComplaint ID: ${complaintId}\nTitle: ${complaintTitle}\nStatus: Open\n\nThank you for using our Grievance Redressal System.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Complaint submission email sent to ${userEmail}`);
  } catch (error) {
    console.error('❌ Error sending complaint submission email:', error);
  }
};

/**
 * Send status update notification email
 */
exports.sendStatusUpdateEmail = async (userEmail, userName, complaintId, complaintTitle, oldStatus, newStatus, notes) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@grievance.com',
    to: userEmail,
    subject: `Complaint Status Updated - ID: ${complaintId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Complaint Status Updated</h2>
        <p>Dear ${userName},</p>
        <p>The status of your complaint has been updated.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Complaint ID:</strong> ${complaintId}</p>
          <p><strong>Title:</strong> ${complaintTitle}</p>
          <p><strong>Previous Status:</strong> <span style="color: #e74c3c;">${oldStatus}</span></p>
          <p><strong>New Status:</strong> <span style="color: #27ae60;">${newStatus}</span></p>
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        </div>
        
        <p>You can view more details by logging into your account.</p>
        
        <p>Thank you for your patience.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #7f8c8d; font-size: 12px;">
          This is an automated email. Please do not reply to this message.
        </p>
      </div>
    `,
    text: `Dear ${userName},\n\nYour complaint status has been updated.\n\nComplaint ID: ${complaintId}\nTitle: ${complaintTitle}\nPrevious Status: ${oldStatus}\nNew Status: ${newStatus}\n${notes ? `Notes: ${notes}\n` : ''}\nThank you for your patience.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Status update email sent to ${userEmail}`);
  } catch (error) {
    console.error('❌ Error sending status update email:', error);
  }
};

/**
 * Send complaint assignment notification to staff
 */
exports.sendAssignmentEmail = async (staffEmail, staffName, complaintId, complaintTitle, priority) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@grievance.com',
    to: staffEmail,
    subject: `New Complaint Assigned - ID: ${complaintId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">New Complaint Assigned to You</h2>
        <p>Dear ${staffName},</p>
        <p>A new complaint has been assigned to you for resolution.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Complaint ID:</strong> ${complaintId}</p>
          <p><strong>Title:</strong> ${complaintTitle}</p>
          <p><strong>Priority:</strong> <span style="color: ${priority === 'high' ? '#e74c3c' : priority === 'medium' ? '#f39c12' : '#3498db'};">${priority.toUpperCase()}</span></p>
        </div>
        
        <p>Please log in to the system to view details and take action.</p>
        
        <p>Thank you.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #7f8c8d; font-size: 12px;">
          This is an automated email. Please do not reply to this message.
        </p>
      </div>
    `,
    text: `Dear ${staffName},\n\nA new complaint has been assigned to you.\n\nComplaint ID: ${complaintId}\nTitle: ${complaintTitle}\nPriority: ${priority.toUpperCase()}\n\nPlease log in to the system to view details.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Assignment email sent to ${staffEmail}`);
  } catch (error) {
    console.error('❌ Error sending assignment email:', error);
  }
};

/**
 * Send complaint resolution notification
 */
exports.sendResolutionEmail = async (userEmail, userName, complaintId, complaintTitle, resolutionNotes) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@grievance.com',
    to: userEmail,
    subject: `Complaint Resolved - ID: ${complaintId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #27ae60;">✅ Complaint Resolved</h2>
        <p>Dear ${userName},</p>
        <p>We're pleased to inform you that your complaint has been resolved.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Complaint ID:</strong> ${complaintId}</p>
          <p><strong>Title:</strong> ${complaintTitle}</p>
          <p><strong>Status:</strong> <span style="color: #27ae60;">Resolved</span></p>
          ${resolutionNotes ? `<p><strong>Resolution Notes:</strong> ${resolutionNotes}</p>` : ''}
        </div>
        
        <p>We would appreciate your feedback on how we handled your complaint.</p>
        <p>Please log in to rate our service and provide comments.</p>
        
        <p>Thank you for using our Grievance Redressal System.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #7f8c8d; font-size: 12px;">
          This is an automated email. Please do not reply to this message.
        </p>
      </div>
    `,
    text: `Dear ${userName},\n\nYour complaint has been resolved.\n\nComplaint ID: ${complaintId}\nTitle: ${complaintTitle}\nStatus: Resolved\n${resolutionNotes ? `Resolution Notes: ${resolutionNotes}\n` : ''}\nPlease log in to provide feedback.\n\nThank you.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Resolution email sent to ${userEmail}`);
  } catch (error) {
    console.error('❌ Error sending resolution email:', error);
  }
};

module.exports = exports;
