'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { calibrationAccess, scopePredicate } = require('./scoped-calibration-policy');
const ids = ['EMP-A','EMP-B','EMP-C','EMP-D','EMP-E','EMP-F','EMP-G','EMP-H'];
const periodId = 'PER-ICA-2026-01';
const scope = { scope:'assigned_calibration', modules:['calibration'], employeeIds:ids, periodId };
const employee = { Tenant:'IC ADMIN', 'Estatus empleado':'Activo', 'Número de empleado':'CALIBRATOR', 'Alcance administrador (JSON)':JSON.stringify(scope) };
const periods = [{ 'ID Periodo':periodId, Activo:true }];
const assignments = ids.map(id => ({'Número de empleado':id, 'Responsable calibración':'CALIBRATOR', Periodo:periodId, 'Asignación activa':true}));
test('exactly eight assigned people; no global admin and no self-access', () => {
  const a = calibrationAccess(employee, periods, assignments.concat({'Número de empleado':'CALIBRATOR','Responsable calibración':'CALIBRATOR',Periodo:periodId,'Asignación activa':true}));
  assert.deepEqual(a.employeeIds,ids); assert.equal(a.globalAdmin,false); assert.equal(a.allowed,true);
});
test('configuration cannot add an unrelated employee without an active assignment', () => {
  const e = {...employee,'Alcance administrador (JSON)':JSON.stringify({...scope,employeeIds:ids.concat('OTHER')})};
  assert.deepEqual(calibrationAccess(e,periods,assignments).employeeIds,ids);
});
for(const [label,field,value] of [['revoked','Asignación activa',false],['wrong calibrator','Responsable calibración','OTHER'],['different period','Periodo','OLD'],['test assignment','Registro de prueba',true]]) {
  test(label+' is excluded',()=>assert.equal(calibrationAccess(employee,periods,assignments.map(a=>({...a,[field]:value}))).allowed,false));
}
test('missing, invalid and all-admin JSON do not grant scoped access',()=>{
  for(const raw of ['', '{', JSON.stringify({scope:'all',modules:['calibration']})]) assert.equal(calibrationAccess({...employee,'Alcance administrador (JSON)':raw},periods,assignments).allowed,false);
});
test('inactive actor, wrong tenant, expired period and empty assignments fail closed',()=>{
  assert.equal(calibrationAccess({...employee,'Estatus empleado':'Inactivo'},periods,assignments).allowed,false);
  assert.equal(calibrationAccess({...employee,Tenant:'OTHER'},periods,assignments).allowed,false);
  assert.equal(calibrationAccess(employee,[],assignments).allowed,false);
  assert.equal(calibrationAccess(employee,periods,[]).allowed,false);
});
test('existing global DO administrators retain their access',()=>assert.equal(calibrationAccess({...employee,'Es administrador DO':true},[],[]).globalAdmin,true));
test('Airtable predicates enforce both employee and period and never broaden empty access',()=>{
  const a=calibrationAccess(employee,periods,assignments), q=scopePredicate(a,'Número de empleado');
  ids.forEach(id=>assert.ok(q.includes(id))); assert.ok(q.includes(periodId)); assert.ok(!q.includes('CALIBRATOR'));
  assert.equal(scopePredicate({allowed:false,globalAdmin:false,employeeIds:[]},'Número de empleado'),'FALSE()');
});
