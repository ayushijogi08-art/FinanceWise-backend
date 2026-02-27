const axios = require('axios');

const sendEmail = async (options) => {
    try {
        console.log(`🚀 Sending HTTP request to EmailJS for: ${options.email}`);

        const payload = {
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: process.env.EMAILJS_TEMPLATE_ID,
            user_id: process.env.EMAILJS_PUBLIC_KEY,
            accessToken: process.env.EMAILJS_PRIVATE_KEY,
            template_params: {
                to_email: options.email, // This targets your {{to_email}} box
                otp: options.message     // This targets your {{otp}} variable
            }
        };

        const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', payload);

        if (response.status === 200) {
            console.log("✅ EMAIL SENT SUCCESSFULLY VIA EMAILJS!");
        } else {
            throw new Error("EmailJS rejected the request");
        }
    } catch (err) {
        console.error("🚨 FATAL EMAIL CRASH:", err.response ? err.response.data : err.message);
        throw err;
    }
};

module.exports = sendEmail;