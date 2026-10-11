import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app.js';

describe('API Integration', () => {
  it('GET /health returns 200 { status: "ok" }', async () => {
    const res = await request(app).get('/health');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { status: 'ok' });
  });

  it('GET /unknown-route returns 404 with standard error contract', async () => {
    const res = await request(app).get('/unknown-route');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'NOT_FOUND');
  });

  it('POST /sessions with invalid JSON body returns 400 MALFORMED_JSON', async () => {
    const res = await request(app)
      .post('/sessions')
      .set('Content-Type', 'application/json')
      .send('{"invalid json:');
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'MALFORMED_JSON');
  });

  it('POST /sessions with missing fields returns 422 VALIDATION_ERROR with details', async () => {
    const res = await request(app)
      .post('/sessions')
      .send({ milk_quantity: 10 });
    assert.equal(res.status, 422);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'VALIDATION_ERROR');
    assert.ok(Array.isArray(res.body.error.details));
    assert.ok(res.body.error.details.length > 0);
  });
});
