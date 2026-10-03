import test from 'node:test';
import assert from 'node:assert/strict';
import { updateProfile } from './profileController.js';

function response() {
  return { code: 200, headers: {}, set(name, value) { this.headers[name] = value; return this; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
}
test('profile updates reject blank names and short passwords', async () => {
  for (const body of [{ firstName: ' ', lastName: 'User' }, { firstName: 'Test', lastName: 'User', password: '123' }]) {
    const res = response();
    await updateProfile({ body }, res);
    assert.equal(res.code, 400);
    assert.equal(res.body.success, false);
  }
});
test('profile updates use the authenticated token and preserve other metadata', async () => {
  const original = globalThis.fetch;
  let sent;
  globalThis.fetch = async (url, options) => {
    sent = options;
    return { ok: true, json: async () => ({ id: 'authenticated-user' }) };
  };
  try {
    const res = response();
    await updateProfile({ body: { firstName: ' New ', lastName: ' Name ', password: 'long-password', id: 'other-user' }, headers: { authorization: 'Bearer authenticated-token' }, user: { user_metadata: { phone: '123' } } }, res);
    assert.equal(sent.headers.Authorization, 'Bearer authenticated-token');
    assert.deepEqual(JSON.parse(sent.body), { data: { phone: '123', first_name: 'New', last_name: 'Name' }, password: 'long-password' });
    assert.equal(res.body.user.id, 'authenticated-user');
    assert.equal(res.headers['Cache-Control'], 'no-store');
  } finally { globalThis.fetch = original; }
});
test('upstream errors are shown without reporting success', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, json: async () => ({ msg: 'Please reauthenticate.' }) });
  try {
    const res = response();
    await updateProfile({ body: { firstName: 'Test', lastName: 'User' }, headers: {}, user: {} }, res);
    assert.equal(res.code, 400);
    assert.equal(res.body.message, 'Please reauthenticate.');
  } finally { globalThis.fetch = original; }
});
