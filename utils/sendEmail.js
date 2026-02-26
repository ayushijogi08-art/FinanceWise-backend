// utils/sendEmail.js
const nodemailer = require('nodemailer');

// Create the transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Shortcut for Gmail config
    auth: {
        user: process.env.GMAIL_USER,  // Your dedicated Gmail (e.g., financewiseapp@gmail.com)
        pass: process.env.GMAIL_APP_PASS  // The 16-char app password
    }
});
module.exports = async (options) => {
    try {
        await transporter.sendMail({
            from: `"FinanceWise" <${process.env.GMAIL_USER}>`,  // Sender name + your Gmail
            to: options.email,  // Dynamic user email
            subject: options.subject,
            text: options.message,  // OTP message
            html: `<p>${options.message}</p>`  // HTML version of the message
        });
        console.log('Email sent successfully to:', options.email);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;  // Rethrow for route handler to catch
    }
};