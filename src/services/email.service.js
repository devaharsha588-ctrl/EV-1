const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../utils/logger');

const getTransport = () => nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined
});

const sendPasswordResetEmail = async (to, token) => {
  if (!env.smtp.host) {
    logger.warn('SMTP is not configured; password reset token generated but email not sent');
    return;
  }

  const resetUrl = `${env.clientUrl}/reset-password?token=${token}`;
  await getTransport().sendMail({
    from: env.smtp.from || env.smtp.user,
    to,
    subject: 'Reset your EV AI password',
    text: `Use this link to reset your password: ${resetUrl}`
  });
};

const verifySmtp = async () => {
  if (!env.smtp.host) throw new Error('SMTP_HOST is not configured');
  await getTransport().verify();
  return true;
};

const sendTestEmail = async () => {
  if (!env.smtp.testTo) throw new Error('SMTP_TEST_TO is not configured');
  await getTransport().sendMail({
    from: env.smtp.from || env.smtp.user,
    to: env.smtp.testTo,
    subject: 'EV AI SMTP test',
    text: 'EV AI SMTP configuration is working.'
  });
};

module.exports = { sendPasswordResetEmail, verifySmtp, sendTestEmail };
