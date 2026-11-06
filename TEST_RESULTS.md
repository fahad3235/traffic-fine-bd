# Traffic Fine BD - test results (factory run #257, 2026-11-06 18:00 slot)

## Unit tests - 28/28 PASS
`node tests/logic.test.js`
- Data: 23 offences, unique ids; every offence has category, positive integer fine,
  jail null or positive integer, boolean demerit flag, EN/BN title + desc.
- Category counts: licence 2, registration 4, conduct 14, accident 3.
- Headline fines match verified sources (RTA 2018, Daily Star + TBS Nov 2019):
  no-licence 25,000/6mo, unregistered 50,000, no-fitness 25,000, fake-licence
  500,000, modification 300,000, overloading 100,000, reckless 10,000, drunk 10,000,
  fatal-reckless 500,000/60mo, no-report 20,000, excess-fare 10,000.
- Demerit offences are exactly the source-named types: drunk, excess-fare, horn,
  reckless, signal, speeding, wrong-side (7).
- Fine range 5,000 - 500,000.
- Filter: empty query 23; conduct 14; "helmet" -> 1 (no-helmet); "licence" ->
  fake-licence + no-licence; Bengali query "helmet" (Bengali script) -> 1;
  multi-word "motorcycle helmet" -> 1; no-match -> 0; query + category combine.
- Sort: high (500,000 first, 5,000 last), low (reversed), az (alphabetical);
  sort does not mutate the input array.
- Calculator: empty -> zeros; helmet + seatbelt + mobile = 20,000, no jail;
  no-licence + unregistered = 75,000, max jail 6; jail is the longest single term
  (no-licence + reckless + fatal-reckless = 535,000, max jail 60); unknown ids
  ignored; demerit count counts only demerit offences.
- Formatting: formatBDT groups thousands (5,000 / 25,000 / 500,000); jailText
  1 month, 3/6 months, 1/2/5 years; null/0 -> null.
- i18n: EN/BN key sets identical (41 keys), all non-empty; bnDigits("17") = Bengali
  "17", bnDigits("25,000") = Bengali "25,000".

## Headless-Chrome smoke - 33/33 PASS
`node smoke/smoke.mjs` (raw CDP, headless_shell-1187, file://)
- Renders: title "Traffic Fine BD", 23 offence cards, stats "23 of 23 offences",
  5 category chips, calculator empty state, 3 info cards, footer "not legal advice",
  7 demerit badges, first card (highest fine) Tk 500,000.
- Search "helmet" -> 1 card (motorcycle without a helmet); clearing restores 23;
  no-match shows empty state.
- Category chips: conduct 14, licence 2, all 23.
- Sort: low -> first card Tk 5,000; high -> first card Tk 500,000.
- Calculator: add helmet -> total Tk 10,000, "1 offence selected"; add seatbelt +
  mobile -> Tk 20,000; selection saved to localStorage; persists after reload;
  clear restores empty state.
- Language: toggle to Bangla (title in Bengali, html lang="bn", first fine shows
  Bengali digits 500,000, stats show Bengali digits); Bangla persists after reload;
  toggles back to English.
- Mobile: no horizontal overflow at 390px.
- Zero console errors, zero page exceptions.

## Repairs during this run
- None. No app bugs, no harness fixes. First smoke run passed 33/33.

## Sources
All source files pure ASCII (Bengali as \uXXXX escapes in JS, numeric entities in
HTML) - verified with `grep -rP '[^\x00-\x7F]'` = 0 matches. Zero network requests
in source (no CDN, fonts, or external images) - verified with grep for http/https
URLs = none (only the localhost example in README).
