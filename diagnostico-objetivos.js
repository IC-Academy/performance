// Pegar en la consola del navegador (F12) estando en la pantalla de resultados. No imprime tokens ni datos confidenciales.
(async () => {
  const q = [...document.scripts].map(s => s.src.split('/').pop()).filter(n => /app\.js|charts\.js|objective-normalization/.test(n));
  console.log('1) Scripts servidos:', q);
  const ev = (await EDDApi.evaluationDetail(location.hash.match(/EV-[A-Z0-9-]+/)?.[0] || '', true).catch(() => null));
  let d = ev && (ev.data || ev);
  if (!d) { console.log('2) Pasa el id: await EDDApi.evaluationDetail("EV-ICA-PER-ICA-2026-01-<n>", true)'); }
  else {
    console.log('2) Endpoint: objectivesApplicable =', d.evaluation && d.evaluation.objectivesApplicable, '· objetivos:',
      (d.objectives || []).map(o => ({ id: o.objectiveId, meta: o.goal, real: o.actualResult, leaderValidatedPercent: o.leaderValidatedPercent, leaderScore: o.leaderScore })),
      '· tools líder:', (d.tools && d.tools.leader || []).length);
  }
  const db = JSON.parse(localStorage.getItem('edd_ic_admin_demo_db_v6_complete_goals') || '{}');
  const evs = (db.evaluaciones || []).filter(e => /266358|^EV-/.test(JSON.stringify(e)) ).map(e => ({ id: e.id, tipo: e.tipo, back: e.backendId || e.evaluacionBackendId }));
  console.log('3) Evaluaciones locales:', evs.length);
  console.log('4) Objetivos locales:', (db.objetivos || []).map(o => ({ ev: o.evaluacionId, i: o.index, cumplimiento: o.cumplimiento, calificacion: o.calificacion })));
  console.log('5) Resultados locales:', (db.resultados || []).map(r => ({ ev: r.evaluacionId, origen: r.origen, objetivos: r.promedios && r.promedios.objetivos, total: r.puntajes && r.puntajes.total, fuente: r.fuenteResultado })));
  console.log('Si 2) trae leaderValidatedPercent pero 4)/5) tienen objetivos null/vacío en el líder: estado local obsoleto → recargar con Ctrl+F5.');
})();
