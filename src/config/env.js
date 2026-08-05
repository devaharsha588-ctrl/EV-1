const fs = require('fs');
const path = require('path');
const os = require('os');

require('dotenv').config();

// Load external credentials securely from user profile directory outside project codebase
const secureConfigPath = path.join(os.homedir(), '.ev-ai-secrets', 'credentials.json');
if (fs.existsSync(secureConfigPath)) {
  try {
    const secureConfig = JSON.parse(fs.readFileSync(secureConfigPath, 'utf8'));
    Object.keys(secureConfig).forEach((key) => {
      if (secureConfig[key]) {
        process.env[key] = secureConfig[key];
      }
    });
  } catch (err) {
    // Keep fallback environment settings if file read error occurs
  }
}

const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || 'ev_ai',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me',
    accessExpire: process.env.JWT_ACCESS_EXPIRE || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d'
  },
  cookieSecret: process.env.COOKIE_SECRET || 'dev_cookie_secret_change_me',
  ai: {
    provider: process.env.AI_PROVIDER || 'openai',
    openaiApiKey: process.env.OPENAI_API_KEY,
    grokApiKey: process.env.GROK_API_KEY,
    grokBaseUrl: process.env.GROK_BASE_URL || 'https://api.x.ai/v1',
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
    openrouterBaseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
    testTo: process.env.SMTP_TEST_TO
  },
  supabase: {
    url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  },
  isProduction: process.env.NODE_ENV === 'production'
};

module.exports = env;
