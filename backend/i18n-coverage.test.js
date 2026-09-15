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
test('manager screenshots: headings, placeholders and runtime values', () => {
  const t = translator();
  const cases = {
    'Mi equipo — Desarrollo Organizacional': 'My team — Organizational Development',
    'Evaluación de Demo New self-assessment': 'Evaluation of Demo New self-assessment',
    'Comparación — Demo New self-assessment': 'Comparison — Demo New self-assessment',
    '2 años 4 meses': '2 years 4 months',
    'Líder · Evaluación de Desempeño 2026': 'Manager · Performance Evaluation 2026',
    '1.8 pts al ideal': '1.8 pts below ideal',
    '+0.2 auto vs líder': '+0.2 self vs manager',
    'Líder 3.0/5 · Ideal 5.0/5': 'Manager 3.0/5 · Ideal 5.0/5',
    '5 · Sol': '5 · Sun',
    '+ Agregar': '+ Add',
    'Guardar acuerdo': 'Save agreement',
    'Compromiso Organizacional': 'Organizational Commitment',
    'VALORES / ACTITUD': 'VALUES / ATTITUDE',
    'Comentario del líder': 'Manager comment'
  };
  for (const [source, expected] of Object.entries(cases)) assert.equal(t(source), expected, source);
  for (const source of [
    'Ej. Mantiene alta calidad en sus entregables y apoya al equipo en cierres críticos.',
    'Ej. Fortalecer planeación semanal y desarrollar mayor dominio de Power BI.',
    'Ej. Presenta retrasos recurrentes en seguimiento y requiere mayor precisión en reportes.',
    'Ej. Dependencia de una sola persona/proceso, carga acumulada o falta de capacitación específica.',
    'Ej. Durante el periodo destacaste por..., y el principal foco de desarrollo será...'
  ]) assert.match(t(source), /^e\.g\./);
});
