// ==UserScript==
// @name         Made By Lukas
// @namespace    https://github.com/Insults69
// @version      2.8
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
// @downloadURL  https://raw.githubusercontent.com/Insults69/madebylukas-script/main/MadeByLukas.user.js
// @updateURL    https://raw.githubusercontent.com/Insults69/madebylukas-script/main/MadeByLukas.user.js
// ==/UserScript==

(() => {
  "use strict";

  const UPDATE_JSON = "https://raw.githubusercontent.com/Insults69/madebylukas-script/main/update.json";
  const CURRENT_VERSION = GM_info?.script?.version || "0.0.0";
  const START_FLAG = "__MADE_BY_LUKAS_MAIN_STARTED__";

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
      url: url + (url.includes("?") ? "&" : "?") + "t=" + Date.now(),
      onload: r => cb(null, r.responseText),
      onerror: e => cb(e, null),
      ontimeout: e => cb(e, null)
    });
  }

  function waitForBody(cb){
    if (document.body) return cb();
    const mo = new MutationObserver(() => {
      if (document.body) { mo.disconnect(); cb(); }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  // 🔥
  function startMain(code) {
    if (!code) return;
    if (window[START_FLAG]) return;

    window[START_FLAG] = true;

    waitForBody(() => {
      try {
        console.log("[MadeByLukas] Injecting main safely");

        // ✅
        unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
        unsafeWindow.GM_openInTab = GM_openInTab;
        unsafeWindow.GM_getValue = GM_getValue;
        unsafeWindow.GM_setValue = GM_setValue;
        unsafeWindow.GM_deleteValue = GM_deleteValue;

        // inject
        const script = document.createElement("script");
        script.textContent = code;

        document.documentElement.appendChild(script);
        script.remove();

        console.log("[MadeByLukas] Main injected OK");

      } catch (e) {
        console.error("[MadeByLukas] Main error:", e);
      }
    });
  }

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
      .lukas-version-row{display:flex;gap:14px;margin-bottom:20px}
      .version-box{flex:1;background:rgba(255,255,255,.06);border-radius:12px;padding:14px;text-align:center}
      .version-box span{display:block;font-size:12px;opacity:.7;margin-bottom:6px}
      .version-box b{display:block;font-size:20px;font-weight:900}
      .highlight{outline:1px solid rgba(255,60,60,.8);box-shadow:0 0 20px rgba(255,60,60,.35)}
      .lukas-updates-box{background:rgba(255,255,255,.05);border-radius:14px;padding:14px;margin-bottom:22px}
      .updates-title{font-weight:900;margin-bottom:10px}
      .update-line{font-size:13px;opacity:.85;margin:6px 0}
      .lukas-actions{display:flex;gap:14px}
      .lukas-actions button{flex:1;padding:14px;border-radius:12px;border:none;font-weight:900;cursor:pointer}
      .discord{background:#5865F2;color:white}
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
    if (err) return console.error("[MadeByLukas] update.json failed", err);

    let cfg;
    try { cfg = JSON.parse(txt); }
    catch (e) { return console.error("[MadeByLukas] bad update.json", e); }

    if (!cfg.script) return;

    if (cfg.version && isNewer(cfg.version, CURRENT_VERSION)) {
      showMenu(cfg);
    }

    const mainUrl = cfg.script + "?t=" + Date.now();

    get(mainUrl, (e2, code) => {
      if (e2) return console.error("[MadeByLukas] main fetch failed", e2);
      startMain(code);
    });
  });
})();
