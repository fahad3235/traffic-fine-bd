# Traffic Fine BD

Offline bilingual (English / Bangla) reference for Bangladesh traffic fines under the
Road Transport Act 2018: a searchable offence list with maximum fines, jail terms and
demerit-point flags, plus a fine estimator that totals the maximum fines for several
offences together.

## Problem

Drivers, riders and fleet owners in Bangladesh often do not know what a traffic
offence can cost. The fines in the Road Transport Act 2018 are much higher than the
old 1983 ordinance (for example, driving without a licence went from Tk 500 to
Tk 25,000), and the numbers circulate as rumour. Traffic Fine BD puts the verified
maximum fines in one offline page, in both English and Bangla, so anyone can check
before they drive - and estimate what a set of offences adds up to.

## Features

- **23 offences** from the Road Transport Act 2018, each with maximum fine, maximum
  jail term, category and a demerit-point flag
- **Search** across English and Bangla titles and descriptions
- **Category filters**: Licence, Registration & Vehicle, Driving Conduct, After an Accident
- **Sort** by highest fine, lowest fine, or name A-Z
- **Fine estimator**: tap "Add to estimate" on any offence card; shows the total
  maximum fine, the longest single jail term (not a sum - jail is per offence and a
  court decides), and how many selected offences carry demerit points; selection
  persists in localStorage
- **12-point licence explainer** and a **"If you are fined"** checklist (ask for the
  case slip, pay only against the official slip, keep the receipt, contest in court
  if wrong)
- **English / Bangla toggle** with Bengali digits, persisted in localStorage
- **100% offline** - no network requests, no account, no tracking; responsive down
  to 390px

## Stack

Vanilla HTML + CSS + JavaScript, no dependencies, no build step. Data lives in
`js/data.js`, UI strings in `js/i18n.js`, logic in `js/app.js`. State is kept in
localStorage only.

## Prerequisites

Any modern browser. For tests: Node.js 18+.

## Install

No install step. Open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Dev commands

```sh
node tests/logic.test.js   # unit tests (28 checks)
node smoke/smoke.mjs       # headless-Chrome smoke tests (33 checks, raw CDP)
```

## Environment

No environment variables, no keys, no backend.

## Testing

- `node tests/logic.test.js` - 28/28 pass: data integrity (23 offences, unique ids,
  category counts, headline fines against the published sources), filter, sort,
  calculator totals, jail formatting, i18n key parity, Bengali digits.
- `node smoke/smoke.mjs` - 33/33 pass in headless Chromium (file://): render,
  search, category chips, sort, calculator add/persist/clear, Bangla toggle and
  persistence, 390px no-overflow, zero console errors, zero page exceptions.
- See `TEST_RESULTS.md` for the full run record.

## Deployment

Static site - deploy the folder to any static host. GitHub Pages: enable Pages on
the `main` branch, root folder.

## Sources

Fine amounts are the **maximum** fines under the Road Transport Act 2018 (Act No. 47
of 2018, in force 1 November 2019), as reported by The Daily Star and The Business
Standard (TBS) in November 2019:

- Driving without a licence: up to Tk 25,000 or 6 months
- Driving an unregistered vehicle: up to Tk 50,000 or 6 months
- Driving without a fitness certificate: up to Tk 25,000
- Fake licence / fake number plate: up to Tk 5 lakh or 2 years
- Unlawful vehicle modification: up to Tk 3 lakh or 3 years
- Overloading: up to Tk 1 lakh or 1 year
- Reckless driving, drunk driving, wrong side, speeding, signal violation, no
  helmet, 3 on a bike, loud/banned horn: up to Tk 10,000
- No seatbelt, mobile use, jaywalking, illegal parking, boarding without stopping:
  up to Tk 5,000
- Excess fare without a fare chart: up to Tk 10,000 or 1 month
- Not informing police/fire service or not taking the injured to hospital after an
  accident: up to Tk 20,000 or 1 month
- Reckless driving causing death or serious injury (Section 105, non-bailable):
  up to Tk 5 lakh or 5 years

## Limitations

- **Reference only, not legal advice.** Fines shown are statutory maxima; the amount
  actually imposed can be lower and is decided by the officer or the court.
- Amounts reflect the Act as reported in November 2019. Rules, fines and BRTA
  enforcement (including the demerit-point system) may have changed since - verify
  current rules with BRTA.
- The estimator adds maximum fines; it is not a prediction of what any officer or
  court will impose, and jail terms are shown as the longest single term, not a sum.
- No live data: the app is fully offline by design and does not fetch current fines.

## Status

Complete MVP, tested and verified. Factory run #257, 2026-11-06 (18:00 slot).
