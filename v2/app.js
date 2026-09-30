(() => {
  'use strict';

  const STORAGE_KEY = 'ic-admin-performance-demo-v2-state';
  const SESSION_KEY = 'ic-admin-performance-demo-v2-session';

  const users = {
    '990001': {
      pin: '314159',
      name: 'Monserrat Cayon',
      title: 'UAT Full-Cycle Reviewer',
      department: 'IC Admin',
      area: 'Administration',
      managerId: '990002',
      roles: ['Employee', 'Manager', 'Administrator']
    },
    '990002': {
      pin: '253614',
      name: 'Gabriel Sabogal',
      title: 'VP Corporate LATAM / Managing Director Mexico',
      department: 'Executive Management',
      area: 'Corporate',
      managerId: '990001',
      roles: ['Employee', 'Manager', 'Administrator']
    },
    '267476': {
      pin: '476826',
      name: 'Jose Antonio Garcia Santiago',
      title: 'Officer Success Representative',
      department: 'Officer Success',
      area: 'Operations Support',
      managerId: '990001',
      roles: ['Employee']
    },
    '257270': {
      pin: '270642',
      name: 'Deysi Salas Figueroa',
      title: 'Employee Relations Team Lead',
      department: 'People Operations',
      area: 'People Operations',
      managerId: '990002',
      roles: ['Employee']
    }
  };

  const competencies = [
    {
      id: 'communication',
      name: 'Effective Communication',
      description: 'Shares clear information, listens actively, and adjusts the message to the audience.'
    },
    {
      id: 'adaptability',
      name: 'Adaptability and Initiative',
      description: 'Responds constructively to change and acts before issues become blockers.'
    },
    {
      id: 'mastery',
      name: 'Role Mastery',
      description: 'Uses job knowledge, business context, and judgment to deliver dependable work.'
    },
    {
      id: 'process',
      name: 'Processes and Tools',
      description: 'Uses company tools, records, controls, and workflows with accuracy.'
    },
    {
      id: 'results',
      name: 'Results Orientation',
      description: 'Turns priorities into measurable outcomes while protecting quality.'
    },
    {
      id: 'planning',
      name: 'Planning and Organization',
      description: 'Prioritizes work, communicates timing, and keeps stakeholders aligned.'
    }
  ];

  const demoPeople = [
    {
      employeeId: '990001',
      status: 'feedback_unlocked',
      selfRatings: [5, 4, 4, 4, 5, 4],
      managerRatings: [5, 5, 4, 4, 5, 4],
      calibratedRating: 4.4,
      nineBox: { performance: 'High', potential: 'High', placement: 'Accelerate' },
      selfComment: 'I improved operating rhythm and created clearer follow-up habits for cross-functional work.',
      managerComment: 'Monserrat delivers reliable execution and raises issues early. The next step is broader stakeholder visibility.',
      calibrationNote: 'OD confirms the manager result. Evidence supports high performance with a targeted development priority around executive visibility.',
      strengths: 'Ownership, follow-through, collaboration, and structured communication.',
      development: 'Increase visibility with executive stakeholders and document decisions earlier.',
      agreements: 'Lead one cross-functional improvement initiative and hold monthly development check-ins with the manager.',
      feedbackMeeting: 'Confirmed',
      managerSigned: false,
      employeeSigned: false
    },
    {
      employeeId: '990002',
      status: 'calibrated',
      selfRatings: [5, 5, 5, 4, 5, 5],
      managerRatings: [5, 5, 5, 5, 5, 4],
      calibratedRating: 4.8,
      nineBox: { performance: 'High', potential: 'High', placement: 'Enterprise leader' },
      selfComment: 'I supported continuity, executive alignment, and decision speed during the cycle.',
      managerComment: 'Gabriel shows strong enterprise ownership and consistent executive judgment.',
      calibrationNote: 'OD validates the high result and recommends using this case as a benchmark for senior leadership calibration.',
      strengths: 'Strategic direction, business ownership, and fast decision-making.',
      development: 'Continue distributing decision frameworks to the extended leadership team.',
      agreements: 'Sponsor two manager enablement sessions during the next cycle.',
      feedbackMeeting: 'Pending scheduling',
      managerSigned: false,
      employeeSigned: false
    },
    {
      employeeId: '267476',
      status: 'manager_review',
      selfRatings: [4, 4, 3, 4, 4, 4],
      managerRatings: [4, 4, 4, 4, 4, 4],
      calibratedRating: 4.0,
      nineBox: { performance: 'Solid', potential: 'Growth', placement: 'Core contributor' },
      selfComment: 'I kept service levels stable and improved the quality of case documentation.',
      managerComment: 'Jose Antonio is dependable and receptive to feedback. The main opportunity is faster escalation.',
      calibrationNote: 'Waiting for OD review.',
      strengths: 'Customer focus, documentation quality, and dependable follow-up.',
      development: 'Escalate complex cases earlier and share risk signals with the manager.',
      agreements: 'Use a weekly escalation review and document blockers in the case tracker.',
      feedbackMeeting: 'Not released',
      managerSigned: false,
      employeeSigned: false
    },
    {
      employeeId: '257270',
      status: 'closed',
      selfRatings: [4, 4, 4, 5, 4, 4],
      managerRatings: [4, 5, 4, 5, 4, 4],
      calibratedRating: 4.3,
      nineBox: { performance: 'High', potential: 'Growth', placement: 'Ready for stretch' },
      selfComment: 'I stabilized follow-up with stakeholders and improved planning for employee relations cases.',
      managerComment: 'Deysi combines strong service orientation with practical execution. She is ready for a stretch assignment.',
      calibrationNote: 'OD confirms the calibrated result and recommends one stretch project.',
      strengths: 'Service mindset, case discipline, and practical problem-solving.',
      development: 'Increase delegation and coach junior team members with more consistency.',
      agreements: 'Mentor one teammate and present a monthly employee relations trend summary.',
      feedbackMeeting: 'Completed',
      managerSigned: true,
      employeeSigned: true
    }
  ];

  const goals = [
    {
      title: 'Reduce internal request response time',
      measure: 'Average response time for assigned internal requests',
      target: 'Reduce average response time by 15%',
      result: '18% reduction achieved',
      achievement: 120,
      evidence: 'Weekly service dashboard'
    },
    {
      title: 'Update department records',
      measure: 'Records updated before the monthly control review',
      target: '100% updated records',
      result: '95% completed',
      achievement: 95,
      evidence: 'SharePoint control log'
    },
    {
      title: 'Implement a monthly follow-up dashboard',
      measure: 'Dashboard live and reviewed by stakeholders',
      target: 'Live by month two',
      result: 'Launched during month two',
      achievement: 100,
      evidence: 'Power BI monthly view'
    }
  ];

  const statusLabels = {
    self_assessment: 'Self-assessment in progress',
    manager_review: 'Manager review in progress',
    calibrated: 'Calibrated by OD',
    feedback_unlocked: 'Feedback released',
    closed: 'Cycle closed'
  };

  const app = document.getElementById('app');

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

  const average = (items) => items.reduce((sum, value) => sum + Number(value || 0), 0) / Math.max(items.length, 1);
  const percent = (rating) => Math.round((Number(rating || 0) / 5) * 100);
  const byId = (employeeId) => users[employeeId] || {};

  function initialState() {
    return {
      activeRole: 'Employee',
      activeEmployeeId: '990001',
      people: demoPeople.map((person) => ({ ...person }))
    };
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (parsed && Array.isArray(parsed.people)) return parsed;
    } catch (error) {
      console.warn('Unable to read demo state.', error);
    }
    const seeded = initialState();
    saveState(seeded);
    return seeded;
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    } catch (error) {
      return null;
    }
  }

  function setSession(employeeId) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ employeeId }));
  }

  function getPerson(state, employeeId = state.activeEmployeeId) {
    return state.people.find((person) => person.employeeId === employeeId) || state.people[0];
  }

  function currentUser() {
    const session = getSession();
    return session ? users[session.employeeId] : null;
  }

  function signOut() {
    sessionStorage.removeItem(SESSION_KEY);
    renderLogin();
  }

  function resetDemo() {
    saveState(initialState());
    renderApp();
  }

  function setRole(role) {
    const state = loadState();
    state.activeRole = role;
    saveState(state);
    renderApp();
  }

  function setEmployee(employeeId) {
    const state = loadState();
    state.activeEmployeeId = employeeId;
    saveState(state);
    renderApp();
  }

  function updateActivePerson(changes) {
    const state = loadState();
    const person = getPerson(state);
    Object.assign(person, changes);
    if (person.managerSigned && person.employeeSigned) person.status = 'closed';
    else if (person.status === 'calibrated') person.status = 'feedback_unlocked';
    saveState(state);
    renderApp();
  }

  function renderLogin() {
    app.innerHTML = `
      <main class="login-page">
        <section class="login-visual">
          <img src="assets/ic-admin-hero.jpg" alt="IC Admin performance review workspace">
          <div class="login-overlay">
            <p>PERFORMANCE DEMO</p>
            <h1>IC Admin Performance Evaluation</h1>
            <span>English-native V2 for end-to-end review testing.</span>
          </div>
        </section>
        <section class="login-panel" aria-labelledby="login-title">
          <img class="login-logo" src="assets/ic-admin-logo.svg" alt="IC Admin">
          <p class="eyebrow">LOCAL DEMO ONLY</p>
          <h2 id="login-title">Sign in</h2>
          <p class="muted">Use the demo credentials to review the complete Employee, Manager, OD and signature workflow. No production backend is connected.</p>
          <label class="field">
            <span>Employee number</span>
            <input id="employee-number" inputmode="numeric" autocomplete="username" placeholder="990001">
          </label>
          <label class="field">
            <span>Access PIN</span>
            <input id="access-pin" type="password" inputmode="numeric" autocomplete="current-password" placeholder="314159">
          </label>
          <button class="btn primary" id="login-button">Sign in</button>
          <div class="demo-users">
            <strong>Demo credentials</strong>
            <span>Monserrat Cayon: 990001 / 314159</span>
            <span>Gabriel Sabogal: 990002 / 253614</span>
          </div>
          <p id="login-error" class="error" role="alert"></p>
        </section>
      </main>`;

    document.getElementById('login-button').addEventListener('click', () => {
      const employeeId = document.getElementById('employee-number').value.trim();
      const pin = document.getElementById('access-pin').value.trim();
      const user = users[employeeId];
      if (!user || user.pin !== pin) {
        document.getElementById('login-error').textContent = 'Incorrect employee number or PIN.';
        return;
      }
      setSession(employeeId);
      const state = loadState();
      state.activeEmployeeId = employeeId;
      state.activeRole = user.roles[0];
      saveState(state);
      renderApp();
    });
  }

  function shell(content) {
    const session = getSession();
    const user = currentUser();
    const state = loadState();
    const activePerson = getPerson(state);
    const employee = byId(activePerson.employeeId);
    const roles = user.roles.map((role) => `
      <button class="role-tab ${state.activeRole === role ? 'active' : ''}" data-role="${role}">${role}</button>
    `).join('');
    const employeeOptions = state.people.map((person) => {
      const personUser = byId(person.employeeId);
      return `<option value="${person.employeeId}" ${person.employeeId === activePerson.employeeId ? 'selected' : ''}>${personUser.name}</option>`;
    }).join('');

    app.innerHTML = `
      <div class="app-shell">
        <header class="topbar">
          <a class="brand" href="#/" aria-label="Go to dashboard">
            <img src="assets/ic-admin-logo-white.svg" alt="IC Admin">
            <span>Performance Demo V2</span>
          </a>
          <nav class="top-actions" aria-label="Primary">
            <a href="#/">Dashboard</a>
            <a href="#/employee">Employee</a>
            <a href="#/manager">Manager</a>
            <a href="#/admin">OD/Admin</a>
            <a href="#/feedback">Feedback</a>
            <a href="#/signatures">Signatures</a>
          </nav>
          <button class="ghost" id="sign-out">Sign out</button>
        </header>
        <main class="workspace">
          <section class="context-bar">
            <div>
              <p class="eyebrow">FY2026 PERFORMANCE CYCLE</p>
              <h1>${escapeHtml(employee.name)}</h1>
              <p class="muted">${escapeHtml(employee.title)} · ${escapeHtml(employee.department)}</p>
            </div>
            <div class="context-controls">
              <label>
                <span>Active role</span>
                <div class="role-tabs">${roles}</div>
              </label>
              <label>
                <span>Review case</span>
                <select id="employee-select">${employeeOptions}</select>
              </label>
            </div>
          </section>
          ${content}
        </main>
      </div>`;

    document.getElementById('sign-out').addEventListener('click', signOut);
    document.getElementById('employee-select').addEventListener('change', (event) => setEmployee(event.target.value));
    document.querySelectorAll('[data-role]').forEach((button) => {
      button.addEventListener('click', () => setRole(button.dataset.role));
    });
    if (!session) renderLogin();
  }

  function summaryCards(person) {
    const managerAverage = average(person.managerRatings);
    return `
      <section class="metric-grid">
        <article class="metric-card">
          <span>Workflow status</span>
          <strong>${escapeHtml(statusLabels[person.status])}</strong>
          <small>${person.managerSigned && person.employeeSigned ? 'Both signatures completed' : 'Open demo case'}</small>
        </article>
        <article class="metric-card">
          <span>Manager rating</span>
          <strong>${managerAverage.toFixed(1)} / 5</strong>
          <small>${percent(managerAverage)} overall score</small>
        </article>
        <article class="metric-card">
          <span>Calibrated result</span>
          <strong>${person.calibratedRating.toFixed(1)} / 5</strong>
          <small>${percent(person.calibratedRating)} calibrated score</small>
        </article>
        <article class="metric-card">
          <span>9-Box placement</span>
          <strong>${escapeHtml(person.nineBox.placement)}</strong>
          <small>${escapeHtml(person.nineBox.performance)} performance · ${escapeHtml(person.nineBox.potential)} potential</small>
        </article>
      </section>`;
  }

  function workflow(person) {
    const steps = [
      ['Employee', 'Self-assessment completed', true],
      ['Manager', 'Manager review submitted', ['manager_review', 'calibrated', 'feedback_unlocked', 'closed'].includes(person.status)],
      ['OD/Admin', 'Calibration reviewed', ['calibrated', 'feedback_unlocked', 'closed'].includes(person.status)],
      ['Feedback', 'Meeting and agreements released', ['feedback_unlocked', 'closed'].includes(person.status)],
      ['Manager Signature', person.managerSigned ? 'Signed' : 'Pending', person.managerSigned],
      ['Employee Signature', person.employeeSigned ? 'Signed' : 'Pending', person.employeeSigned]
    ];
    return `
      <section class="panel">
        <div class="section-head">
          <p class="eyebrow">FULL WORKFLOW</p>
          <h2>Employee to closure journey</h2>
        </div>
        <div class="flow">
          ${steps.map(([title, detail, done]) => `
            <div class="flow-step ${done ? 'done' : ''}">
              <b>${escapeHtml(title)}</b>
              <span>${escapeHtml(detail)}</span>
            </div>
          `).join('')}
        </div>
      </section>`;
  }

  function renderDashboard() {
    const state = loadState();
    const person = getPerson(state);
    shell(`
      ${summaryCards(person)}
      ${workflow(person)}
      <section class="two-column">
        <article class="panel">
          <div class="section-head">
            <p class="eyebrow">DEMO ISOLATION</p>
            <h2>Local demo data</h2>
          </div>
          <p>This V2 demo uses browser storage only. n8n workflows, Airtable data, notification delivery, OTP delivery and backend persistence are intentionally disconnected.</p>
          <div class="callout">Primary full-cycle test user: <strong>Monserrat Cayon · 990001 / 314159</strong></div>
          <button class="btn secondary" id="reset-demo">Reset demo data</button>
        </article>
        <article class="panel">
          <div class="section-head">
            <p class="eyebrow">DEMO SAFEGUARDS</p>
            <h2>English-native demo</h2>
          </div>
          <ul class="check-list">
            <li>Single English interface</li>
            <li>English demo comments and goals</li>
            <li>Local browser-only data</li>
            <li>Manual demo workflow</li>
            <li>Disconnected from production services</li>
          </ul>
        </article>
      </section>`);
    document.getElementById('reset-demo').addEventListener('click', resetDemo);
  }

  function ratingRows(person) {
    return competencies.map((competency, index) => `
      <tr>
        <td>
          <strong>${competency.name}</strong>
          <small>${competency.description}</small>
        </td>
        <td>${person.selfRatings[index]} / 5</td>
        <td>${person.managerRatings[index]} / 5</td>
        <td>${Math.round(((person.selfRatings[index] + person.managerRatings[index]) / 10) * 100)}%</td>
      </tr>`).join('');
  }

  function renderEmployee() {
    const state = loadState();
    const person = getPerson(state);
    shell(`
      <section class="panel">
        <div class="section-head">
          <p class="eyebrow">EMPLOYEE</p>
          <h2>Self-assessment</h2>
        </div>
        <p>${escapeHtml(person.selfComment)}</p>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Competency</th><th>Self rating</th><th>Manager rating</th><th>Alignment</th></tr></thead>
            <tbody>${ratingRows(person)}</tbody>
          </table>
        </div>
      </section>
      <section class="panel">
        <div class="section-head">
          <p class="eyebrow">GOALS</p>
          <h2>Goal validation</h2>
        </div>
        <div class="goal-grid">
          ${goals.map((goal) => `
            <article class="goal-card">
              <strong>${goal.title}</strong>
              <p><b>Measure:</b> ${goal.measure}</p>
              <p><b>Target:</b> ${goal.target}</p>
              <p><b>Result:</b> ${goal.result}</p>
              <span>${goal.achievement}% achievement · ${goal.evidence}</span>
            </article>
          `).join('')}
        </div>
      </section>`);
  }

  function renderManager() {
    const state = loadState();
    const person = getPerson(state);
    shell(`
      <section class="panel">
        <div class="section-head">
          <p class="eyebrow">MANAGER REVIEW</p>
          <h2>Competencies and qualitative comments</h2>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Competency</th><th>Employee</th><th>Manager</th><th>Alignment</th></tr></thead>
            <tbody>${ratingRows(person)}</tbody>
          </table>
        </div>
      </section>
      <section class="two-column">
        <article class="panel">
          <p class="eyebrow">STRENGTHS</p>
          <h2>What went well</h2>
          <p>${escapeHtml(person.strengths)}</p>
        </article>
        <article class="panel">
          <p class="eyebrow">DEVELOPMENT</p>
          <h2>Primary opportunity</h2>
          <p>${escapeHtml(person.development)}</p>
        </article>
      </section>
      <section class="panel">
        <p class="eyebrow">MANAGER COMMENTS</p>
        <h2>Qualitative summary</h2>
        <p>${escapeHtml(person.managerComment)}</p>
      </section>`);
  }

  function renderAdmin() {
    const state = loadState();
    const person = getPerson(state);
    shell(`
      <section class="two-column">
        <article class="panel">
          <p class="eyebrow">OD / ADMIN CALIBRATION</p>
          <h2>Calibration decision</h2>
          <p>${escapeHtml(person.calibrationNote)}</p>
          <div class="score-band">
            <span>Expected standard: 80</span>
            <span>Employee result: ${percent(person.calibratedRating)}</span>
            <span>Area average: 84</span>
            <span>Company average: 82</span>
          </div>
          <button class="btn primary" id="release-feedback">Release feedback</button>
        </article>
        <article class="panel">
          <p class="eyebrow">9-BOX</p>
          <h2>${escapeHtml(person.nineBox.placement)}</h2>
          <div class="ninebox">
            <div></div><div class="${person.nineBox.performance === 'High' && person.nineBox.potential !== 'High' ? 'active' : ''}">High performance</div><div class="${person.nineBox.placement === 'Accelerate' || person.nineBox.placement === 'Enterprise leader' ? 'active' : ''}">Top talent</div>
            <div></div><div class="${person.nineBox.performance === 'Solid' ? 'active' : ''}">Solid contributor</div><div class="${person.nineBox.potential === 'Growth' ? 'active' : ''}">Growth track</div>
            <div>Potential</div><div>Performance</div><div>Readiness</div>
          </div>
        </article>
      </section>`);
    document.getElementById('release-feedback').addEventListener('click', () => updateActivePerson({ status: 'feedback_unlocked', feedbackMeeting: 'Confirmed' }));
  }

  function renderFeedback() {
    const state = loadState();
    const person = getPerson(state);
    shell(`
      <section class="panel">
        <div class="section-head">
          <p class="eyebrow">FEEDBACK</p>
          <h2>Meeting, agreements and follow-up</h2>
        </div>
        <div class="status-banner ${person.status === 'feedback_unlocked' || person.status === 'closed' ? 'ready' : ''}">
          ${person.status === 'feedback_unlocked' || person.status === 'closed' ? 'Feedback is released for this employee.' : 'Feedback has not been released yet.'}
        </div>
        <div class="agreement-grid">
          <article>
            <span>Meeting status</span>
            <strong>${escapeHtml(person.feedbackMeeting)}</strong>
          </article>
          <article>
            <span>Final agreements</span>
            <strong>${escapeHtml(person.agreements)}</strong>
          </article>
          <article>
            <span>Development plan</span>
            <strong>${escapeHtml(person.development)}</strong>
          </article>
        </div>
      </section>`);
  }

  function renderSignatures() {
    const state = loadState();
    const person = getPerson(state);
    const canEmployeeSign = person.managerSigned;
    shell(`
      <section class="two-column">
        <article class="panel signature-card">
          <p class="eyebrow">MANAGER SIGNATURE</p>
          <h2>${person.managerSigned ? 'Signed' : 'Pending manager signature'}</h2>
          <p>The manager confirms that the feedback meeting occurred and that agreements were reviewed.</p>
          <button class="btn primary" id="manager-sign" ${person.managerSigned ? 'disabled' : ''}>Sign as manager</button>
        </article>
        <article class="panel signature-card">
          <p class="eyebrow">EMPLOYEE SIGNATURE</p>
          <h2>${person.employeeSigned ? 'Signed' : 'Pending employee signature'}</h2>
          <p>The employee confirms receipt of the review, feedback and final agreements.</p>
          <button class="btn primary" id="employee-sign" ${person.employeeSigned || !canEmployeeSign ? 'disabled' : ''}>Sign as employee</button>
          ${!canEmployeeSign ? '<p class="hint">The manager signature is required before the employee can sign.</p>' : ''}
        </article>
      </section>
      ${workflow(person)}`);
    document.getElementById('manager-sign').addEventListener('click', () => updateActivePerson({ managerSigned: true, status: 'feedback_unlocked' }));
    document.getElementById('employee-sign').addEventListener('click', () => updateActivePerson({ employeeSigned: true }));
  }

  function renderApp() {
    if (!currentUser()) {
      renderLogin();
      return;
    }
    const route = location.hash.replace('#', '') || '/';
    if (route.startsWith('/employee')) renderEmployee();
    else if (route.startsWith('/manager')) renderManager();
    else if (route.startsWith('/admin')) renderAdmin();
    else if (route.startsWith('/feedback')) renderFeedback();
    else if (route.startsWith('/signatures')) renderSignatures();
    else renderDashboard();
  }

  window.addEventListener('hashchange', renderApp);
  renderApp();
})();
