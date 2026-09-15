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
  const db=c.EDDStorage.load();db.colaboradores[0].nombre='Edited sample';c.EDDStorage.persist();assert.match(c.localStorage.getItem('edd_ic_admin_demo_db_v2'),/Edited sample/);
  c.EDDStorage.reset();assert.equal(c.localStorage.getItem('edd_ic_admin_db_v1'),'old ICA data');assert.equal(c.localStorage.getItem('edd_mexico'),'Mexico sentinel');assert.match(c.EDDStorage.load().colaboradores[0].nombre,/^Demo/);
});
test('API mode does not apply synthetic identity overrides or accept demo authentication',async()=>{
  const {context:c,calls}=runtime();c.APP_CONFIG.mode='api';
  await assert.rejects(c.EDDAuth.requestCode('10001'),/must not call backend/);assert.equal(calls(),1);
  c.EDDData.COLABORADORES[0].nombre='Sentinel';vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/demo-local.js'),'utf8'),c);assert.equal(c.EDDData.COLABORADORES[0].nombre,'Sentinel');
});
