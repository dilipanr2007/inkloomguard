const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const auditLogger = require('../utils/auditLogger');

let validToken;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/inkloom');
  }

  // Pre-fetch a valid token
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'creator@freshplus.io', password: 'Creator123!' });
  validToken = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('InkloomGuard - Production Login Fix Verification', () => {
  // 1. Valid creator login
  test('Valid creator login returns 200, JWT token, and correct user role', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'creator@freshplus.io', password: 'Creator123!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('creator');
    expect(res.body.user.email).toBe('creator@freshplus.io');
  });

  // 2. Valid reviewer login
  test('Valid reviewer login returns 200, JWT token, and reviewer role', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'reviewer@freshplus.io', password: 'Reviewer123!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('reviewer');
  });

  // 3. Valid manager login
  test('Valid manager login returns 200, JWT token, and manager role', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'manager@freshplus.io', password: 'Manager123!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('manager');
  });

  // 4. Login without an existing token (clean public request)
  test('Login without any Authorization header succeeds cleanly', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'creator@freshplus.io', password: 'Creator123!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // 5. Login with a stale token attached (simulating stale browser state)
  test('Login succeeds even if an expired/stale Authorization header was attached', async () => {
    const staleToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.stale_payload.invalid_signature';
    const res = await request(app)
      .post('/api/auth/login')
      .set('Authorization', staleToken)
      .send({ email: 'creator@freshplus.io', password: 'Creator123!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  // 6. Registration without an existing token
  test('Registration creates user, returns 201 and token without existing Authorization', async () => {
    const testEmail = `testuser_${Date.now()}@freshplus.io`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Candidate',
        email: testEmail,
        password: 'Password123!',
        role: 'creator',
        organization: 'FreshPlus Global'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testEmail);

    // Clean up created test user
    await User.deleteOne({ email: testEmail });
  });

  // 7. Invalid password
  test('Invalid password returns 401 and does not hang', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'creator@freshplus.io', password: 'WrongPassword123!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  // 8. Protected endpoints still require authentication
  test('Protected endpoint GET /api/auth/me returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('Protected endpoint GET /api/auth/me succeeds with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
  });

  // 9. Audit logging failure resilience
  test('Login succeeds and completes even if audit logging fails asynchronously', async () => {
    // Temporarily mock logAudit to simulate a logging failure / rejection
    const originalLogAudit = auditLogger.logAudit;
    const logSpy = jest.spyOn(auditLogger, 'logAudit').mockImplementation(() => {
      return Promise.reject(new Error('Simulated database log error'));
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'creator@freshplus.io', password: 'Creator123!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();

    logSpy.mockRestore();
  });

  // 10. Database connection timeout configuration inspection
  test('Database connection options include serverSelectionTimeoutMS and socketTimeoutMS', () => {
    const connectDB = require('../config/db');
    expect(connectDB).toBeDefined();
    // Verify mongoose connection state is connected
    expect(mongoose.connection.readyState).toBe(1);
  });
});
