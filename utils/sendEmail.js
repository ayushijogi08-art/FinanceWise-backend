// utils/sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 587,
    secure: false,
    auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY
    }
});

module.exports = async (options) => {
    await transporter.sendMail({
        from: `"FinanceWise" <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    });
};