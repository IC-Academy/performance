/**
 * self-draft-reliability-v45.js
 * ---------------------------------------------------------------------------
 * Fiabilidad del guardado de la AUTOEVALUACIÓN (PUT self-draft). Solo envuelve
 * EDDApi.saveSelfDraft; no toca el guardado del líder ni otros endpoints.
 *
 * Causa raíz (2026-11-02, EV-ICA-PER-ICA-2026-01-267591): n8n tarda 12–25 s en
 * persistir el borrador y el navegador abortaba a los 12 s, mostrando
 * "The request took too long" aunque el guardado SÍ se completaba.
 *
 * Este módulo:
 *  1. Serializa los guardados: nunca hay dos PUT self-draft simultáneos para la
 *     misma evaluación, así una respuesta tardía no puede pisar cambios nuevos.
 *  2. Coalesce: si llegan varios guardados mientras uno está en curso, solo se
 *     envía el último (cada payload es una instantánea completa del borrador).
 *  3. Reintenta de forma controlada solo ante timeout/red (no ante 4xx). El PUT
 *     es idempotente (UPSERT por ID Respuesta/ID Objetivo + update del registro).
 *  4. Muestra el estado real: "Saving changes…", "All changes saved" (solo tras
 *     respuesta 2xx), "Unable to save changes. Retrying…", "Unsaved changes".
 * Se carga ANTES de progressive-save-v28.js para que este último siga calculando
 * la sección y el dirty-check en el momento de la llamada.
 * ---------------------------------------------------------------------------
 */
(function (global) {
  'use strict';

  const Api = global.EDDApi;
  if (!Api || typeof Api.saveSelfDraft !== 'function' || Api.saveSelfDraft.__reliabilityV45) return;

  const RETRY_DELAYS_MS = [2000, 5000];          // máx. 2 reintentos
  const RETRYABLE = { timeout: true, network: true };
  const original = Api.saveSelfDraft;
  const queues = new Map();                       // evaluationId -> { running, pending }
  let status = 'idle';                            // idle | saving | saved | retrying | unsaved | error
  let dirty = false;
  let errorText = '';

  // ---------------- Indicador visual ----------------
  const TEXT = {
    saving: 'Saving changes…',
    saved: 'All changes saved',
    retrying: 'Unable to save changes. Retrying…',
    unsaved: 'Unsaved changes',
    error: 'Changes not saved yet. Your answers are still on this page — use “Save progress” to try again.'
  };
  function isSelfAssessmentView() {
    return /autoevaluacion/i.test(String(global.location && global.location.hash || ''));
  }
  function indicator() {
    let el = document.getElementById('edd-self-save-status');
    if (!el) {
      el = document.createElement('div');
      el.id = 'edd-self-save-status';
      el.className = 'edd-save-status';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    return el;
  }
  function paint() {
    if (!document.body) return;
    const el = indicator();
    const visible = status !== 'idle' && (isSelfAssessmentView() || status === 'saving' || status === 'retrying');
    el.hidden = !visible;
    el.dataset.state = status;
    el.textContent = status === 'error' ? (errorText || TEXT.error) : (TEXT[status] || '');
  }
  function setStatus(next) { status = next; paint(); }

  // ---------------- Guardado serializado + reintentos ----------------
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  async function sendWithRetry(evaluationId, payload) {
    for (let attempt = 0; ; attempt++) {
      try {
        setStatus(attempt === 0 ? 'saving' : 'retrying');
        return await original.call(Api, evaluationId, payload);
      } catch (err) {
        const tipo = err && err.tipo;
        if (!RETRYABLE[tipo] || attempt >= RETRY_DELAYS_MS.length) throw err;
        setStatus('retrying');
        await sleep(RETRY_DELAYS_MS[attempt]);
      }
    }
  }

  function drain(evaluationId, q) {
    const job = q.pending; q.pending = null;
    q.running = (async () => {
      dirty = false; // cambios hechos durante el guardado vuelven a marcarlo
      try {
        const result = await sendWithRetry(evaluationId, job.payload);
        job.waiters.forEach((w) => w.resolve(result));
        if (!q.pending) setStatus(dirty ? 'unsaved' : 'saved');
      } catch (err) {
        dirty = true; // lo enviado no quedó confirmado
        const friendly = (err && RETRYABLE[err.tipo])
          ? Object.assign(Object.create(Object.getPrototypeOf(err)), err, { message: TEXT.error })
          : err;
        job.waiters.forEach((w) => w.reject(friendly));
        // Error específico del servidor (p. ej. 409 bloqueada): se muestra tal cual, sin reintentar.
        errorText = (err && RETRYABLE[err.tipo]) ? TEXT.error : ('Changes not saved: ' + ((err && err.message) || 'the server rejected the request.'));
        if (!q.pending) setStatus('error');
      } finally {
        q.running = null;
        if (q.pending) drain(evaluationId, q);
        else queues.delete(String(evaluationId));
      }
    })();
  }

  const wrapped = function (evaluationId, payload) {
    const key = String(evaluationId || '');
    let q = queues.get(key);
    if (!q) { q = { running: null, pending: null }; queues.set(key, q); }
    return new Promise((resolve, reject) => {
      // El payload más reciente reemplaza al pendiente; todos los que esperaban
      // reciben el resultado del guardado que ya incluye sus cambios.
      if (q.pending) { q.pending.payload = payload; q.pending.waiters.push({ resolve, reject }); }
      else q.pending = { payload, waiters: [{ resolve, reject }] };
      if (!q.running) drain(key, q);
    });
  };
  wrapped.__reliabilityV45 = true;
  wrapped.__original = original;
  Api.saveSelfDraft = wrapped;

  // ---------------- "Unsaved changes" ----------------
  // Solo marca estado visual; no guarda ni modifica respuestas.
  function markDirty() {
    if (!isSelfAssessmentView()) return;
    dirty = true;
    if (status !== 'saving' && status !== 'retrying') setStatus('unsaved');
  }
  const App = global.App;
  if (App) {
    ['rate', 'comentar', 'rateHerramienta'].forEach((name) => {
      const fn = App[name];
      if (typeof fn !== 'function' || fn.__reliabilityV45) return;
      // Solo cuenta como cambio si el valor almacenado realmente cambió: app.js
      // re-aplica las calificaciones ya marcadas (syncCheckedRatingsFromDom).
      const snap = (evaluacionId) => {
        const S = global.EDDStorage;
        try { return S ? JSON.stringify([S.getRespuestas(evaluacionId), S.getHerramientasEvaluacion(evaluacionId)]) : null; } catch (_) { return null; }
      };
      const w = function (evaluacionId) {
        const before = snap(evaluacionId);
        const r = fn.apply(this, arguments);
        const after = snap(evaluacionId);
        if (before === null || after === null || before !== after) markDirty();
        return r;
      };
      w.__reliabilityV45 = true;
      App[name] = w;
    });
  }
  document.addEventListener('input', (e) => {
    if (e.target && e.target.closest && e.target.closest('.premium-evaluation-page, .competency-card, .objective-card, .objetivo-card')) markDirty();
  }, true);
  global.addEventListener('hashchange', paint);
  global.addEventListener('beforeunload', (e) => {
    if (isSelfAssessmentView() && (status === 'saving' || status === 'retrying' || (dirty && status !== 'saved'))) {
      e.preventDefault(); e.returnValue = '';
    }
  });

  global.__eddSelfSaveStatus = () => ({ status, dirty, inFlight: Array.from(queues.keys()) });
})(window);
