// ==UserScript==
// @name         Made By Lukas
// @namespace    core.lukas
// @version      2.0
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

/* ================= HELPERS ================= */

function get(url, cb){
    GM_xmlhttpRequest({
        method:"GET",
        url:url + "?t=" + Date.now(),
        onload:r=>cb(null,r.responseText),
        onerror:e=>cb(e,null)
    });
}

function waitForBody(cb){
    if(document.body) return cb();
    new MutationObserver(()=>{
        if(document.body) cb();
    }).observe(document.documentElement,{childList:true,subtree:true});
}

function startMain(code){
    if(!code || window[START_FLAG]) return;
    window[START_FLAG]=true;

    waitForBody(()=>{
        try{
            unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
            unsafeWindow.GM_openInTab = GM_openInTab;
            unsafeWindow.GM_getValue = GM_getValue;
            unsafeWindow.GM_setValue = GM_setValue;
            unsafeWindow.GM_deleteValue = GM_deleteValue;

            const s=document.createElement("script");
            s.textContent=code;
            document.documentElement.appendChild(s);
            s.remove();

        }catch(e){
            console.error("[Core] main error",e);
        }
    });
}

/* ================= UI ================= */

function showUI(cfg){

waitForBody(()=>{

if(document.getElementById("lukas-updater-overlay")) return;

const CURRENT = CURRENT_VERSION;
const LATEST = cfg.version || "?.?";
const CHANGELOG = Array.isArray(cfg.changelog) ? cfg.changelog : [];

const style=document.createElement("style");
style.textContent=`
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
    color:white;
    font-family:Inter,system-ui,sans-serif;
}

.lukas-header{
    position:relative;
    text-align:center;
    font-size:12px;
    letter-spacing:2px;
    opacity:.85;
    margin-bottom:6px;
}

.lukas-close{
    position:absolute;
    right:0;
    top:-2px;
    cursor:pointer;
    font-size:18px;
    opacity:.7;
}
.lukas-close:hover{opacity:1}

#lukas-updater h1{
    margin:18px 0;
    text-align:center;
    font-size:20px;
    font-weight:700;
}

.lukas-versions{
    display:flex;
    gap:14px;
    margin-bottom:16px;
}

.version-box{
    flex:1;
    background:rgba(255,255,255,.04);
    border-radius:12px;
    padding:12px 14px 10px;
    text-align:center;
}

.version-box span{
    display:block;
    font-size:11px;
    opacity:.7;
    margin-bottom:2px;
    letter-spacing:.5px;
}

.version-box strong{
    display:block;
    font-size:28px;
    font-weight:700;
    line-height:1;
    margin-top:-3px;
}

.latest{
    border:1px solid rgba(255,70,70,.6);
    box-shadow:0 0 16px rgba(255,70,70,.35);
}

.lukas-changelog-box{
    background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
    border-radius:12px;
    padding:12px 14px;
    font-size:13px;
    line-height:1.6;
    margin-bottom:18px;
}

.lukas-buttons{
    display:flex;
    gap:12px;
}

.lukas-btn{
    flex:1;
    padding:12px;
    border-radius:12px;
    border:none;
    cursor:pointer;
    font-weight:600;
    transition:.2s;
}

.lukas-btn.discord{
    background:#5865F2;
    color:white;
}

.lukas-btn.update{
    background:linear-gradient(135deg,#ff3c3c,#ff1f1f);
    color:white;
    box-shadow:0 0 18px rgba(255,60,60,.5);
}

.lukas-btn:hover{
    transform:translateY(-1px);
    filter:brightness(1.1);
}
`;
document.head.appendChild(style);

const overlay=document.createElement("div");
overlay.id="lukas-updater-overlay";

overlay.innerHTML=`
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

    <div class="lukas-changelog-box">
        ${CHANGELOG.map(c=>`• ${c}`).join("<br>")}
    </div>

    <div class="lukas-buttons">
        <button class="lukas-btn discord">Discord</button>
        <button class="lukas-btn update">Update</button>
    </div>
</div>
`;

document.body.appendChild(overlay);

/* events */
overlay.querySelector(".lukas-close").onclick=()=>overlay.remove();

overlay.querySelector(".discord").onclick=()=>{
    const id=cfg.discord||"";
    window.location.href=`discord://-/users/${id}`;
    setTimeout(()=>window.open(`https://discord.com/users/${id}`,"_blank"),1200);
};

overlay.querySelector(".update").onclick=()=>{
    if(cfg.install) GM_openInTab(cfg.install,{active:true});
    overlay.remove();
};

});
}

/* ================= START ================= */

get(UPDATE_JSON,(err,txt)=>{
if(err) return;

let cfg;
try{ cfg=JSON.parse(txt); }catch{ return; }

/* 🔥 FIXED LOGIC */
if (cfg.version && cfg.version !== CURRENT_VERSION) {
    showUI(cfg);
}

/* load main */
if(cfg.script){
    get(cfg.script,(e2,code)=>{
        if(!e2) startMain(code);
    });
}

});

})();
