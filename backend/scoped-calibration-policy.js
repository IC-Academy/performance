'use strict';

function calibrationAccess(employee, periods, assignments) {
  const denied = { allowed: false, globalAdmin: false, employeeIds: [], periodId: null };
  if (!employee || employee['Tenant'] !== 'IC ADMIN' || employee['Estatus empleado'] !== 'Activo') return denied;
  if (employee['Es administrador DO'] === true) return { allowed: true, globalAdmin: true, employeeIds: [], periodId: null };
  let scope;
  try { scope = JSON.parse(employee['Alcance administrador (JSON)'] || 'null'); } catch (_) { return denied; }
  if (!scope || scope.scope !== 'assigned_calibration' || !Array.isArray(scope.modules) || !scope.modules.includes('calibration')) return denied;
  if (!Array.isArray(scope.employeeIds) || !scope.employeeIds.length || scope.employeeIds.length > 250) return denied;
  const periodId = scope.periodId;
  if (typeof periodId !== 'string' || !/^[A-Za-z0-9_-]+$/.test(periodId)) return denied;
  if (!(periods || []).some(p => p['ID Periodo'] === periodId && p.Activo === true && !p['Registro de prueba'])) return denied;
  const actor = String(employee['Número de empleado'] || '');
  const configured = new Set(scope.employeeIds.filter(x => typeof x === 'string' && /^[A-Za-z0-9_-]+$/.test(x) && x !== actor));
  const employeeIds = [...new Set((assignments || []).filter(a => a['Asignación activa'] === true && !a['Registro de prueba'] && a.Periodo === periodId && a['Responsable calibración'] === actor && configured.has(a['Número de empleado'])).map(a => a['Número de empleado']))];
  return { allowed: employeeIds.length > 0, globalAdmin: false, employeeIds, periodId };
}

function scopePredicate(access, employeeField) {
  if (access.globalAdmin) return 'TRUE()';
  if (!access.allowed || !access.employeeIds.length) return 'FALSE()';
  const quote = value => "'" + String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  return 'AND({Periodo} = ' + quote(access.periodId) + ',OR(' + access.employeeIds.map(id => '{' + employeeField + '} = ' + quote(id)).join(',') + '))';
}

module.exports = { calibrationAccess, scopePredicate };
