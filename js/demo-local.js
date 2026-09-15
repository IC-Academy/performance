/* Synthetic identities and local access UI. Disabled completely in API mode. */
(function (global) {
  'use strict';
  if (!global.APP_CONFIG || global.APP_CONFIG.mode !== 'demo') return;
  const data = global.EDDData;
  const labels = {'10001':'New self-assessment','10002':'Submitted self-assessment','10003':'Pending calibration','10004':'Feedback ready','10005':'Completed review','10006':'New operations review','10007':'In-progress review','10008':'Completed technical review','10009':'Calibration outlier','10010':'Completed commercial review','10011':'No manager assigned'};
  data.COLABORADORES.forEach(function (person) {
    person.nombre = 'Demo ' + (labels[person.empleado] || person.empleado);
    person.correoCorporativo = 'demo-' + person.empleado + '@example.invalid';
    person.registroPrueba = true;
  });
  data.LIDERES.forEach(function (person) {
    person.nombre = 'Demo Manager ' + person.empleado;
    person.correoCorporativo = 'demo-' + person.empleado + '@example.invalid';
    person.registroPrueba = true;
  });
  data.ADMINISTRADORES.forEach(function (person) {
    person.nombre = 'Demo DO Admin';
    person.correoCorporativo = 'demo-' + person.empleado + '@example.invalid';
    person.registroPrueba = true;
  });

  global.document.addEventListener('DOMContentLoaded', function () {
    const doc = global.document;
    const root = doc.getElementById('app-root');
    if (!root || !global.App || global.APP_CONFIG.mode !== 'demo') return;
    const banner = doc.createElement('aside');
    banner.className = 'demo-local-banner';
    banner.innerHTML = '<strong>LOCAL DEMO · Simulated data</strong><span>No backend, real OTP or email delivery. Changes stay in this browser. Do not enter real employee information.</span><button class="btn btn-outline btn-sm" type="button">Reset local demo</button>';
    root.before(banner);
    const reset = global.App.reiniciarDemo;
    global.App.reiniciarDemo = function () {
      if (global.APP_CONFIG.mode !== 'demo') return;
      if (global.confirm('Reset only the local IC Admin demo? Local test changes will be removed. Mexico and Airtable are not affected.')) reset();
    };
    banner.querySelector('button').addEventListener('click', function () { global.App.reiniciarDemo(); });
    let busy = false;
    async function enter(number) {
      if (busy || global.APP_CONFIG.mode !== 'demo') return;
      busy = true;
      try { await global.App.quickLogin(String(number || '').trim()); } finally { busy = false; }
    }
    doc.addEventListener('click', function (event) {
      if (global.APP_CONFIG.mode !== 'demo') return;
      const button = event.target.closest && event.target.closest('#btnSolicitarCodigo');
      if (!button) return;
      event.preventDefault(); event.stopImmediatePropagation();
      enter((doc.getElementById('loginEmpleado') || {}).value);
    }, true);
    doc.addEventListener('keydown', function (event) {
      if (global.APP_CONFIG.mode === 'demo' && event.key === 'Enter' && event.target.id === 'loginEmpleado') {
        event.preventDefault(); event.stopImmediatePropagation(); enter(event.target.value);
      }
    }, true);
    function decorate() {
      if (global.APP_CONFIG.mode !== 'demo') return;
      const form = root.querySelector('.premium-login-form');
      if (!form || !doc.getElementById('loginEmpleado') || form.querySelector('.demo-local-access')) return;
      const help = form.querySelector('.premium-field-help');
      if (help) help.textContent = 'Local demo: enter a demo number to sign in directly. No email or access code is needed.';
      const panel = doc.createElement('div');
      panel.className = 'demo-local-access';
      panel.innerHTML = '<h3>Choose a local test case</h3><p>Each tester has independent data in their browser. Switch roles using Sign out; this does not reset your changes.</p>';
      [['10001','Employee · new self-assessment'],['10002','Employee · self-assessment submitted'],['10003','Employee · pending calibration'],['10004','Employee · feedback ready'],['20001','Manager · employees 10001 / 10002'],['20002','Manager · meeting, agreements and signatures'],['90001','DO Admin · calibration and Nine Box']].forEach(function (entry) {
        const button = doc.createElement('button');
        button.type = 'button'; button.className = 'btn btn-outline btn-block';
        button.textContent = entry[0] + ' · ' + entry[1];
        button.addEventListener('click', function () { enter(entry[0]); });
        panel.appendChild(button);
      });
      form.appendChild(panel);
    }
    new global.MutationObserver(decorate).observe(root, {childList:true,subtree:true});
    decorate();
  });
})(window);
