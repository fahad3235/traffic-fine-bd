// Traffic Fine BD - logic unit tests. Plain node assert, no deps.
// Run: node tests/logic.test.js
const assert = require('assert');
const DATA = require('../js/data');
const I18N = require('../js/i18n');
const L = DATA.logic;

let n = 0;
function check(name, fn) { n += 1; fn(); console.log('ok - ' + name); }

// --- data integrity ---
check('23 offences with unique ids', () => {
  assert.strictEqual(DATA.offences.length, 23);
  const ids = DATA.offences.map(o => o.id);
  assert.strictEqual(new Set(ids).size, ids.length);
});
check('every offence has category, fine, EN/BN title + desc', () => {
  const cats = new Set(DATA.categories.map(c => c.id));
  DATA.offences.forEach(o => {
    assert.ok(cats.has(o.cat), o.id + ' cat');
    assert.ok(Number.isInteger(o.fine) && o.fine > 0, o.id + ' fine');
    assert.ok(o.jail === null || (Number.isInteger(o.jail) && o.jail > 0), o.id + ' jail');
    assert.strictEqual(typeof o.demerit, 'boolean', o.id + ' demerit');
    ['en', 'bn'].forEach(l => {
      assert.ok(o[l].title && o[l].desc, o.id + ' ' + l);
    });
  });
});
check('category counts: licence 2, registration 4, conduct 14, accident 3', () => {
  const counts = {};
  DATA.offences.forEach(o => { counts[o.cat] = (counts[o.cat] || 0) + 1; });
  assert.deepStrictEqual(counts, { licence: 2, registration: 4, conduct: 14, accident: 3 });
});
check('headline fines match verified sources (RTA 2018)', () => {
  const byId = {};
  DATA.offences.forEach(o => { byId[o.id] = o; });
  assert.strictEqual(byId['no-licence'].fine, 25000);
  assert.strictEqual(byId['no-licence'].jail, 6);
  assert.strictEqual(byId['unregistered'].fine, 50000);
  assert.strictEqual(byId['no-fitness'].fine, 25000);
  assert.strictEqual(byId['fake-licence'].fine, 500000);
  assert.strictEqual(byId['modification'].fine, 300000);
  assert.strictEqual(byId['overloading'].fine, 100000);
  assert.strictEqual(byId['reckless'].fine, 10000);
  assert.strictEqual(byId['drunk'].fine, 10000);
  assert.strictEqual(byId['fatal-reckless'].fine, 500000);
  assert.strictEqual(byId['fatal-reckless'].jail, 60);
  assert.strictEqual(byId['no-report'].fine, 20000);
  assert.strictEqual(byId['excess-fare'].fine, 10000);
});
check('demerit offences are the source-named types', () => {
  const demerit = DATA.offences.filter(o => o.demerit).map(o => o.id).sort();
  assert.deepStrictEqual(demerit, ['drunk', 'excess-fare', 'horn', 'reckless', 'signal', 'speeding', 'wrong-side']);
});
check('fine range: min 5000, max 500000', () => {
  const fines = DATA.offences.map(o => o.fine);
  assert.strictEqual(Math.min.apply(null, fines), 5000);
  assert.strictEqual(Math.max.apply(null, fines), 500000);
});

// --- filter ---
check('filter: empty query + all cats returns 23', () => {
  assert.strictEqual(L.filterOffences(DATA.offences, '', 'all').length, 23);
});
check('filter: category conduct returns 14', () => {
  assert.strictEqual(L.filterOffences(DATA.offences, '', 'conduct').length, 14);
});
check('filter: "helmet" matches 1 offence', () => {
  const r = L.filterOffences(DATA.offences, 'helmet', 'all');
  assert.strictEqual(r.length, 1);
  assert.strictEqual(r[0].id, 'no-helmet');
});
check('filter: "licence" matches no-licence + fake-licence', () => {
  const ids = L.filterOffences(DATA.offences, 'licence', 'all').map(o => o.id).sort();
  assert.deepStrictEqual(ids, ['fake-licence', 'no-licence']);
});
check('filter: Bengali query matches Bengali title', () => {
  const r = L.filterOffences(DATA.offences, '\u09b9\u09c7\u09b2\u09ae\u09c7\u099f', 'all');
  assert.strictEqual(r.length, 1);
  assert.strictEqual(r[0].id, 'no-helmet');
});
check('filter: multi-word query requires all words', () => {
  const r = L.filterOffences(DATA.offences, 'motorcycle helmet', 'all');
  assert.strictEqual(r.length, 1);
  assert.strictEqual(r[0].id, 'no-helmet');
});
check('filter: no-match query returns empty', () => {
  assert.strictEqual(L.filterOffences(DATA.offences, 'zzz-no-match', 'all').length, 0);
});
check('filter: query + category combine (helmet in conduct)', () => {
  assert.strictEqual(L.filterOffences(DATA.offences, 'helmet', 'conduct').length, 1);
  assert.strictEqual(L.filterOffences(DATA.offences, 'helmet', 'licence').length, 0);
});

// --- sort ---
check('sort high: first is 500000, last is 5000', () => {
  const s = L.sortOffences(DATA.offences, 'high');
  assert.strictEqual(s[0].fine, 500000);
  assert.strictEqual(s[s.length - 1].fine, 5000);
});
check('sort low: first is 5000, last is 500000', () => {
  const s = L.sortOffences(DATA.offences, 'low');
  assert.strictEqual(s[0].fine, 5000);
  assert.strictEqual(s[s.length - 1].fine, 500000);
});
check('sort az: alphabetical by EN title', () => {
  const s = L.sortOffences(DATA.offences, 'az');
  const titles = s.map(o => o.en.title);
  const sorted = titles.slice().sort();
  assert.deepStrictEqual(titles, sorted);
});
check('sort does not mutate the input array', () => {
  const before = DATA.offences.map(o => o.id);
  L.sortOffences(DATA.offences, 'low');
  assert.deepStrictEqual(DATA.offences.map(o => o.id), before);
});

// --- calculator ---
check('calcTotal: empty selection is zero', () => {
  assert.deepStrictEqual(L.calcTotal(DATA.offences, []), { count: 0, totalFine: 0, maxJail: 0, demeritCount: 0 });
});
check('calcTotal: helmet + seatbelt + mobile = 20000, no jail', () => {
  const r = L.calcTotal(DATA.offences, ['no-helmet', 'seatbelt', 'mobile']);
  assert.strictEqual(r.count, 3);
  assert.strictEqual(r.totalFine, 20000);
  assert.strictEqual(r.maxJail, 0);
  assert.strictEqual(r.demeritCount, 0);
});
check('calcTotal: no-licence + unregistered = 75000, max jail 6', () => {
  const r = L.calcTotal(DATA.offences, ['no-licence', 'unregistered']);
  assert.strictEqual(r.totalFine, 75000);
  assert.strictEqual(r.maxJail, 6);
});
check('calcTotal: jail is the longest single term, not a sum', () => {
  const r = L.calcTotal(DATA.offences, ['no-licence', 'reckless', 'fatal-reckless']);
  assert.strictEqual(r.totalFine, 535000);
  assert.strictEqual(r.maxJail, 60);
});
check('calcTotal: unknown ids are ignored', () => {
  const r = L.calcTotal(DATA.offences, ['no-helmet', 'not-a-real-id']);
  assert.strictEqual(r.count, 1);
  assert.strictEqual(r.totalFine, 10000);
});
check('calcTotal: demerit count counts only demerit offences', () => {
  const r = L.calcTotal(DATA.offences, ['speeding', 'seatbelt', 'horn']);
  assert.strictEqual(r.demeritCount, 2);
});

// --- formatting ---
check('formatBDT groups thousands', () => {
  assert.strictEqual(L.formatBDT(5000), '5,000');
  assert.strictEqual(L.formatBDT(25000), '25,000');
  assert.strictEqual(L.formatBDT(500000), '500,000');
});
check('jailText: months and years', () => {
  assert.strictEqual(L.jailText(1), 'up to 1 month');
  assert.strictEqual(L.jailText(3), 'up to 3 months');
  assert.strictEqual(L.jailText(6), 'up to 6 months');
  assert.strictEqual(L.jailText(12), 'up to 1 year');
  assert.strictEqual(L.jailText(24), 'up to 2 years');
  assert.strictEqual(L.jailText(60), 'up to 5 years');
  assert.strictEqual(L.jailText(null), null);
  assert.strictEqual(L.jailText(0), null);
});

// --- i18n ---
check('i18n: EN/BN key sets identical and non-empty', () => {
  const enKeys = Object.keys(I18N.I18N.en).sort();
  const bnKeys = Object.keys(I18N.I18N.bn).sort();
  assert.deepStrictEqual(enKeys, bnKeys);
  enKeys.forEach(k => {
    assert.ok(I18N.I18N.en[k].length > 0, k + ' en');
    assert.ok(I18N.I18N.bn[k].length > 0, k + ' bn');
  });
});
check('bnDigits converts ASCII digits to Bengali', () => {
  assert.strictEqual(I18N.bnDigits('17'), '\u09e7\u09ed');
  assert.strictEqual(I18N.bnDigits('25,000'), '\u09e8\u09eb,\u09e6\u09e6\u09e6');
  assert.strictEqual(I18N.bnDigits('abc'), 'abc');
});

console.log('\n' + n + '/' + n + ' unit tests passed');
