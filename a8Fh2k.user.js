// ==UserScript==
// @name         Made By Lukas
// @namespace    core.lukas
// @version      1.5
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
  const START_FLAG = "__x9fK2p_core_loaded__";

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
      onerror: e => cb(e, null)
    });
  }

  function waitForBody(cb){
    if (document.body) return cb();
    const mo = new MutationObserver(() => {
      if (document.body) {
        mo.disconnect();
        cb();
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  function startMain(code) {
    if (!code || window[START_FLAG]) return;
    window[START_FLAG] = true;

    waitForBody(() => {
      try {
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

  /* ================= UI ================= */
  function showUI(cfg) {
    waitForBody(() => {
      if (document.getElementById("lukas-updater-overlay")) return;

      const CURRENT = CURRENT_VERSION;
      const LATEST = cfg.version || "?";
      const DISCORD_ID = cfg.discord || "";

      const style = document.createElement("style");
      style.textContent = `
      #lukas-updater-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.6);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
      }

      #lukas-updater {
          width: 420px;
          background: linear-gradient(180deg,#0b0b10,#06060a);
          border-radius: 16px;
          box-shadow: 0 0 40px rgba(255,60,60,.45);
          border: 1px solid rgba(255,70,70,.35);
          padding: 22px;
          color: white;
          font-family: Inter, system-ui, sans-serif;
      }

      .lukas-header {
          position: relative;
          text-align: center;
          font-size: 12px;
          letter-spacing: 2px;
          opacity: .85;
          margin-bottom: 6px;
      }

      .lukas-close {
          position: absolute;
          right: 0;
          top: -2px;
          cursor: pointer;
          font-size: 18px;
      }

      #lukas-updater h1 {
          margin: 18px 0;
          text-align: center;
          font-size: 20px;
      }

      .lukas-versions {
          display: flex;
          gap: 14px;
          margin-bottom: 16px;
      }

      .version-box {
          flex: 1;
          background: rgba(255,255,255,.04);
          border-radius: 12px;
          padding: 14px;
          text-align: center;
      }

      .version-box strong {
          font-size: 22px;
      }

      .version-box.latest {
          border: 1px solid rgba(255,70,70,.6);
          box-shadow: 0 0 16px rgba(255,70,70,.35);
      }

      .lukas-buttons {
          display: flex;
          gap: 12px;
      }

      .lukas-btn {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
      }

      .discord { background:#5865F2;color:white; }
      .update { background:#ff3c3c;color:white; }
      `;
      document.head.appendChild(style);

      const overlay = document.createElement("div");
      overlay.id = "lukas-updater-overlay";
      overlay.innerHTML = `
        <div id="lukas-updater">
          <div class="lukas-header">
            MADE BY LUKAS
            <span class="lukas-close">✕</span>
          </div>

          <h1>NEW VERSION AVAILABLE</h1>

          <div class="lukas-versions">
            <div class="version-box">
              <span>Current</span>
              <strong>${CURRENT}</strong>
            </div>
            <div class="version-box latest">
              <span>Latest</span>
              <strong>${LATEST}</strong>
            </div>
          </div>

          <div class="lukas-buttons">
            <button class="lukas-btn discord">Discord</button>
            <button class="lukas-btn update">Update</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      overlay.querySelector(".lukas-close").onclick = () => overlay.remove();

      overlay.querySelector(".discord").onclick = () => {
        location.href = `discord://-/users/${DISCORD_ID}`;
        setTimeout(() => window.open(`https://discord.com/users/${DISCORD_ID}`), 800);
      };

      overlay.querySelector(".update").onclick = () => {
        if (cfg.install) GM_openInTab(cfg.install, { active: true });
      };
    });
  }

  /* ================= RUN ONCE ================= */
  if (window.__lukas_update_checked__) return;
  window.__lukas_update_checked__ = true;

  get(UPDATE_JSON, (err, txt) => {
    if (err) return;

    let cfg;
    try { cfg = JSON.parse(txt); }
    catch { return; }

    if (!cfg.script) return;

    if (cfg.version && isNewer(cfg.version, CURRENT_VERSION)) {
      showUI(cfg);
    }

    get(cfg.script, (e2, code) => {
      if (!e2) startMain(code);
    });
  });

})();
