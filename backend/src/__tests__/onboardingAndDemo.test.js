const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

let creatorToken;
let managerToken;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/inkloom');
  }

  const creatorRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'creator@freshplus.io', password: 'Creator123!' });
  creatorToken = creatorRes.body.token;

  const managerRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'manager@freshplus.io', password: 'Manager123!' });
  managerToken = managerRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('InkloomGuard — Onboarding & Regulatory Governance Tests', () => {
  test('PATCH /api/auth/onboarding should update onboarding completion and version', async () => {
    const res = await request(app)
      .patch('/api/auth/onboarding')
      .set('Authorization', `Bearer ${creatorToken}`)
      .send({ completed: true, skipped: false, version: 1 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.onboarding.completed).toBe(true);
    expect(res.body.onboarding.skipped).toBe(false);
    expect(res.body.onboarding.version).toBe(1);
    expect(res.body.onboarding.lastCompletedAt).toBeDefined();
  });

  test('GET /api/auth/me should return onboarding status for the authenticated user', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${creatorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.onboarding).toBeDefined();
    expect(res.body.user.onboarding.completed).toBe(true);
  });

  test('PATCH /api/auth/onboarding should handle skip tour status', async () => {
    const res = await request(app)
      .patch('/api/auth/onboarding')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ completed: false, skipped: true, version: 1 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.onboarding.skipped).toBe(true);
  });

  test('GET /api/guidelines should return active brand & regulatory rules', async () => {
    const res = await request(app)
      .get('/api/guidelines')
      .set('Authorization', `Bearer ${creatorToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.guidelines)).toBe(true);
    expect(res.body.guidelines.length).toBeGreaterThanOrEqual(5);

    const hasGuide01 = res.body.guidelines.some(g => g.guidelineId === 'GUIDE-001');
    const hasGuide02 = res.body.guidelines.some(g => g.guidelineId === 'GUIDE-002');
    expect(hasGuide01).toBe(true);
    expect(hasGuide02).toBe(true);
  });

  test('GET /api/facts should return approved verified nutritional facts', async () => {
    const res = await request(app)
      .get('/api/facts')
      .set('Authorization', `Bearer ${creatorToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.facts)).toBe(true);
    const fact1 = res.body.facts.find(f => f.factId === 'FACT-001');
    expect(fact1).toBeDefined();
    expect(fact1.statement).toContain('pasteurized orange juice');
  });

  test('GET /api/analytics/overview should return coherent statistics', async () => {
    const res = await request(app)
      .get('/api/analytics/overview')
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.stats).toBeDefined();
    expect(res.body.stats.totalSubmissions).toBeGreaterThanOrEqual(1);
    expect(res.body.stats.averageGovernanceScore).toBeDefined();
  });
});
