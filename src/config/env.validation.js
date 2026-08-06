const env = require('./env');

const placeholderValues = new Set([
  'replace_with_long_random_access_secret',
  'replace_with_long_random_refresh_secret',
  'replace_with_long_random_cookie_secret',
  'dev_access_secret_change_me',
  'dev_refresh_secret_change_me',
  'dev_cookie_secret_change_me',
  'replace_with_database_password',
  'replace_with_openai_api_key',
  'replace_with_grok_api_key',
  'replace_with_openrouter_api_key',
  'replace_with_smtp_user',
  'replace_with_smtp_password',
  'replace_with_supabase_url',
  'replace_with_supabase_anon_key'
]);

const isMissing = (value) => value === undefined || value === null || value === '';

const assertLongSecret = (name, value, errors) => {
  if (isMissing(value)) {
    errors.push(`${name} is required`);
    return;
  }
  if (placeholderValues.has(value)) errors.push(`${name} must not use the default placeholder value`);
  if (String(value).length < 32) errors.push(`${name} must be at least 32 characters`);
};

const validateEnv = ({ strict = env.isProduction } = {}) => {
  const errors = [];
  const warnings = [];

  if (!['development', 'test', 'production'].includes(env.nodeEnv)) {
    errors.push('NODE_ENV must be development, test, or production');
  }

  if (!Number.isInteger(env.port) || env.port <= 0) errors.push('PORT must be a positive integer');
  if (isMissing(env.clientUrl)) errors.push('CLIENT_URL is required');
  if (isMissing(env.db.host)) errors.push('DB_HOST is required');
  if (!Number.isInteger(env.db.port) || env.db.port <= 0) errors.push('DB_PORT must be a positive integer');
  if (isMissing(env.db.name)) errors.push('DB_NAME is required');
  if (isMissing(env.db.user)) errors.push('DB_USER is required');
  if (strict && isMissing(env.db.password)) errors.push('DB_PASSWORD is required in production');

  assertLongSecret('JWT_ACCESS_SECRET', env.jwt.accessSecret, strict ? errors : warnings);
  assertLongSecret('JWT_REFRESH_SECRET', env.jwt.refreshSecret, strict ? errors : warnings);
  assertLongSecret('COOKIE_SECRET', env.cookieSecret, strict ? errors : warnings);

  if (!['gemini', 'openai', 'grok', 'openrouter'].includes(env.ai.provider)) errors.push('AI_PROVIDER must be gemini, openai, grok, or openrouter');
  if (strict && env.ai.provider === 'gemini' && isMissing(env.ai.geminiApiKey)) errors.push('GEMINI_API_KEY is required when AI_PROVIDER=gemini');
  if (strict && env.ai.provider === 'openai' && isMissing(env.ai.openaiApiKey)) errors.push('OPENAI_API_KEY is required when AI_PROVIDER=openai');
  if (strict && env.ai.provider === 'grok' && isMissing(env.ai.grokApiKey)) errors.push('GROK_API_KEY is required when AI_PROVIDER=grok');
  if (env.ai.provider === 'grok' && isMissing(env.ai.grokBaseUrl)) errors.push('GROK_BASE_URL is required when AI_PROVIDER=grok');
  if (strict && env.ai.provider === 'openrouter' && isMissing(env.ai.openrouterApiKey)) errors.push('OPENROUTER_API_KEY is required when AI_PROVIDER=openrouter');
  if (env.ai.provider === 'openrouter' && isMissing(env.ai.openrouterBaseUrl)) errors.push('OPENROUTER_BASE_URL is required when AI_PROVIDER=openrouter');
  if (strict) {
    if (isMissing(env.smtp.host)) errors.push('SMTP_HOST is required in production');
    if (!Number.isInteger(env.smtp.port) || env.smtp.port <= 0) errors.push('SMTP_PORT must be a positive integer');
    if (isMissing(env.smtp.user)) errors.push('SMTP_USER is required in production');
    if (isMissing(env.smtp.pass)) errors.push('SMTP_PASS is required in production');
  }

  return { valid: errors.length === 0, errors, warnings };
};

module.exports = { validateEnv };
