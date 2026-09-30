'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('the performance demo entry loads only the English-native V2 app', () => {
  const html = read('index.html');
  assert.match(html, /<html lang="en">/);
  assert.match(html, /v2\/styles\.css/);
  assert.match(html, /v2\/app\.js/);
  assert.doesNotMatch(html, /js\/app\.js|js\/auth\.js|i18n|demo-local/i);
  assert.doesNotMatch(html, /stgperformance\.intercon\.com\.mx/);
});

test('the custom domain points to the performance demo', () => {
  assert.equal(read('CNAME').trim(), 'performance.intercon.com.mx');
});

test('the V2 demo includes the required full-cycle credentials and roles', () => {
  const app = read('v2/app.js');
  assert.match(app, /990001/);
  assert.match(app, /314159/);
  assert.match(app, /Monserrat Cayon/);
  assert.match(app, /'Employee', 'Manager', 'Administrator'/);
  assert.match(app, /Self-assessment completed/);
  assert.match(app, /Manager review/);
  assert.match(app, /OD \/ ADMIN CALIBRATION/);
  assert.match(app, /Feedback release/);
  assert.match(app, /MANAGER SIGNATURE/);
  assert.match(app, /EMPLOYEE SIGNATURE/);
});

test('the V2 source has no Spanish visible labels or runtime translation layer', () => {
  const source = `${read('index.html')}\n${read('v2/app.js')}\n${read('v2/styles.css')}`;
  assert.doesNotMatch(source, /español|idioma|diccionario|autoevaluación|evaluación|desempeño|calibración|retroalimentación|firma|acuerdo|objetivo|competencia|comentario|contraseña|usuario|guardar|cancelar|enviar|pendiente|completado|sesión|iniciar|cerrar/i);
  assert.doesNotMatch(source, /setLanguage|currentLanguage|MutationObserver|EDDI18N|translateDOM|translateText/i);
});
