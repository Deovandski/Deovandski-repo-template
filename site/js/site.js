// Starter script: the Settings menu (language and text size) and a small example of translated script text.
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var root = document.documentElement;
  var KEY = "REPO-NAME-site"; // the same key as the inline script in <head>

  // Text the script writes comes from #ui-strings in the page, so it is translated with the page.
  function t(k) { var e = document.querySelector('#ui-strings [data-k="' + k + '"]'); return e ? e.textContent.trim() : k; }

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } }
  function save(patch) {
    var s = load();
    for (var k in patch) s[k] = patch[k];
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private mode: lasts for this page only */ }
  }

  // ---------- Settings (gear, top right) ----------
  // English is at ./, every other language at ./<code>/; data-root is "./" on English pages and "../" on translated ones.
  function langHref(code) { return (root.dataset.root || "./") + (code === "en" ? "" : code + "/") + location.hash; }
  function goLang(code) { save({ lang: code }); location.href = langHref(code); }

  var sd = $("site-settings");
  $("gear").addEventListener("click", function () {
    if (typeof sd.showModal === "function") sd.showModal(); else sd.setAttribute("open", "");
  });
  // the banner's "English" link (and any element with data-lang-switch) remembers the choice too
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-lang-switch]");
    if (a) { e.preventDefault(); goLang(a.dataset.langSwitch); }
  });
  var langSel = sd.querySelector('[data-setting="lang"]'), sizeIn = sd.querySelector('[data-setting="size"]');
  langSel.value = root.dataset.lang || "en";
  langSel.addEventListener("change", function () { goLang(langSel.value); });
  sizeIn.value = load().size || 17;
  sizeIn.addEventListener("input", function () {
    root.style.setProperty("--scale", sizeIn.value / 17);
    save({ size: +sizeIn.value });
  });

  // ---------- Example: script text from #ui-strings (delete with the demo button) ----------
  var demo = $("demo");
  if (demo) demo.addEventListener("click", function () { $("demo-out").textContent = t("demo-done"); });
})();
