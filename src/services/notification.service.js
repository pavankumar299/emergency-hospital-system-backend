const nodemailer = require('nodemailer');
const twilio = require('twilio');

const sendEmail = async ({ to, subject, body }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text: body,
    });

    console.log('Email sent to', to);
    return true;
  } catch (error) {
    console.error('Email error:', error.message);
    return false;
  }
};

const sendSMS = async ({ to, message }) => {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to,
    });

    console.log('SMS sent to', to);
    return true;
  } catch (error) {
    console.error('SMS error:', error.message);
    return false;
  }
};

module.exports = { sendEmail, sendSMS };