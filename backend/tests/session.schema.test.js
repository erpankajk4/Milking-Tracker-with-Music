import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createSessionSchema } from '../src/modules/sessions/session.schema.js';

describe('createSessionSchema', () => {
  const validPayload = {
    start_time: '2026-10-11T08:00:00.000Z',
    end_time: '2026-10-11T08:15:00.000Z',
    duration: 900,
    milk_quantity: 12.5
  };

  it('passes with valid session data', () => {
    const result = createSessionSchema.safeParse(validPayload);
    assert.equal(result.success, true);
  });

  it('rejects missing start_time', () => {
    const { start_time, ...payload } = validPayload;
    const result = createSessionSchema.safeParse(payload);
    assert.equal(result.success, false);
    assert.ok(result.error.issues.some((i) => i.path.includes('start_time')));
  });

  it('rejects invalid ISO start_time', () => {
    const payload = { ...validPayload, start_time: 'invalid-date' };
    const result = createSessionSchema.safeParse(payload);
    assert.equal(result.success, false);
    assert.ok(result.error.issues.some((i) => i.path.includes('start_time')));
  });

  it('rejects end_time before or equal to start_time', () => {
    const payload = {
      ...validPayload,
      start_time: '2026-10-11T08:15:00.000Z',
      end_time: '2026-10-11T08:10:00.000Z'
    };
    const result = createSessionSchema.safeParse(payload);
    assert.equal(result.success, false);
    assert.ok(result.error.issues.some((i) => i.path.includes('end_time')));
  });

  it('rejects negative duration', () => {
    const payload = { ...validPayload, duration: -10 };
    const result = createSessionSchema.safeParse(payload);
    assert.equal(result.success, false);
    assert.ok(result.error.issues.some((i) => i.path.includes('duration')));
  });

  it('rejects non-integer duration', () => {
    const payload = { ...validPayload, duration: 15.5 };
    const result = createSessionSchema.safeParse(payload);
    assert.equal(result.success, false);
    assert.ok(result.error.issues.some((i) => i.path.includes('duration')));
  });

  it('rejects duration exceeding total elapsed wall-clock time + tolerance', () => {
    const payload = {
      ...validPayload,
      start_time: '2026-10-11T08:00:00.000Z',
      end_time: '2026-10-11T08:01:00.000Z', // 60 seconds
      duration: 120 // 120 seconds > 60s + 5s
    };
    const result = createSessionSchema.safeParse(payload);
    assert.equal(result.success, false);
    assert.ok(result.error.issues.some((i) => i.path.includes('duration')));
  });

  it('allows duration less than elapsed time (session was paused)', () => {
    const payload = {
      ...validPayload,
      start_time: '2026-10-11T08:00:00.000Z',
      end_time: '2026-10-11T08:10:00.000Z', // 600 seconds
      duration: 300 // paused for half the time
    };
    const result = createSessionSchema.safeParse(payload);
    assert.equal(result.success, true);
  });

  it('rejects zero or negative milk_quantity', () => {
    const zeroPayload = { ...validPayload, milk_quantity: 0 };
    const negPayload = { ...validPayload, milk_quantity: -5 };

    assert.equal(createSessionSchema.safeParse(zeroPayload).success, false);
    assert.equal(createSessionSchema.safeParse(negPayload).success, false);
  });

  it('rejects unexpected additional fields (strict schema)', () => {
    const payload = { ...validPayload, extraField: 'not allowed' };
    const result = createSessionSchema.safeParse(payload);
    assert.equal(result.success, false);
  });
});
