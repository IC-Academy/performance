(function () {
  'use strict';

  // IC ADMIN is English-only. This final guard prevents any legacy Spanish
  // copy from reaching the rendered interface while older modules are retired.
  const PHRASES = [
    [/Matriz 9-Box de Talento/gi, '9-Box Talent Matrix'],
    [/MATRIZ DE TALENTO/gi, 'TALENT MATRIX'],
    [/Ubicación según el equilibrio entre desempeño y actitud\.?/gi, 'Placement based on the balance between performance and attitude.'],
    [/Ubicación actual/gi, 'Current placement'],
    [/Lectura del cuadrante/gi, 'Quadrant interpretation'],
    [/Enfoque sugerido/gi, 'Suggested focus'],
    [/La matriz es una referencia para revisión humana; no sustituye el criterio de Desarrollo Organizacional ni del líder\.?/gi, 'The matrix is a reference for human review; it does not replace the judgment of Organizational Development or the manager.'],
    [/La clasificación aparecerá cuando existan resultados suficientes\.?/gi, 'The classification will appear when sufficient results are available.'],
    [/Perfil actual/gi, 'Current profile'],
    [/Cómo leer este perfil/gi, 'How to read this profile'],
    [/La distancia al borde indica qué tan cerca está cada competencia del nivel ideal\. La separación entre azul y naranja muestra la diferencia de percepción entre colaborador y líder\.?/gi, 'Distance from the edge shows how close each competency is to the ideal level. The gap between blue and orange shows the perception difference between employee and manager.'],
    [/Acción sugerida/gi, 'Suggested action'],
    [/Evaluación del líder/gi, 'Manager evaluation'],
    [/Evaluación líder/gi, 'Manager evaluation'],
    [/Autoevaluación/gi, 'Self-assessment'],
    [/Retroalimentación/gi, 'Feedback'],
    [/Calibración/gi, 'Calibration'],
    [/Desarrollo Organizacional/gi, 'Organizational Development'],
    [/Cumplimiento de Objetivos/gi, 'Goal Achievement'],
    [/Valores y Actitud/gi, 'Values and Attitude'],
    [/Técnica Funcional/gi, 'Technical and Functional'],
    [/Conocimientos/gi, 'Knowledge'],
    [/Habilidades/gi, 'Skills'],
    [/Desempeño/gi, 'Performance'],
    [/Actitud/gi, 'Attitude'],
    [/Colaborador(?:a)?/gi, 'Employee'],
    [/Líder/gi, 'Manager'],
    [/Administrador(?:a)?/gi, 'Administrator'],
    [/Área/gi, 'Department'],
    [/Puesto/gi, 'Position'],
    [/Objetivos/gi, 'Goals'],
    [/Objetivo/gi, 'Goal'],
    [/Fortalezas/gi, 'Strengths'],
    [/Áreas de oportunidad/gi, 'Development opportunities'],
    [/Plan de desarrollo/gi, 'Development plan'],
    [/Guardar progreso/gi, 'Save progress'],
    [/Guardar/gi, 'Save'],
    [/Cancelar/gi, 'Cancel'],
    [/Cerrar sesión/gi, 'Sign out'],
    [/Cerrar/gi, 'Close'],
    [/Siguiente sección/gi, 'Next section'],
    [/Siguiente/gi, 'Next'],
    [/Anterior/gi, 'Back'],
    [/Pendiente de líder/gi, 'Pending manager'],
    [/Pendiente líder/gi, 'Pending manager'],
    [/Pendiente de calibración/gi, 'Pending calibration'],
    [/Pendientes/gi, 'Pending'],
    [/No iniciada/gi, 'Not started'],
    [/En progreso/gi, 'In progress'],
    [/Completada/gi, 'Completed'],
    [/Calibrada/gi, 'Calibrated'],
    [/Cerrada/gi, 'Closed'],
    [/Vencida/gi, 'Overdue'],
    [/Resultado final/gi, 'Final result'],
    [/Resultado calibrado/gi, 'Calibrated result'],
    [/Resultado líder/gi, 'Manager result'],
    [/Puntaje global/gi, 'Overall score'],
    [/Promedio general/gi, 'Overall average'],
    [/Progreso general/gi, 'Overall progress'],
    [/Progreso de la sección/gi, 'Section progress'],
    [/Número de empleado/gi, 'Employee number'],
    [/Código temporal/gi, 'Temporary code'],
    [/Código de acceso/gi, 'Access code'],
    [/Inicia sesión/gi, 'Sign in'],
    [/Ingresar a la plataforma/gi, 'Enter platform'],
    [/Continuar/gi, 'Continue'],
    [/Bienvenido\(a\)/gi, 'Welcome'],
    [/Bienvenida/gi, 'Welcome'],
    [/Bienvenido/gi, 'Welcome'],
    [/Confidencialidad/gi, 'Confidentiality'],
    [/Confidencial/gi, 'Confidential'],
    [/Seguro/gi, 'Secure'],
    [/Desarrollo/gi, 'Growth'],
    [/Buscar/gi, 'Search'],
    [/Limpiar filtros/gi, 'Clear filters'],
    [/Limpiar/gi, 'Clear'],
    [/Todos los estados/gi, 'All statuses'],
    [/Todas las áreas/gi, 'All departments'],
    [/Todos los cuadrantes/gi, 'All quadrants'],
    [/Todos/gi, 'All'],
    [/Todas/gi, 'All'],
    [/Estado/gi, 'Status'],
    [/Periodo/gi, 'Cycle'],
    [/Nombre/gi, 'Name'],
    [/Responsable/gi, 'Owner'],
    [/Fecha compromiso/gi, 'Due date'],
    [/Justificación/gi, 'Rationale'],
    [/Comentarios/gi, 'Comments'],
    [/Descripción/gi, 'Description'],
    [/Prioridad/gi, 'Priority'],
    [/Seguimiento/gi, 'Follow-up'],
    [/Bajo/gi, 'Low'],
    [/Medio/gi, 'Medium'],
    [/Alto/gi, 'High'],
    [/Sin evaluación del líder/gi, 'No manager evaluation'],
    [/sin datos/gi, 'no data'],
    [/Ideal esperado/gi, 'Expected ideal'],
    [/percepción/gi, 'perception'],
    [/Sección/gi, 'Section'],
    [/proyección proporcional/gi, 'proportional projection'],
    [/evaluaciones/gi, 'evaluations'],
    [/evaluación/gi, 'evaluation'],
    [/empleados/gi, 'employees'],
    [/empleado/gi, 'employee']
  ];

  const SPANISH_HINT = /[áéíóúñ¿¡]|\b(?:de|del|para|con|sin|que|una|uno|esta|este|por|antes|después|actual|resultado|nivel|sección|evaluación|colaborador|líder|objetivo|desempeño|actitud|guardar|pendiente|cerrar|retroalimentación|calibración)\b/i;

  function englishText(value) {
    let out = String(value == null ? '' : value);
    if (window.EDDI18N && typeof window.EDDI18N.translateText === 'function') {
      out = window.EDDI18N.translateText(out);
    }
    for (const [pattern, replacement] of PHRASES) out = out.replace(pattern, replacement);
    return out;
  }

  function rewrite(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const parent = node.parentElement;
      if (!parent || /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/i.test(parent.tagName)) continue;
      const raw = node.nodeValue || '';
      if (!raw.trim()) continue;
      const next = englishText(raw);
      if (next !== raw) node.nodeValue = next;
    }

    root.querySelectorAll && root.querySelectorAll('[placeholder],[title],[aria-label]').forEach((el) => {
      ['placeholder','title','aria-label'].forEach((attr) => {
        if (!el.hasAttribute(attr)) return;
        const raw = el.getAttribute(attr) || '';
        const next = englishText(raw);
        if (next !== raw) el.setAttribute(attr, next);
      });
    });
  }

  function audit() {
    rewrite(document.body);
    const leftovers = [];
    document.querySelectorAll('body *').forEach((el) => {
      if (el.children.length || /^(SCRIPT|STYLE)$/i.test(el.tagName)) return;
      const t = (el.textContent || '').trim();
      if (t && SPANISH_HINT.test(t)) leftovers.push(t);
    });
    window.__EDD_ENGLISH_AUDIT__ = [...new Set(leftovers)];
  }

  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      audit();
    });
  }

  function boot() {
    document.documentElement.lang = 'en';
    localStorage.setItem('edd_ic_admin_language', 'en');
    document.querySelectorAll('.language-option').forEach((el) => {
      const isEnglish = (el.textContent || '').trim().toUpperCase() === 'EN';
      el.style.display = isEnglish ? '' : 'none';
      el.classList.toggle('active', isEnglish);
    });
    audit();
    new MutationObserver(schedule).observe(document.body, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ['placeholder','title','aria-label']
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('hashchange', schedule);
  window.addEventListener('load', schedule);
})();