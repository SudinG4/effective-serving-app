import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAccountRole } from './accountRole.js';

const profileDatabase = (role, error) => ({ from(table) {
  assert.equal(table, 'profiles');
  return { select(column) { assert.equal(column, 'role'); return this; }, eq(column, id) { assert.equal(column, 'id'); assert.equal(id, 'account'); return this; },
    async maybeSingle() { return { data: role ? { role } : null, error }; } };
} });
test('database profile admin is recognized even without an admin JWT claim', async () => {
  assert.equal(await resolveAccountRole({ id: 'account' }, profileDatabase('admin')), 'admin');
});
test('profile role revocation overrides a stale admin claim', async () => {
  assert.equal(await resolveAccountRole({ id: 'account', app_metadata: { role: 'admin' } }, profileDatabase('user')), 'user');
});
test('editable metadata never grants administrator privileges', async () => {
  assert.equal(await resolveAccountRole({ id: 'account', user_metadata: { role: 'admin' } }, profileDatabase('user')), 'user');
});
test('role lookup fails closed on database errors', async () => {
  await assert.rejects(resolveAccountRole({ id: 'account' }, profileDatabase(null, { code: '42501' })));
});
