const nodemailer = require('nodemailer');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Controller to send an email
const DepartmentCreateSendMail = async (req, res) => {
  const { email, departmentName, departmentId, securityCode, adminName } = req.body;

  if (!email || !departmentName || !departmentId || !securityCode || !adminName) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  try {
    const mailOptions = {
      from: `"Department Management System" <${process.env.EMAIL}>`,
      to: email,
      subject: `Welcome to ${departmentName} Department Management System`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Roboto', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #4CAF50;
            }
            p {
              line-height: 1.5;
            }
            .details {
              background: #f9f9f9;
              border: 1px solid #ddd;
              padding: 10px;
              border-radius: 5px;
              margin: 10px 0;
            }
            .footer {
              margin-top: 20px;
              font-size: 0.9em;
              text-align: center;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to the ${departmentName} Department!</h1>
            <p>We're excited, ${adminName}, to have you on board. Below are your department details:</p>
            <div class="details">
              <p><strong>Department Name:</strong> ${departmentName}</p>
              <p><strong>Department ID:</strong> ${departmentId}</p>
              <p><strong>Security Code:</strong> ${securityCode}</p>
            </div>
            <p>If you have any questions, feel free to reply to this email.</p>
            <p>Best regards,<br>The Department Management System Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Department Management System. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
};

module.exports = { DepartmentCreateSendMail };
