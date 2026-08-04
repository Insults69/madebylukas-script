// ==UserScript==
// @name         Made By Lukas
// @namespace    core.lukas
// @version      1.3
// @match        https://*.tankionline.com/play/*
// @match        https://*.tankionline.com/browser-public/*
// @run-at       document-start
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @connect      raw.githubusercontent.com
// @connect      api.capmonster.cloud
// @downloadURL  https://raw.githubusercontent.com/SomeoneThatYouKnow69/x9fK2p-core/main/a8Fh2k.user.js
// @updateURL    https://raw.githubusercontent.com/SomeoneThatYouKnow69/x9fK2p-core/main/a8Fh2k.user.js
// ==/UserScript==

(() => {
  "use strict";

  const UPDATE_JSON = "https://raw.githubusercontent.com/SomeoneThatYouKnow69/x9fK2p-core/main/cfg92.json";
  const CURRENT_VERSION = GM_info?.script?.version || "0.0.0";
  const START_FLAG = "__CORE_STARTED__";

  function parse(v){ return String(v).split(".").map(n => parseInt(n,10)||0); }

  function isNewer(a,b){
    a=parse(a); b=parse(b);
    for(let i=0;i<Math.max(a.length,b.length);i++){
      if((a[i]||0)>(b[i]||0)) return true;
      if((a[i]||0)<(b[i]||0)) return false;
    }
    return false;
  }

  function get(url, cb) {
    GM_xmlhttpRequest({
      method: "GET",
      url: url + "?t=" + Date.now(),
      onload: r => cb(null, r.responseText),
      onerror: e => cb(e, null)
    });
  }

  function waitForBody(cb){
    if (document.body) return cb();
    new MutationObserver(() => {
      if (document.body) cb();
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  function startMain(code) {
    if (!code || window[START_FLAG]) return;
    window[START_FLAG] = true;

    waitForBody(() => {
      try {
        console.log("[Core] Injecting main");

        unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
        unsafeWindow.GM_openInTab = GM_openInTab;
        unsafeWindow.GM_getValue = GM_getValue;
        unsafeWindow.GM_setValue = GM_setValue;
        unsafeWindow.GM_deleteValue = GM_deleteValue;

        const script = document.createElement("script");
        script.textContent = code;
        document.documentElement.appendChild(script);
        script.remove();

      } catch (e) {
        console.error("[Core] Main error:", e);
      }
    });
  }

  // 🔥 YOUR UI (UNCHANGED)
  function injectStyles() {
    if (document.getElementById("lukas-style")) return;

    const s = document.createElement("style");
    s.id = "lukas-style";
    s.textContent = `
      #lukas-glow-overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:2147483647;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif}
      .lukas-glow-wrapper{padding:3px;border-radius:18px;background:linear-gradient(180deg,rgba(255,60,60,.9),rgba(255,60,60,.25),rgba(255,60,60,.9));box-shadow:0 0 45px rgba(255,60,60,.75),0 0 90px rgba(255,60,60,.4)}
      .lukas-menu{width:440px;background:#0f0f14;border-radius:16px;color:white;position:relative;overflow:hidden}
      .lukas-top{text-align:center;padding:14px;font-size:12px;letter-spacing:3px;opacity:.75}
      .lukas-body{padding:22px}
      .lukas-title-center{text-align:center;font-size:22px;font-weight:900;margin-bottom:20px}
      .lukas-actions{display:flex;gap:14px}
      .lukas-actions button{flex:1;padding:14px;border-radius:12px;border:none;font-weight:900;cursor:pointer}
      .update{background:#ff3b3b;color:white}
      .lukas-close{position:absolute;top:10px;right:10px;background:none;border:none;color:white;font-size:18px;opacity:.6;cursor:pointer}
    `;
    document.documentElement.appendChild(s);
  }

  function showMenu(cfg) {
    waitForBody(() => {
      if (document.getElementById("lukas-glow-overlay")) return;

      injectStyles();

      const o = document.createElement("div");
      o.id = "lukas-glow-overlay";
      o.innerHTML = `
        <div class="lukas-glow-wrapper">
          <div class="lukas-menu">
            <div class="lukas-top">MADE BY LUKAS</div>
            <div class="lukas-body">
              <div class="lukas-title-center">NEW VERSION AVAILABLE</div>
              <div class="lukas-actions">
                <button class="update">Update</button>
              </div>
            </div>
            <button class="lukas-close">✕</button>
          </div>
        </div>
      `;

      document.body.appendChild(o);

      o.querySelector(".lukas-close").onclick = () => o.remove();

      o.querySelector(".update").onclick = () => {
        if (!cfg.install) return;
        GM_openInTab(cfg.install, { active: true });
        o.remove();
      };
    });
  }

  get(UPDATE_JSON, (err, txt) => {
    if (err) return console.error("[Core] update.json failed");

    let cfg;
    try { cfg = JSON.parse(txt); }
    catch (e) { return console.error("[Core] bad json"); }

    if (!cfg.script) return;

    if (cfg.version && isNewer(cfg.version, CURRENT_VERSION)) {
      showMenu(cfg);
    }

    get(cfg.script, (e2, code) => {
      if (!e2) startMain(code);
    });
  });
})();
