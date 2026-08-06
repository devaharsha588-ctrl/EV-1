const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:5000/api/v1';

const testSuite = async () => {
  console.log('=== STARTING LIVE API INTEGRATION & AUDIT TEST SUITE ===\n');

  const testEmail = `qa_test_${Date.now()}@ev-ai-test.com`;
  const testPassword = 'Password123!';
  let accessToken = '';

  // 1. Unauthenticated Health Check
  try {
    const res = await axios.get('http://127.0.0.1:5000/health');
    console.log('✅ 1. GET /health -> Status:', res.status, '| Success:', res.data.success);
  } catch (err) {
    console.error('❌ 1. GET /health failed:', err.message);
  }

  // 2. Auth: Register
  try {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'QA Tester',
      email: testEmail,
      password: testPassword,
      profession: 'Full Stack Engineer'
    });
    accessToken = res.data.data.tokens.accessToken;
    console.log('✅ 2. POST /auth/register -> Status:', res.status, '| User ID:', res.data.data.user.id);
  } catch (err) {
    console.error('❌ 2. POST /auth/register failed:', err.response?.data || err.message);
  }

  // 3. Auth: Login
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: testPassword
    });
    accessToken = res.data.data.tokens.accessToken;
    console.log('✅ 3. POST /auth/login -> Status:', res.status, '| Token Received:', Boolean(accessToken));
  } catch (err) {
    console.error('❌ 3. POST /auth/login failed:', err.response?.data || err.message);
  }

  const authHeaders = { headers: { Authorization: `Bearer ${accessToken}` } };

  // 4. Protected: GET /auth/me
  try {
    const res = await axios.get(`${BASE_URL}/auth/me`, authHeaders);
    console.log('✅ 4. GET /auth/me -> Status:', res.status, '| Email:', res.data.data.user.email);
  } catch (err) {
    console.error('❌ 4. GET /auth/me failed:', err.response?.data || err.message);
  }

  // 5. Onboarding: POST /profile/onboarding
  try {
    const res = await axios.post(`${BASE_URL}/profile/onboarding`, {
      profession: 'AI Engineer',
      careerGoal: 'Master LLM Systems & Cloud Deployment',
      skills: ['JavaScript', 'Python', 'Node.js'],
      experienceLevel: 'intermediate'
    }, authHeaders);
    console.log('✅ 5. POST /profile/onboarding -> Status:', res.status, '| Profession:', res.data.data.profile.profession);
  } catch (err) {
    console.error('❌ 5. POST /profile/onboarding failed:', err.response?.data || err.message);
  }

  // 6. Dashboard: GET /dashboard
  try {
    const res = await axios.get(`${BASE_URL}/dashboard`, authHeaders);
    console.log('✅ 6. GET /dashboard -> Status:', res.status, '| Total Keys:', Object.keys(res.data.data).length);
  } catch (err) {
    console.error('❌ 6. GET /dashboard failed:', err.response?.data || err.message);
  }

  // 7. AI Status: GET /ai/status
  try {
    const res = await axios.get(`${BASE_URL}/ai/status`, authHeaders);
    console.log('✅ 7. GET /ai/status -> Status:', res.status, '| Providers:', res.data.data.providers);
  } catch (err) {
    console.error('❌ 7. GET /ai/status failed:', err.response?.data || err.message);
  }

  // 8. AI Chat: POST /chat
  try {
    const res = await axios.post(`${BASE_URL}/chat`, {
      message: 'Hello EV AI, give me 2 key tips for learning backend engineering.',
      provider: 'gemini'
    }, authHeaders);
    console.log('✅ 8. POST /chat -> Status:', res.status, '| Response Length:', res.data.data.reply?.length || 0);
  } catch (err) {
    console.error('❌ 8. POST /chat failed:', err.response?.data || err.message);
  }

  // 9. Roadmap: POST /roadmap/generate
  try {
    const res = await axios.post(`${BASE_URL}/roadmap/generate`, {}, authHeaders);
    console.log('✅ 9. POST /roadmap/generate -> Status:', res.status, '| Milestones:', res.data.data.roadmap.milestones?.length || 0);
  } catch (err) {
    console.error('❌ 9. POST /roadmap/generate failed:', err.response?.data || err.message);
  }

  // 10. Recommendations: GET /recommendations
  try {
    const res = await axios.get(`${BASE_URL}/recommendations`, authHeaders);
    console.log('✅ 10. GET /recommendations -> Status:', res.status, '| Recs Count:', res.data.data.recommendations?.length || 0);
  } catch (err) {
    console.error('❌ 10. GET /recommendations failed:', err.response?.data || err.message);
  }

  // 11. Analytics: GET /analytics/weekly-progress
  try {
    const res = await axios.get(`${BASE_URL}/analytics/weekly-progress`, authHeaders);
    console.log('✅ 11. GET /analytics/weekly-progress -> Status:', res.status, '| Data:', res.data.data);
  } catch (err) {
    console.error('❌ 11. GET /analytics/weekly-progress failed:', err.response?.data || err.message);
  }

  // 12. Security Test: Invalid Token
  try {
    await axios.get(`${BASE_URL}/auth/me`, { headers: { Authorization: 'Bearer INVALID_JWT_TOKEN' } });
    console.error('❌ 12. Invalid Token Test Failed — Request should have been rejected!');
  } catch (err) {
    console.log('✅ 12. Invalid Token Defense -> Status:', err.response?.status, '| Message:', err.response?.data?.message);
  }

  // 13. Security Test: Validation Error Format
  try {
    await axios.post(`${BASE_URL}/auth/login`, { email: 'invalid_email', password: '' });
    console.error('❌ 13. Validation Test Failed — Request should have been rejected!');
  } catch (err) {
    console.log('✅ 13. Input Validation Defense -> Status:', err.response?.status, '| Errors Array Present:', Array.isArray(err.response?.data?.errors));
  }

  console.log('\n=== LIVE TEST SUITE COMPLETED ===');
};

testSuite();
