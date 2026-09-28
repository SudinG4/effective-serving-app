import test from 'node:test';
import assert from 'node:assert/strict';
import { createPasswordHandlers } from './passwordController.js';

function response() {
  return { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
}

test('invalid email is rejected before contacting Supabase', async () => {
  const handlers = createPasswordHandlers(() => { throw new Error('must not be called'); });
  for (const email of [null, 42, '', 'invalid']) {
    const res = response();
    await handlers.forgotPassword({ body: { email } }, res);
    assert.equal(res.statusCode, 400);
  }
});

test('normalizes email, uses configured redirect, and hides account existence', async () => {
  for (const error of [null, { status: 400, message: 'Unknown account' }]) {
    const handlers = createPasswordHandlers(() => ({ auth: {
      async resetPasswordForEmail(email, options) {
        assert.equal(email, 'test@example.com');
        assert.equal(options.redirectTo, new URL('/reset-password', process.env.FRONTEND_URL || 'http://localhost:5173').href);
        return { error };
      }
    } }));
    const res = response();
    await handlers.forgotPassword({ body: { email: ' Test@Example.com ' } }, res);
    assert.equal(res.statusCode, 200);
    assert.match(res.body.message, /If an account exists/);
  }
});

test('rate limiting is reported without exposing provider details', async () => {
  const handlers = createPasswordHandlers(() => ({ auth: { resetPasswordForEmail: async () => ({ error: { status: 429 } }) } }));
  const res = response();
  await handlers.forgotPassword({ body: { email: 'test@example.com' } }, res);
  assert.equal(res.statusCode, 429);
});

test('missing tokens and short passwords cannot update a password', async () => {
  const handlers = createPasswordHandlers(() => { throw new Error('must not be called'); });
  for (const [body, code] of [[{ password: 'short' }, 400], [{ password: 'long-enough' }, 401]]) {
    const res = response();
    await handlers.resetPassword({ body }, res);
    assert.equal(res.statusCode, code);
  }
});

test('expired session never reaches password update', async () => {
  const handlers = createPasswordHandlers(() => ({ auth: {
    setSession: async () => ({ error: new Error('expired') }),
    updateUser: async () => assert.fail('must not update')
  } }));
  const res = response();
  await handlers.resetPassword({ body: { password: 'new-password', accessToken: 'expired', refreshToken: 'expired' } }, res);
  assert.equal(res.statusCode, 401);
});

test('each reset uses an isolated client and signs out after updating', async () => {
  let clients = 0;
  const handlers = createPasswordHandlers(() => {
    clients++;
    let updated = false;
    return { auth: {
      async setSession(tokens) { assert.equal(tokens.access_token, 'valid'); return { error: null }; },
      async updateUser({ password }) { assert.equal(password, 'new-password'); updated = true; return { error: null }; },
      async signOut({ scope }) { assert.ok(updated); assert.equal(scope, 'global'); return { error: null }; }
    } };
  });
  for (let i = 0; i < 2; i++) {
    const res = response();
    await handlers.resetPassword({ body: { password: 'new-password', accessToken: 'valid', refreshToken: 'valid' } }, res);
    assert.equal(res.body.success, true);
  }
  assert.equal(clients, 2);
});
