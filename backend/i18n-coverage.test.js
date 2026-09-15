const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function translator(lang = 'en') {
  const window = {};
  vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '../js/i18n-unified-v33.js'), 'utf8'), {
    window, localStorage: { getItem: () => lang },
    document: { readyState: 'loading', addEventListener() {} }
  });
  return window.EDDI18N.translateText;
}
test('screenshot labels and decorated navigation are fully translated', () => {
  const t = translator();
  for (const [source, expected] of [
    ['¡Hola, Demo!', 'Hello, Demo!'],
    ['→\u00a0\u00a0Comenzar mi evaluación', '→\u00a0\u00a0Start my evaluation'],
    ['← Anterior', '← Back'], ['× Quitar', '× Remove'],
    ['+ Agregar objetivo', '+ Add objective'], ['✓ Comprendido', '✓ Got it'],
    ['⌂ \u00a0 Ir al inicio', '⌂ \u00a0 Go to home'],
    ['B. Conocimientos y Habilidades Técnicas', 'B. Technical Knowledge and Skills'],
    ['C. Cumplimiento de Objetivos', 'C. Goal Achievement'],
    ['Se calcula automáticamente', 'Calculated automatically'],
    ['Ej. 95', 'e.g. 95'], ['Sin cálculo', 'Not calculated']
  ]) assert.equal(t(source), expected, source);
});
test('Spanish selection and arbitrary employee content remain unchanged', () => {
  assert.equal(translator('es')('← Anterior'), '← Anterior');
  const text = 'Mi objetivo fue mejorar los objetivos de mi equipo';
  assert.equal(translator()(text), text);
});
test('published structure retains actual 40/30/30 weighting', () => {
  const t = translator();
  assert.equal(t('Valores y Actitud 40%'), 'Values and Attitude 40%');
  assert.equal(t('Técnica Funcional 60%'), 'Technical-functional Performance 60%');
});
