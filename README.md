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
- The application remains isolated from the production backend while executive review is in progress.
- The public demo banner, role shortcuts and test-case selector are disabled. Only the restricted administrator account can create a session.
- The restricted account is identified as Gabriel Sabogal and receives administrator, management, calibration and full-evaluation visibility permissions. Its password is compared through a SHA-256 digest and is not stored in plaintext in the repository.
- `apiBaseUrl` is intentionally empty during demo testing. Real OTP delivery, cross-device persistence, backend permissions, notification delivery and concurrent sessions are not validated by this local demo. Claude must restore an ICA-specific API base URL and configure API session/storage keys when the real backend is ready.
- IC Admin uses separate browser storage and session keys.
- The software catalog now uses Salesforce, Paycom, Concur, Excel, SharePoint, Planner, PowerPoint, IQ-iconiq and Other.
- The final competency and software catalog is pending validation with Alejandrina Badillo (Technology).

## Isolation rule

Do not connect this repository to the Mexico n8n/Airtable environment. Before enabling API mode, configure and validate an IC Admin-specific backend, data base, workflows, notification templates, and organizational structure.
