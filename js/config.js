/**
 * config.js
 * ---------------------------------------------------------------------------
 * Configuración central de la Plataforma EDD Inter-Con.
 *
 * ÚNICO lugar donde vive el modo de ejecución y los parámetros de conexión a
 * la futura API (n8n -> Airtable). Ningún otro archivo debe declarar su
 * propia URL de API ni su propia clave de sessionStorage: todos leen de
 * APP_CONFIG.
 *
 * Dos modos soportados:
 *   - "demo": no hay backend. Usa datos simulados + localStorage, exactamente
 *     igual que en beta 1/beta 2. Es el modo por defecto.
 *   - "api": el frontend queda preparado para hablar con n8n (que a su vez
 *     habla con Airtable). Los endpoints se describen en api.js. Esta beta
 *     NO implementa n8n/Airtable reales: cambiar a "api" sin una URL válida
 *     en apiBaseUrl hará que las llamadas fallen con un error de red
 *     controlado (ver api.js), que es el comportamiento esperado hasta que
 *     exista el backend real.
 *
 * Para cambiar de modo en esta demo: editar APP_CONFIG.mode más abajo, o
 * ejecutar en la consola del navegador: APP_CONFIG.mode = "api" (el cambio
 * de modo en caliente no reconstruye la sesión activa; se recomienda cerrar
 * sesión y volver a entrar después de cambiarlo).
 *
 * NUNCA colocar aquí (ni en ningún otro archivo JS del frontend):
 *   - API keys o tokens de Airtable.
 *   - Credenciales de n8n.
 *   - Contraseñas.
 * Todas las operaciones sensibles deben pasar por los webhooks de n8n, que
 * son quienes conocen las credenciales reales de Airtable (nunca el
 * navegador).
 * ---------------------------------------------------------------------------
 */

(function (global) {
  'use strict';

  const APP_CONFIG = {
    // IC Admin remains isolated in demo mode until its own backend and data
    // environment are available. Never point this instance at the Mexico API.
    mode: 'demo',

    // Acceso temporal restringido para la revisión ejecutiva. La contraseña
    // nunca se guarda en texto plano: auth.js compara SHA-256 de
    // "numeroEmpleado:contraseña". Este control es solo para el entorno
    // estático de revisión; producción deberá usar OTP o Entra ID SSO.
    // Accesos UAT locales y desconectados. Solo se almacenan hashes SHA-256
    // de numeroEmpleado:PIN; los PIN en claro no viven en el repositorio.
    // Este mecanismo se elimina al activar OTP/SSO.
    localDemoUsers: {
      '267476': { credentialHash: '05195b438afd0cf63f78f5a3a95e23a34637cfa628233a994fab732e88fed219', displayName: 'José Antonio García Santiago', role: 'Colaborador', position: 'Officer Success Representative', area: 'Officer Success Department', capabilities: { isAdmin:false, canAdminister:false, canManage:false, canCalibrate:false, canViewAllEvaluations:false, canEvaluate:false, canSelfEvaluate:true } },
      '266885': { credentialHash: 'f4a8fc53066ee30a23f76e427a5dee1ba85c0461ebf19149547026b1b02d05b5', displayName: 'Sara Margarita Santos Ochoa', role: 'Administrador', position: 'Project Operations Manager', area: 'Data Analytics', capabilities: { isAdmin:true, canAdminister:true, canManage:true, canCalibrate:true, canViewAllEvaluations:true, canEvaluate:true, canSelfEvaluate:true } },
      '257270': { credentialHash: 'a50528c34230226f582c3569de1aaf0c5c1b4af89c1f916ff0772b2c231be79a', displayName: 'Deysi Salas Figueroa', role: 'Colaborador', position: 'Employee Assistance Team Lead', area: 'Employee Assistance / People Operations', capabilities: { isAdmin:false, canAdminister:false, canManage:false, canCalibrate:false, canViewAllEvaluations:false, canEvaluate:false, canSelfEvaluate:true } },
      '267465': { credentialHash: '536c809e128b434d7fe2efd0eb91e9e99ec018fa5b57024d261c53807ffbc8aa', displayName: 'Gonzalo Rafael Peña Ortiz', role: 'Líder', position: 'Bill Specialist', area: 'Strategic Operations', capabilities: { isAdmin:false, canAdminister:false, canManage:true, canCalibrate:false, canViewAllEvaluations:false, canEvaluate:true, canSelfEvaluate:true } },
      '260901': { credentialHash: 'cbcba44f719149c8cace431d38f27b46a8ae7e61c93a1a86eb4e8bb1305e238', displayName: 'Alejandro Herrera Leal', role: 'Líder', position: 'Supply Chain Senior Specialist III', area: 'Supply Chain', capabilities: { isAdmin:false, canAdminister:false, canManage:true, canCalibrate:false, canViewAllEvaluations:false, canEvaluate:true, canSelfEvaluate:true } },
      '990001': { credentialHash: '7a8ca0c2f94314b024b399402419ba32bbc413b73a98124f7e69e655b6b17344', displayName: 'Monserrat Cayon', role: 'Administrador', position: 'UAT Full-Cycle Reviewer', area: 'IC Admin', capabilities: { isAdmin:true, canAdminister:true, canManage:true, canCalibrate:true, canViewAllEvaluations:true, canEvaluate:true, canSelfEvaluate:true } }
    },

    // Base de los webhooks de n8n. Sustituir por la URL real del entorno
    // cuando exista. No se usa en modo "demo".
    apiBaseUrl: '', // Disconnected while local testing is enabled.

    // Clave usada en sessionStorage para guardar la sesión (token + usuario).
    // Ver auth.js. Se usa sessionStorage y no localStorage a propósito: el
    // token no debe sobrevivir a que el usuario cierre la pestaña/navegador.
    // Nueva clave para invalidar inmediatamente cualquier sesión creada por
    // los accesos demo anteriores.
    sessionStorageKey: 'edd_ic_admin_local_uat_session_v2',

    // Tiempo máximo (ms) que api.js espera una respuesta antes de abortar la
    // petición y mostrar "Error de conexión".
    requestTimeout: 15000,

    // Vigencia informativa del código temporal (minutos). La validación
    // definitiva de vigencia la debe hacer siempre el backend (n8n).
    codeValidityMinutes: 10,

    // Vigencia de la sesión/token en segundos (8 horas), usada por auth.js
    // tanto en modo demo como como valor por defecto si el backend no manda
    // "expiresIn".
    defaultSessionSeconds: 28800,
    readApiEnabled: false,
    testCaptureEnabled: false,
    writeApiEnabled: false,

    // Rutas dinámicas con webhookId: ya NO se leen desde aquí. Se
    // hardcodearon directamente en api.js (mismo patrón que self-draft,
    // submit-self, leader-draft, submit-leader, save/complete calibration),
    // para evitar que este objeto quede en null silenciosamente y rompa un
    // endpoint sin que nadie lo note. Ver api.js: releaseResult(),
    // confirmFeedbackMeeting(), saveFeedbackAgreements(),
    // releaseFeedbackForSignature(), signFeedbackAsLeader(),
    // signFeedbackAsEmployee().
  };

  global.APP_CONFIG = APP_CONFIG;
})(window);
