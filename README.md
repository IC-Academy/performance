# IC Admin Performance Evaluation

Independent IC Admin adaptation of the Inter-Con EDD product foundation.

Test domain: `performance.intercon.com.mx`

## Current status

- IC Admin branding assets and interim hero artwork applied.
- English is the default interface language.
- Feedback closure includes a manual Outlook Calendar link; no calendar event is created or saved by EDD. Existing meeting confirmation, agreement capture, and signature gates remain unchanged.
- The Outlook action now opens a new event with the employee, review-cycle subject, and context prefilled; the manager still chooses the date/time and sends the invitation manually.
- The Values and Attitude section visibly defines ESPÍRITU as Excellence, Service, Passion, Integrity, Respect, Innovation, Teamwork, and Unity.
- The final calibration view compares the expected standard, calibrated employee result, area average, and company average on a common 0–100 scale.
- Organizational Development (DO) replaces RH/HR in interface wording; existing data field identifiers are preserved.
- The application is intentionally isolated in `demo` mode.
- Local test access is available directly from the login screen (no email or real OTP). All identities are synthetic and demo data is stored under `edd_ic_admin_demo_db_v2` in this browser only; sessions use `edd_ic_admin_demo_session_v2`. Existing ICA/Mexico storage is not deleted.
- Test cases: employee 10001 (blank), 10002 (submitted self), 10003 (pending calibration), 10004 (released feedback); manager 20001 (new/self-submitted team), manager 20002 (calibration/feedback team); DO admin 90001. Sign out to switch roles without resetting data. Reset local demo requires confirmation and never changes Airtable or Mexico.
- `apiBaseUrl` is intentionally empty during demo testing. Real OTP delivery, cross-device persistence, backend permissions, notification delivery and concurrent sessions are not validated by this local demo. Claude must restore an ICA-specific API base URL and configure API session/storage keys when the real backend is ready.
- IC Admin uses separate browser storage and session keys.
- Power BI and PayCom were added as interim role-dependent tools based on Sara's operational input.
- The final competency and software catalog is pending validation with Alejandrina Badillo (Technology).

## Isolation rule

Do not connect this repository to the Mexico n8n/Airtable environment. Before enabling API mode, configure and validate an IC Admin-specific backend, data base, workflows, notification templates, and organizational structure.
