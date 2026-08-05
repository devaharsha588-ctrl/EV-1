const { createClient } = require('@supabase/supabase-js');
const env = require('../config/env');
const logger = require('../utils/logger');

let supabaseClient = null;

if (env.supabase.url && env.supabase.anonKey) {
  try {
    supabaseClient = createClient(env.supabase.url, env.supabase.anonKey);
    logger.info('Supabase client initialized', { url: env.supabase.url });
  } catch (error) {
    logger.error('Failed to initialize Supabase client', { message: error.message });
  }
} else {
  logger.warn('Supabase URL or Anon Key missing in environment configuration');
}

const verifySupabaseConnection = async () => {
  if (!supabaseClient) {
    return { connected: false, error: 'Supabase client is not configured' };
  }
  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
      return { connected: false, error: error.message };
    }
    return { connected: true, url: env.supabase.url, sessionStatus: 'active' };
  } catch (err) {
    return { connected: false, error: err.message };
  }
};

module.exports = {
  supabase: supabaseClient,
  verifySupabaseConnection
};
