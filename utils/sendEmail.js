const { Resend } = require('resend');

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
    try {
        console.log(`🚀 Sending API request to Resend for: ${options.email}`);

        const { data, error } = await resend.emails.send({
            from: 'FinanceWise Security <onboarding@resend.dev>',
            to: options.email,
            subject: options.subject,
            text: options.message,
        });

        if (error) {
            console.error("🚨 RESEND API ERROR:", error);
            throw new Error(error.message);
        }

        console.log("✅ EMAIL SENT VIA API:", data.id);
    } catch (err) {
        console.error("🚨 FATAL EMAIL CRASH:", err);
        throw err; // Send this back to authRoutes.js
    }
};

module.exports = sendEmail;