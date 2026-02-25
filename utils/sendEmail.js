const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create the Transporter (The Engine connecting to Google)
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 2. Define the Email Options (The Payload)
    const mailOptions = {
        from: `FinanceWise Security <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message, // The actual OTP message
    };

    // 3. Fire the Email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;