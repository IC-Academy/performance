'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const app=fs.readFileSync(path.join(__dirname,'../js/app.js'),'utf8');
test('scoped calibrator has calibration, manager and employee profiles, never administrator',()=>{
 const source=app.slice(app.indexOf('  function capBool('),app.indexOf('  function profileKey('));
 const profiles=vm.runInNewContext(source+'\nperfilesDisponibles({perfil:"lider",capabilities:{isAdmin:false,canCalibrate:true,canEvaluate:true,canSelfEvaluate:true}})');
 assert.deepEqual(JSON.parse(JSON.stringify(profiles)),['calibrador','lider','colaborador']);
});
test('auth does not promote canCalibrate to global administration',()=>{
 const values=new Map();const c={console,addEventListener(){},APP_CONFIG:{mode:'api'},sessionStorage:{getItem:k=>values.get(k)||null},crypto:require('node:crypto').webcrypto,Uint8Array,Date};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/auth.js'),'utf8'),c);
 const u=c.EDDAuth.getAppUser({user:{numeroEmpleado:'CALIBRATOR',rol:'Colaborador',capabilities:{isAdmin:false,canCalibrate:true,canEvaluate:true,canSelfEvaluate:true}}});
 assert.equal(u.capabilities.isAdmin,false);assert.equal(u.capabilities.canCalibrate,true);assert.equal(u.perfil,'lider');
});
test('calibrator uses dedicated server detail and cannot fall through to cached unrelated records',()=>{
 assert.match(app,/state\.user\.perfil === 'calibrador' \? global\.EDDApi\.calibrationDetail/);
 const source=app.slice(app.indexOf('  function viewCalibracionDetalle('),app.indexOf('  function viewCalibracionDetalle(')+650);
 assert.match(source,/Evaluation unavailable/);
 assert.match(app,/state\.user\.perfil === 'calibrador' && page !== 'calibracion'/);
});
