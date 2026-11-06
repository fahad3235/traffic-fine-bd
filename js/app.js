// Traffic Fine BD - app logic. Vanilla JS, no deps, localStorage only.
(function () {
  "use strict";
  var DATA = window.TRAFFIC_DATA;
  var I18N = window.TRAFFIC_I18N;
  var bnDigits = window.TRAFFIC_BN_DIGITS;
  var LOGIC = DATA.logic;
  var LS_KEY = "traffic-fine-bd-v1";

  var state = loadState();
  var lang = state.lang || "en";
  var query = "";
  var cat = "all";
  var sort = "high";

  function loadState() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) { var s = JSON.parse(raw); if (s && typeof s === "object") return s; }
    } catch (e) { /* corrupted storage -> fresh state */ }
    return { lang: "en", selected: [] };
  }
  function saveState() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) { /* storage full/blocked */ }
  }
  function t(key) {
    var s = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
    return s;
  }
  function fmt(key, vars) {
    var s = t(key);
    Object.keys(vars || {}).forEach(function (k) {
      s = s.split("{" + k + "}").join(vars[k]);
    });
    return s;
  }
  function loc(n) { return lang === "bn" ? bnDigits(n) : String(n); }
  function fmtNum(n) {
    var s = LOGIC.formatBDT(n);
    return lang === "bn" ? bnDigits(s) : s;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function jailTextBn(months) {
    if (!months) return null;
    if (months % 12 === 0) {
      var y = months / 12;
      return "\u09b8\u09b0\u09cd\u09ac\u09cb\u099a\u09cd\u099a " + bnDigits(y) + (y === 1 ? " \u09ac\u099b\u09b0" : " \u09ac\u099b\u09b0");
    }
    return "\u09b8\u09b0\u09cd\u09ac\u09cb\u099a\u09cd\u099a " + bnDigits(months) + " \u09ae\u09be\u09b8";
  }
  function jailText(months) {
    if (!months) return null;
    return lang === "bn" ? jailTextBn(months) : LOGIC.jailText(months);
  }
  function catName(id) {
    var c = null;
    DATA.categories.forEach(function (x) { if (x.id === id) c = x; });
    return c ? (lang === "bn" ? c.bn : c.en) : id;
  }

  function visibleOffences() {
    return LOGIC.sortOffences(LOGIC.filterOffences(DATA.offences, query, cat), sort);
  }

  function render() {
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    var ph = document.getElementById("search");
    if (ph) ph.placeholder = t("searchPlaceholder");
    var toggle = document.getElementById("lang-toggle");
    if (toggle) toggle.textContent = lang === "bn" ? "English" : "\u09ac\u09be\u0982\u09b2\u09be";
    renderChips();
    renderList();
    renderCalc();
  }

  function renderChips() {
    var wrap = document.getElementById("chips");
    if (!wrap) return;
    var h = '<button class="chip' + (cat === "all" ? " active" : "") + '" data-cat="all">' + esc(t("allCategories")) + "</button>";
    DATA.categories.forEach(function (c) {
      h += '<button class="chip' + (cat === c.id ? " active" : "") + '" data-cat="' + c.id + '">'
        + esc(lang === "bn" ? c.bn : c.en) + "</button>";
    });
    wrap.innerHTML = h;
  }

  function offenceCard(o) {
    var selected = (state.selected || []).indexOf(o.id) !== -1;
    var jail = jailText(o.jail);
    var h = '<article class="card offence' + (selected ? " selected" : "") + '">'
      + '<div class="card-top"><span class="cat-badge">' + esc(catName(o.cat)) + "</span>"
      + (o.demerit ? '<span class="demerit-badge">' + esc(t("demeritLabel")) + "</span>" : "")
      + "</div>"
      + '<h3 class="offence-title">' + esc(o[lang].title) + "</h3>"
      + '<p class="offence-desc">' + esc(o[lang].desc) + "</p>"
      + '<div class="fine-row"><span class="fine-label">' + esc(t("maxFineLabel")) + '</span>'
      + '<span class="fine-amount">' + esc(t("taka")) + " " + fmtNum(o.fine) + "</span></div>"
      + '<div class="jail-row"><span class="fine-label">' + esc(t("jailLabel")) + "</span>"
      + "<span>" + esc(jail || t("noJail")) + "</span></div>"
      + '<button class="add-btn" data-add="' + o.id + '">' + esc(t(selected ? "addedLabel" : "addLabel")) + "</button>"
      + "</article>";
    return h;
  }

  function renderList() {
    var list = visibleOffences();
    var box = document.getElementById("offence-list");
    var stats = document.getElementById("stats");
    if (stats) stats.textContent = fmt("showing", { shown: loc(list.length), total: loc(DATA.offences.length) });
    if (!box) return;
    if (list.length === 0) {
      box.innerHTML = '<div class="empty"><p>' + esc(t("noResults")) + "</p><p>" + esc(t("noResultsHint")) + "</p></div>";
      return;
    }
    box.innerHTML = list.map(offenceCard).join("");
  }

  function renderCalc() {
    var box = document.getElementById("calc-body");
    if (!box) return;
    var ids = state.selected || [];
    if (ids.length === 0) {
      box.innerHTML = '<p class="calc-empty">' + esc(t("calcEmpty")) + "</p>";
      return;
    }
    var r = LOGIC.calcTotal(DATA.offences, ids);
    var jail = jailText(r.maxJail);
    var h = '<p class="calc-count">' + esc(fmt("calcSelected", { count: loc(r.count) })) + "</p>"
      + '<div class="calc-total"><span>' + esc(t("calcTotal")) + '</span><strong>' + esc(t("taka")) + " " + fmtNum(r.totalFine) + "</strong></div>";
    if (jail) {
      h += '<p class="calc-line"><span>' + esc(t("calcJail")) + ":</span> <strong>" + esc(jail) + "</strong></p>"
        + '<p class="calc-note">' + esc(t("calcJailNote")) + "</p>";
    }
    if (r.demeritCount > 0) {
      h += '<p class="calc-line">' + esc(fmt("calcDemerit", { count: loc(r.demeritCount) })) + "</p>";
    }
    h += '<button id="calc-clear" class="clear-btn" type="button">' + esc(t("clearSelection")) + "</button>";
    box.innerHTML = h;
    var clear = document.getElementById("calc-clear");
    if (clear) clear.addEventListener("click", function () {
      state.selected = [];
      saveState();
      render();
    });
  }

  function toggleSelect(id) {
    state.selected = state.selected || [];
    var i = state.selected.indexOf(id);
    if (i === -1) state.selected.push(id);
    else state.selected.splice(i, 1);
    saveState();
    render();
  }

  document.addEventListener("click", function (e) {
    var chip = e.target.closest ? e.target.closest("[data-cat]") : null;
    if (chip) { cat = chip.getAttribute("data-cat"); render(); return; }
    var add = e.target.closest ? e.target.closest("[data-add]") : null;
    if (add) { toggleSelect(add.getAttribute("data-add")); return; }
    if (e.target && e.target.id === "lang-toggle") {
      lang = lang === "bn" ? "en" : "bn";
      state.lang = lang;
      saveState();
      render();
    }
  });

  document.addEventListener("input", function (e) {
    if (e.target && e.target.id === "search") {
      query = e.target.value;
      renderList();
    }
  });
  document.addEventListener("change", function (e) {
    if (e.target && e.target.id === "sort") {
      sort = e.target.value;
      renderList();
    }
  });

  render();
})();
