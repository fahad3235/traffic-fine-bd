// Traffic Fine BD headless-Chrome smoke test (raw CDP, headless_shell).
// Run: node smoke/smoke.mjs
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const PAGE = 'file://' + path.resolve(DIR, '..', 'index.html');
const CHROME = process.env.HEADLESS_SHELL ||
  (process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell');
const PORT = 9234;
const PROFILE = fs.mkdtempSync(path.join(os.tmpdir(), 'tfbd-smoke-'));

const results = [];
function check(name, cond, extra) {
  results.push([name, !!cond]);
  console.log((cond ? 'ok - ' : 'FAIL - ') + name + (extra !== undefined ? ' :: ' + extra : ''));
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitFor(fn, timeoutMs, label) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try { if (await fn()) return true; } catch (e) { /* retry */ }
    await sleep(200);
  }
  throw new Error('timeout waiting for: ' + label);
}

async function main() {
  const child = spawn(CHROME, [
    '--headless', '--no-sandbox', '--disable-gpu',
    '--user-data-dir=' + PROFILE,
    '--remote-debugging-port=' + PORT, '--remote-debugging-address=127.0.0.1',
    'about:blank',
  ], { stdio: 'ignore' });
  try {
    let version = null;
    await waitFor(async () => {
      const res = await fetch('http://127.0.0.1:' + PORT + '/json/version');
      if (!res.ok) return false;
      version = await res.json();
      return true;
    }, 20000, 'debugger port');
    const ws = new WebSocket(version.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    let id = 0;
    const pending = new Map();
    const consoleErrors = [];
    const exceptions = [];
    const onMsg = (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) rej(new Error(JSON.stringify(msg.error))); else res(msg.result);
      }
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description).join(' '));
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        exceptions.push(msg.params.exceptionDetails.exception?.description || 'exception');
      }
    };
    ws.onmessage = onMsg;
    const send = (method, params) => new Promise((res, rej) => {
      const mid = ++id;
      pending.set(mid, { res, rej });
      ws.send(JSON.stringify({ id: mid, method, params: params || {} }));
    });
    const target = await (await fetch('http://127.0.0.1:' + PORT + '/json/new?about:blank', { method: 'PUT' })).json();
    const tws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => { tws.onopen = res; tws.onerror = rej; });
    const tpending = new Map();
    let tid = 0;
    tws.onmessage = (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && tpending.has(msg.id)) {
        const { res, rej } = tpending.get(msg.id);
        tpending.delete(msg.id);
        if (msg.error) rej(new Error(JSON.stringify(msg.error))); else res(msg.result);
      }
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description).join(' '));
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        exceptions.push(msg.params.exceptionDetails.exception?.description || 'exception');
      }
    };
    const tsend = (method, params) => new Promise((res, rej) => {
      const mid = ++tid;
      tpending.set(mid, { res, rej });
      tws.send(JSON.stringify({ id: mid, method, params: params || {} }));
    });
    const teval = async (expr) => {
      const r = await tsend('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'eval failed');
      return r.result.value;
    };
    await tsend('Runtime.enable');
    await tsend('Page.enable');
    await tsend('Page.navigate', { url: PAGE });
    await waitFor(async () => (await teval('document.querySelectorAll(".offence").length')) === 23, 10000, 'offences render');

    // 1. Static render.
    check('app title is Traffic Fine BD', await teval('document.querySelector("h1").textContent') === 'Traffic Fine BD');
    check('23 offence cards render', (await teval('document.querySelectorAll(".offence").length')) === 23);
    check('stats show 23 of 23 offences', await teval('document.getElementById("stats").textContent.includes("23 of 23")'));
    check('5 category chips render (all + 4)', (await teval('document.querySelectorAll(".chip").length')) === 5);
    check('calculator empty state shown', await teval('document.querySelector("#calc-body").textContent.includes("Add to estimate")'));
    check('3 info cards render', (await teval('document.querySelectorAll(".info").length')) === 3);
    check('footer disclaimer mentions not legal advice', await teval('document.querySelector(".foot").textContent.includes("not legal advice")'));
    check('7 demerit badges render', (await teval('document.querySelectorAll(".demerit-badge").length')) === 7);
    check('first card (highest fine) shows Tk 500,000', await teval('document.querySelectorAll(".fine-amount")[0].textContent.includes("500,000")'));

    // 2. Search filters.
    await teval('var s = document.getElementById("search"); s.value = "helmet"; s.dispatchEvent(new Event("input", {bubbles: true}))');
    await sleep(200);
    check('search "helmet" filters to 1 card', (await teval('document.querySelectorAll(".offence").length')) === 1);
    check('helmet card is the motorcycle one', await teval('document.querySelector(".offence-title").textContent.includes("motorcycle without a helmet")'));
    await teval('var s = document.getElementById("search"); s.value = ""; s.dispatchEvent(new Event("input", {bubbles: true}))');
    await sleep(200);
    check('clearing search restores 23 cards', (await teval('document.querySelectorAll(".offence").length')) === 23);
    await teval('var s = document.getElementById("search"); s.value = "zzz-no-match"; s.dispatchEvent(new Event("input", {bubbles: true}))');
    await sleep(200);
    check('no-match search shows empty state', await teval('document.querySelector(".empty") !== null'));
    await teval('var s = document.getElementById("search"); s.value = ""; s.dispatchEvent(new Event("input", {bubbles: true}))');
    await sleep(200);

    // 3. Category filter chips.
    await teval('document.querySelector("[data-cat=conduct]").click()');
    await sleep(200);
    check('conduct chip shows 14 cards', (await teval('document.querySelectorAll(".offence").length')) === 14);
    await teval('document.querySelector("[data-cat=licence]").click()');
    await sleep(200);
    check('licence chip shows 2 cards', (await teval('document.querySelectorAll(".offence").length')) === 2);
    await teval('document.querySelector("[data-cat=all]").click()');
    await sleep(200);
    check('all chip restores 23 cards', (await teval('document.querySelectorAll(".offence").length')) === 23);

    // 4. Sort.
    await teval('var sel = document.getElementById("sort"); sel.value = "low"; sel.dispatchEvent(new Event("change", {bubbles: true}))');
    await sleep(200);
    check('sort low: first card shows Tk 5,000', await teval('document.querySelectorAll(".fine-amount")[0].textContent.includes("5,000")'));
    await teval('var sel = document.getElementById("sort"); sel.value = "high"; sel.dispatchEvent(new Event("change", {bubbles: true}))');
    await sleep(200);
    check('sort high: first card shows Tk 500,000 again', await teval('document.querySelectorAll(".fine-amount")[0].textContent.includes("500,000")'));

    // 5. Calculator: add helmet, seatbelt, mobile -> 20,000; persists; clear.
    await teval('document.querySelector("[data-add=no-helmet]").click()');
    await sleep(200);
    check('adding helmet shows total Tk 10,000', await teval('document.querySelector(".calc-total").textContent.includes("10,000")'));
    check('calculator shows 1 offence selected', await teval('document.querySelector(".calc-count").textContent.includes("1 offence")'));
    await teval('document.querySelector("[data-add=seatbelt]").click()');
    await sleep(200);
    await teval('document.querySelector("[data-add=mobile]").click()');
    await sleep(200);
    check('helmet + seatbelt + mobile total is Tk 20,000', await teval('document.querySelector(".calc-total").textContent.includes("20,000")'));
    check('selection saved to localStorage', await teval('JSON.parse(localStorage.getItem("traffic-fine-bd-v1")).selected.length === 3'));
    await tsend('Page.navigate', { url: PAGE });
    await waitFor(async () => (await teval('document.querySelectorAll(".offence").length')) === 23, 10000, 'reload');
    check('selection persists after reload (total 20,000)', await teval('document.querySelector(".calc-total").textContent.includes("20,000")'));
    await teval('document.getElementById("calc-clear").click()');
    await sleep(200);
    check('clear restores calculator empty state', await teval('document.querySelector("#calc-body").textContent.includes("Add to estimate")'));

    // 6. Language toggle to Bangla + persistence.
    await teval('document.getElementById("lang-toggle").click()');
    await sleep(300);
    check('title switches to Bengali', await teval('document.querySelector("h1").textContent') === '\u099f\u09cd\u09b0\u09be\u09ab\u09bf\u0995 \u09ab\u09be\u0987\u09a8 \u09ac\u09bf\u09a1\u09bf');
    check('html lang switches to bn', await teval('document.documentElement.lang') === 'bn');
    check('first fine shows Bengali digits 500,000', await teval('document.querySelectorAll(".fine-amount")[0].textContent.includes("\u09eb\u09e6\u09e6,\u09e6\u09e6\u09e6")'));
    check('stats show Bengali digits', await teval('document.getElementById("stats").textContent.includes("\u09e8\u09e9")'));
    await tsend('Page.navigate', { url: PAGE });
    await waitFor(async () => (await teval('document.querySelectorAll(".offence").length')) === 23, 10000, 'reload BN');
    check('Bangla still active after reload', await teval('document.querySelector("h1").textContent') === '\u099f\u09cd\u09b0\u09be\u09ab\u09bf\u0995 \u09ab\u09be\u0987\u09a8 \u09ac\u09bf\u09a1\u09bf');
    await teval('document.getElementById("lang-toggle").click()');
    await sleep(300);
    check('toggle back to English', await teval('document.querySelector("h1").textContent') === 'Traffic Fine BD');

    // 7. Mobile 390px: no horizontal overflow.
    await tsend('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await sleep(500);
    check('no overflow at 390px', await teval('document.documentElement.scrollWidth <= 391'));

    // 8. No console errors / exceptions.
    check('zero console errors', consoleErrors.length === 0, consoleErrors.join(' | '));
    check('zero page exceptions', exceptions.length === 0, exceptions.join(' | '));

    tws.close(); ws.close();
  } finally {
    child.kill();
    try { fs.rmSync(PROFILE, { recursive: true, force: true }); } catch (e) { /* ignore */ }
  }
  const failed = results.filter((r) => !r[1]).length;
  console.log(failed === 0 ? 'SMOKE PASS: ' + results.length + '/' + results.length : 'SMOKE FAIL: ' + failed + ' failures');
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => { console.error('SMOKE ERROR:', e.message); process.exit(1); });
