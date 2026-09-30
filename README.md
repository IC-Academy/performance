# IC Admin Performance Evaluation

English-native staging rebuild for the IC Admin performance cycle.

Staging domain: `stgperformance.intercon.com.mx`

## Current STG V2 scope

- The root `index.html` loads the standalone V2 app from `v2/`.
- The V2 interface, demo data, comments, goals, calibration notes, feedback agreements, errors, placeholders and signature states are authored directly in English.
- No language selector, runtime translation dictionary, DOM patching layer or translation observer is loaded by the STG entry.
- Demo data is stored only in the browser for local staging validation.
- Productive n8n workflows, backend persistence, OTP delivery, notification delivery and live ICA data remain disconnected.
- Primary full-cycle demo user: Monserrat Cayon, employee `990001`, PIN `314159`, with Employee, Manager and Administrator access.

## Demo workflow

The staging app supports the full review path:

1. Employee self-assessment
2. Manager review
3. OD/Admin calibration
4. Feedback release
5. Manager signature
6. Employee signature

## Isolation rule

Do not connect this branch to production services or publish it to `performance.intercon.com.mx`. Backend and automation work must wait for an IC Admin-specific staging backend and workflow set.
