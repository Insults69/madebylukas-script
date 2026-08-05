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
// ==/UserScript==

(() => {
"use strict";

const UPDATE_JSON = "https://raw.githubusercontent.com/SomeoneThatYouKnow69/x9fK2p-core/main/cfg92.json";
const CURRENT_VERSION = GM_info?.script?.version || "0.0.0";
const START_FLAG = "__CORE_STARTED__";

/* ========= UTILS ========= */
function parse(v){ return String(v).split(".").map(n => parseInt(n,10)||0); }
function isNewer(a,b){
  a=parse(a); b=parse(b);
  for(let i=0;i<Math.max(a.length,b.length);i++){
    if((a[i]||0)>(b[i]||0)) return true;
    if((a[i]||0)<(b[i]||0)) return false;
  }
  return false;
}

function get(url, cb){
  GM_xmlhttpRequest({
    method: "GET",
    url: url + "?t=" + Date.now(),
    onload: r => cb(null, r.responseText),
    onerror: () => cb(true)
  });
}

function waitForBody(cb){
  if (document.body) return cb();
  new MutationObserver(()=>{
    if(document.body) cb();
  }).observe(document.documentElement,{childList:true,subtree:true});
}

/* ========= MAIN INJECT ========= */
function startMain(code){
  if(!code || window[START_FLAG]) return;
  window[START_FLAG] = true;

  waitForBody(()=>{
    try{
      unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
      unsafeWindow.GM_openInTab = GM_openInTab;
      unsafeWindow.GM_getValue = GM_getValue;
      unsafeWindow.GM_setValue = GM_setValue;
      unsafeWindow.GM_deleteValue = GM_deleteValue;

      const s = document.createElement("script");
      s.textContent = code;
      document.documentElement.appendChild(s);
      s.remove();
    }catch(e){
      console.error("[Core] main error", e);
    }
  });
}

/* ========= UI ========= */
function showMenu(cfg){
  waitForBody(()=>{
    if(document.getElementById("lukas-updater-overlay")) return;

    const CURRENT = CURRENT_VERSION;
    const LATEST = cfg.version || "?";

    const style = document.createElement("style");
    style.textContent = `
#lukas-updater-overlay{
 position:fixed;inset:0;
 background:rgba(0,0,0,.6);
 backdrop-filter:blur(6px);
 display:flex;align-items:center;justify-content:center;
 z-index:999999;
}
#lukas-updater{
 width:420px;
 background:linear-gradient(180deg,#0b0b10,#06060a);
 border-radius:16px;
 box-shadow:0 0 40px rgba(255,60,60,.45);
 border:1px solid rgba(255,70,70,.35);
 padding:22px;
 color:#fff;
 font-family:Inter,system-ui;
}
.lukas-header{
 text-align:center;
 font-size:12px;
 letter-spacing:2px;
 opacity:.85;
 position:relative;
}
.lukas-close{
 position:absolute;right:0;top:-2px;
 cursor:pointer;font-size:18px;
}
#lukas-updater h1{
 text-align:center;
 margin:18px 0;
 font-size:20px;
}
.lukas-versions{
 display:flex;gap:14px;
 margin-bottom:16px;
}
.version-box{
 flex:1;
 background:rgba(255,255,255,.04);
 border-radius:12px;
 padding:14px;
 text-align:center;
}
.version-box span{
 font-size:12px;
 opacity:.7;
}
.version-box strong{
 font-size:24px;
 display:block;
 margin-top:2px;
 line-height:1;
}
.version-box.latest{
 border:1px solid rgba(255,70,70,.6);
 box-shadow:0 0 16px rgba(255,70,70,.35);
}
.lukas-buttons{
 display:flex;gap:12px;
}
.lukas-btn{
 flex:1;
 padding:12px;
 border-radius:12px;
 border:none;
 cursor:pointer;
 font-weight:600;
}
.lukas-btn.discord{background:#5865F2;color:#fff;}
.lukas-btn.update{
 background:linear-gradient(135deg,#ff3c3c,#ff1f1f);
 color:#fff;
}
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
      const app = `discord://-/users/${cfg.discord}`;
      const web = `https://discord.com/users/${cfg.discord}`;
      window.location.href = app;
      setTimeout(()=>window.open(web,"_blank"),1200);
    };

    // ✅
    overlay.querySelector(".update").onclick = () => {
      if(!cfg.install) return;
      GM_openInTab(cfg.install, {active:true});
      overlay.remove();
    };
  });
}

/* ========= START ========= */
get(UPDATE_JSON,(err,txt)=>{
  if(err) return;

  let cfg;
  try{ cfg = JSON.parse(txt); }
  catch{ return; }

  if(cfg.version && isNewer(cfg.version, CURRENT_VERSION)){
    showMenu(cfg);
  }

  get(cfg.script,(e2,code)=>{
    if(!e2) startMain(code);
  });
});

})();
