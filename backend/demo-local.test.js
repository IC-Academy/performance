'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { webcrypto } = require('node:crypto');
const { TextEncoder } = require('node:util');

function runtime() {
  const storage = () => {
    const values = new Map();
    return {
      getItem: (key) => values.get(key) || null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key)
    };
  };
  let calls = 0;
  const context = {
    console, Date, Math, JSON, Set, Map, Uint8Array, TextEncoder,
    crypto: webcrypto,
    localStorage: storage(),
    sessionStorage: storage(),
    setTimeout: (fn) => { fn(); return 1; },
    addEventListener: () => {},
    document: { addEventListener: () => {} },
    EDDApi: {
      ApiError: class ApiError extends Error { constructor(tipo, message) { super(message); this.tipo = tipo; } },
      authRequestCode: () => { calls += 1; throw Error('Restricted review must not call backend'); },
      authVerifyCode: () => { calls += 1; throw Error('Restricted review must not call backend'); }
    }
  };
  context.window = context;
  vm.createContext(context);
  for (const file of ['config','data','calculations','storage','auth']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../js', file + '.js'), 'utf8'), context);
  }
  return { context, calls: () => calls };
}

async function signIn(context, employeeNumber, password) {
  await context.EDDAuth.requestCode(employeeNumber);
  return context.EDDAuth.verifyCode(employeeNumber, password);
}

test('only the restricted Gabriel Sabogal administrator credentials create a session', async () => {
  const { context: c, calls } = runtime();
  assert.equal(c.APP_CONFIG.sessionStorageKey, 'edd_ic_admin_restricted_session_v1');
  const configSource = fs.readFileSync(path.join(__dirname, '../js/config.js'), 'utf8');
  assert.doesNotMatch(configSource, /253614/, 'password must not be stored in plaintext');
  await signIn(c, '10001', '253614');
  const user = c.EDDAuth.getAppUser();
  assert.equal(user.empleado, '10001');
  assert.equal(user.nombre, 'Gabriel Sabogal');
  assert.equal(user.perfil, 'administrador');
  assert.equal(user.capabilities.isAdmin, true);
  assert.equal(user.capabilities.canAdminister, true);
  assert.equal(user.capabilities.canManage, true);
  assert.equal(user.capabilities.canCalibrate, true);
  assert.equal(user.capabilities.canViewAllEvaluations, true);
  assert.equal(calls(), 0);
});

test('wrong passwords and every former selectable account are rejected', async () => {
  for (const [employeeNumber, password] of [
    ['10001', '000000'], ['10001', '253615'], ['10002', '253614'],
    ['10003', '253614'], ['10004', '253614'], ['20001', '253614'],
    ['20002', '253614'], ['90001', '253614']
  ]) {
    const { context: c } = runtime();
    await assert.rejects(signIn(c, employeeNumber, password), (error) => error.tipo === 'invalid_credentials');
    assert.equal(c.EDDAuth.getSession(), null);
  }
});

test('the published page has no demo banner, shortcuts or test-case selector', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  assert.doesNotMatch(html, /demo-local\.js|demo-local\.css/i);
  assert.doesNotMatch(html, /Choose a local test case|LOCAL DEMO|data-demo-user/i);
  assert.match(html, /js\/auth\.js/);
  assert.match(html, /js\/app\.js/);
});

test('the login UI uses employee number and password with no quick access action', () => {
  const app = fs.readFileSync(path.join(__dirname, '../js/app.js'), 'utf8');
  assert.match(app, /id="loginPassword"/);
  assert.match(app, /type="password"/);
  assert.match(app, /loginRestringido/);
  assert.doesNotMatch(app, /async quickLogin\(/);
});

test('API mode remains isolated from restricted local credentials', async () => {
  const { context: c, calls } = runtime();
  c.APP_CONFIG.mode = 'api';
  await assert.rejects(c.EDDAuth.requestCode('10001'), /must not call backend/);
  assert.equal(calls(), 1);
});
