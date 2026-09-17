'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
function runtime() {
  const storage = () => { const m=new Map(); return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),keys:()=>[...m.keys()]}; };
  let calls=0;
  const context = {console,Date,Math,JSON,Set,Map,localStorage:storage(),sessionStorage:storage(),setTimeout:fn=>{fn();return 1;},addEventListener:()=>{},document:{addEventListener:()=>{}},EDDApi:{ApiError:class extends Error{},authRequestCode:()=>{calls++;throw Error('Demo must not call backend');},authVerifyCode:()=>{calls++;throw Error('Demo must not call backend');}}};
  context.window=context; vm.createContext(context);
  for (const file of ['config','data','demo-local','calculations','storage','auth']) vm.runInContext(fs.readFileSync(path.join(__dirname,'../js',file+'.js'),'utf8'),context);
  return {context,calls:()=>calls};
}
test('all advertised demo users can authenticate locally, without backend',async()=>{
  const {context:c,calls}=runtime();
  for(const [id,role] of [['10001','colaborador'],['10002','colaborador'],['10003','colaborador'],['10004','colaborador'],['20001','lider'],['20002','lider'],['90001','administrador']]){
    await c.EDDAuth.requestCode(id); await c.EDDAuth.verifyCode(id,c.APP_CONFIG.demoCode);
    const user=c.EDDAuth.getAppUser();assert.equal(user.empleado,id);assert.equal(user.perfil,role);assert.match(user.nombre,/^Demo/);c.EDDAuth.clearSession();
  }
  assert.equal(calls(),0);assert.equal(c.APP_CONFIG.apiBaseUrl,'');assert.equal(c.APP_CONFIG.writeApiEnabled,false);
});
test('manager demo users expose both manager and employee capabilities',async()=>{
  const {context:c}=runtime();
  for(const id of ['20001','20002']){
    await c.EDDAuth.requestCode(id);await c.EDDAuth.verifyCode(id,c.APP_CONFIG.demoCode);
    const user=c.EDDAuth.getAppUser();
    assert.equal(user.perfil,'lider');
    assert.equal(user.capabilities.canEvaluate,true);
    assert.equal(user.capabilities.canSelfEvaluate,true);
    assert.ok(c.EDDStorage.getTodosColaboradores().some(person=>person.empleado===id));
    c.EDDAuth.clearSession();
  }
});
test('an existing pre-capabilities manager session is upgraded locally',()=>{
  const {context:c}=runtime();
  c.sessionStorage.setItem(c.APP_CONFIG.sessionStorageKey,JSON.stringify({token:'demo-existing',expiresAt:new Date(Date.now()+60000).toISOString(),user:{numeroEmpleado:'20001',nombreCompleto:'Demo Manager 20001',rol:'Líder'}}));
  const user=c.EDDAuth.getAppUser();
  assert.equal(user.capabilities.canEvaluate,true);assert.equal(user.capabilities.canSelfEvaluate,true);
});
test('DO admin demo user opens with administrator capability',async()=>{
  const {context:c}=runtime();
  await c.EDDAuth.requestCode('90001');await c.EDDAuth.verifyCode('90001',c.APP_CONFIG.demoCode);
  const user=c.EDDAuth.getAppUser();
  assert.equal(user.perfil,'administrador');assert.equal(user.capabilities.isAdmin,true);
});
test('seed includes blank, submitted, calibration and feedback test cases',()=>{
  const {context:c}=runtime();const s=c.EDDStorage,p=s.getPeriodoActivo().id;
  assert.equal(s.getEvaluacion('10001',p,'autoevaluacion'),undefined);
  assert.ok(s.getEvaluacion('10002',p,'autoevaluacion'));
  assert.ok(s.getEvaluacion('10003',p,'lider'));
  assert.equal(s.getCalibracion('10004',p).retroHabilitada,true);
  assert.equal(s.getColaboradoresDeLider('20001').length,2);
  assert.equal(s.getColaboradoresDeLider('20002').length,2);
});
test('reset and persistence affect only the new local demo namespace',()=>{
  const {context:c}=runtime();c.localStorage.setItem('edd_ic_admin_db_v1','old ICA data');c.localStorage.setItem('edd_mexico','Mexico sentinel');
  const db=c.EDDStorage.load();db.colaboradores[0].nombre='Edited sample';c.EDDStorage.persist();assert.match(c.localStorage.getItem('edd_ic_admin_demo_db_v3'),/Edited sample/);
  c.EDDStorage.reset();assert.equal(c.localStorage.getItem('edd_ic_admin_db_v1'),'old ICA data');assert.equal(c.localStorage.getItem('edd_mexico'),'Mexico sentinel');assert.match(c.EDDStorage.load().colaboradores[0].nombre,/^Demo/);
});
test('API mode does not apply synthetic identity overrides or accept demo authentication',async()=>{
  const {context:c,calls}=runtime();c.APP_CONFIG.mode='api';
  await assert.rejects(c.EDDAuth.requestCode('10001'),/must not call backend/);assert.equal(calls(),1);
  c.EDDData.COLABORADORES[0].nombre='Sentinel';vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/demo-local.js'),'utf8'),c);assert.equal(c.EDDData.COLABORADORES[0].nombre,'Sentinel');
});
