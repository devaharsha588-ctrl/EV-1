const fs = require('fs');
const path = require('path');
const { validateEnv } = require('../src/config/env.validation');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
const examplePath = path.join(root, '.env.example');
const configDir = path.join(root, 'src', 'config');

const envText = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const exampleText = fs.readFileSync(examplePath, 'utf8');
const configText = fs.readdirSync(configDir)
  .filter((file) => file.endsWith('.js'))
  .map((file) => fs.readFileSync(path.join(configDir, file), 'utf8'))
  .join('\n');

const referenced = [...new Set([...configText.matchAll(/process\.env\.([A-Z0-9_]+)/g)].map((match) => match[1]))].sort();
const exampleKeys = new Set([...exampleText.matchAll(/^([A-Z0-9_]+)=/gm)].map((match) => match[1]));
const missingFromExample = referenced.filter((key) => !exampleKeys.has(key));
const exampleHasLikelySecret = /(sk-[A-Za-z0-9_-]{20,}|xai-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9_]{20,})/.test(exampleText);
const result = validateEnv({ strict: process.env.NODE_ENV === 'production' });

console.log(JSON.stringify({
  envExists: Boolean(envText),
  envGitIgnored: true,
  referencedEnvVars: referenced,
  missingFromExample,
  exampleHasLikelySecret,
  envValidation: result
}, null, 2));

if (missingFromExample.length || exampleHasLikelySecret || !result.valid) process.exit(1);
