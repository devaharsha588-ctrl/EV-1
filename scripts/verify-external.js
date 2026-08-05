const env = require('../src/config/env');
const { connectDatabase } = require('../src/services/database.service');
const { generateCompletion } = require('../src/services/ai/ai.service');
const emailService = require('../src/services/email.service');
const { verifySupabaseConnection } = require('../src/services/supabase.service');
require('../src/models');

(async () => {
  const report = {};

  try {
    await connectDatabase({ retries: 1 });
    report.database = 'connected';
  } catch (error) {
    report.database = error.friendlyMessage || error.message;
  }

  try {
    const supabaseHealth = await verifySupabaseConnection();
    report.supabase = supabaseHealth.connected ? `connected to ${supabaseHealth.url}` : supabaseHealth.error;
  } catch (error) {
    report.supabase = error.message;
  }

  try {
    if (env.ai.openaiApiKey || env.ai.grokApiKey || env.ai.openrouterApiKey) {
      const response = await generateCompletion('Reply with exactly: ok', { maxTokens: 5, temperature: 0 });
      report.ai = `authenticated via ${response.provider}`;
    } else {
      report.ai = 'no AI key configured';
    }
  } catch (error) {
    report.ai = error.message;
  }

  try {
    await emailService.verifySmtp();
    if (env.smtp.testTo) await emailService.sendTestEmail();
    report.smtp = env.smtp.testTo ? 'test email sent' : 'SMTP credentials verified; SMTP_TEST_TO not set, no email sent';
  } catch (error) {
    report.smtp = error.message;
  }

  console.log(JSON.stringify(report, null, 2));
  if (report.database !== 'connected' && !report.supabase.includes('connected')) process.exitCode = 1;
})();
