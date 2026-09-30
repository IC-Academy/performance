# EDD IC Admin - Production

Frontend oficial de la Evaluacion de Desempeno de IC Admin.

- Dominio: `performance.intercon.com.mx`
- Repositorio: `IC-Academy/performance`
- Backend: webhooks ICA de n8n
- Datos: base oficial ICA en Airtable, accedida unicamente desde n8n
- Interfaz: English-only

## Entornos

Produccion y staging comparten los contratos oficiales de n8n y la base ICA.
El frontend de produccion tiene su propio dominio, CNAME y clave de sesion. El
repositorio `IC-Academy/stg-performance` permanece como ambiente demo/UAT y
los registros de prueba deben conservar su identificador correspondiente.

El navegador solo conoce URLs publicas de webhook. Las credenciales de n8n,
Airtable y correo permanecen en n8n y nunca deben agregarse al repositorio.

## Workflows conectados

| Etapa | Workflow n8n | Funcion |
| --- | --- | --- |
| Auth | `Q0IRzBFT7Nv294uj` | Solicitud y validacion de OTP |
| Session | `u3B2bfyLQG8q753C` | Sesion actual y cierre de sesion |
| Evaluations | `hY2dNLQohQjtSywR` | Evaluaciones propias, inicializacion y detalle |
| Self Draft + Submit Self | `CHfpfGZsWm6VdM0X` | Borrador y envio de autoevaluacion |
| Leader Team | `oBe6PbQ96RRn2PnO` | Equipo del lider |
| Leader Draft | `QZp9ZgYiUIA7jHSG` | Borrador de evaluacion del lider |
| Submit Leader | `jLukVQ7mEqZIakUI` | Envio de evaluacion del lider |
| Calibration | `HUIM6QuC2zegotXp` | Dashboard, borrador y cierre de calibracion |
| Release Feedback | `knGxLWhucJFbWSGC` | Liberacion de resultados |
| Feedback Detail | `vP1NLracbqPJ0St5` | Consulta de retroalimentacion |
| Confirm Meeting | `a99US2aNsVvPqOpg` | Confirmacion de reunion |
| Agreements | `ItMWIttPcrKjKok7` | Acuerdos de retroalimentacion |
| Release Signature | `TlT9p4rmXS9D1vVT` | Liberacion para firmas |
| Leader Signature | `6R8u2sozdZY2vkY4` | Firma del lider |
| Employee Signature | `peSKWqQLdGRpSpqn` | Firma del colaborador y cierre |

La configuracion central vive en `js/config.js`. El ciclo completo esta
habilitado hasta retroalimentacion, acuerdos, firmas y cierre. No se incluyen
credenciales ni accesos directos a Airtable en el frontend.

## Validacion

Las pruebas locales verifican la centralizacion de rutas, el aislamiento de la
sesion de produccion, la cobertura English-only y las plantillas de correo.
