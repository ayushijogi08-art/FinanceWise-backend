const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create the Transporter (The Engine connecting to Google)
    const transporter = nodemailer.createTransport({
       host: "smtp.resend.com",
        port: 587,
        secure: false,
        auth: {
            user: "resend",
            pass: process.env.RESEND_API_KEY,
        },
    });

    // 2. Define the Email Options (The Payload)
    const mailOptions = {
        
        from: 'FinanceWise Security <onboarding@resend.dev>', 
        
        to: options.email, // This MUST be the exact email you registered your Resend account with
        subject: options.subject,
        text: options.message, 
    };

    console.log(`🔵 Attempting to send OTP via Resend to ${options.email}...`);
    await transporter.sendMail(mailOptions);
    console.log("✅ SUCCESS: Resend accepted the email!");
};

module.exports = sendEmail;