// ==UserScript==
// @name         Made By Lukas
// @namespace    core.lukas
// @version      3.0
// @updateURL    https://raw.githubusercontent.com/SomeoneThatYouKnow69/x9fK2p-core/main/a8Fh2k.user.js
// @downloadURL  https://raw.githubusercontent.com/SomeoneThatYouKnow69/x9fK2p-core/main/a8Fh2k.user.js
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
// ==/UserScript==

(() => {
"use strict";

const UPDATE_JSON = "https://raw.githubusercontent.com/SomeoneThatYouKnow69/x9fK2p-core/main/cfg92.json";
const CURRENT_VERSION = GM_info?.script?.version || "0.0.0";
const START_FLAG = "__CORE_STARTED__";


function parse(v){
    return String(v).split(".").map(n => parseInt(n,10)||0);
}

function isNewer(a,b){
    a=parse(a);
    b=parse(b);

    for(let i=0;i<Math.max(a.length,b.length);i++){
        if((a[i]||0)>(b[i]||0)) return true;
        if((a[i]||0)<(b[i]||0)) return false;
    }

    return false;
}


function get(url,cb){
    GM_xmlhttpRequest({
        method:"GET",
        url:url+"?t="+Date.now(),

        onload:r=>{
            if(r.status===200)
                cb(null,r.responseText);
            else
                cb(true);
        },

        onerror:()=>{
            cb(true);
        }
    });
}


function waitForBody(cb){
    if(document.body)
        return cb();

    const obs=new MutationObserver(()=>{
        if(document.body){
            obs.disconnect();
            cb();
        }
    });

    obs.observe(document.documentElement,{
        childList:true,
        subtree:true
    });
}



function startMain(code){

    if(!code || window[START_FLAG])
        return;

    window[START_FLAG]=true;


    waitForBody(()=>{

        try{

            unsafeWindow.GM_xmlhttpRequest=GM_xmlhttpRequest;
            unsafeWindow.GM_openInTab=GM_openInTab;
            unsafeWindow.GM_getValue=GM_getValue;
            unsafeWindow.GM_setValue=GM_setValue;
            unsafeWindow.GM_deleteValue=GM_deleteValue;


            const s=document.createElement("script");

            s.textContent=code;

            document.documentElement.appendChild(s);

            s.remove();


        }catch(e){

            console.error("[Core] Inject error:",e);

        }

    });
}




function showMenu(cfg){

    waitForBody(()=>{

        if(document.getElementById("lukas-updater-overlay"))
            return;


        const overlay=document.createElement("div");

        overlay.id="lukas-updater-overlay";


        overlay.innerHTML=`

<style>

#lukas-updater-overlay{

position:fixed;
inset:0;

background:rgba(0,0,0,.6);
backdrop-filter:blur(6px);

display:flex;
align-items:center;
justify-content:center;

z-index:999999;

}


#lukas-updater{

width:420px;

background:#08080d;

border-radius:16px;

padding:22px;

color:white;

font-family:Inter,system-ui;

box-shadow:0 0 40px rgba(255,60,60,.45);

border:1px solid rgba(255,70,70,.35);

}



.lukas-header{

text-align:center;

font-size:12px;

letter-spacing:2px;

}


.lukas-close{

float:right;

cursor:pointer;

font-size:18px;

}


#lukas-updater h1{

text-align:center;

font-size:20px;

margin:20px;

}


.lukas-versions{

display:flex;

gap:14px;

}


.version-box{

flex:1;

background:rgba(255,255,255,.05);

padding:14px;

border-radius:12px;

text-align:center;

}


.version-box strong{

display:block;

font-size:24px;

}



.version-box.latest{

border:1px solid red;

}



.lukas-changelog{

margin-top:20px;
background:rgba(255,255,255,.05);
padding:12px;
border-radius:12px;

}


.lukas-changelog h3{

text-align:center;
margin:0 0 10px;
font-size:14px;

}


.lukas-changelog ul{

margin:0;
padding-left:20px;
font-size:13px;
opacity:.85;

}


.lukas-changelog li{

margin-bottom:5px;

}


.lukas-buttons{

display:flex;

gap:12px;

margin-top:20px;

}


.lukas-btn{

flex:1;

padding:12px;

border-radius:12px;

border:none;

cursor:pointer;

font-weight:bold;

}



.update{

background:red;

color:white;

}


</style>


<div id="lukas-updater">


<div class="lukas-header">

MADE BY LUKAS

<span class="lukas-close">✕</span>

</div>


<h1>NEW VERSION AVAILABLE</h1>


<div class="lukas-versions">

<div class="version-box">

<span>Current</span>

<strong>${CURRENT_VERSION}</strong>

</div>


<div class="version-box latest">

<span>Latest</span>

<strong>${cfg.version}</strong>

</div>


</div>



<div class="lukas-changelog">

<h3>CHANGELOG</h3>

<ul>
${(cfg.changelog || ["No changes listed"]).map(x=>`<li>${x}</li>`).join("")}
</ul>

</div>


<div class="lukas-buttons">

<button class="lukas-btn discord">
Discord
</button>


<button class="lukas-btn update">
Update
</button>


</div>


</div>

`;

        document.body.appendChild(overlay);



        overlay.querySelector(".lukas-close").onclick=()=>overlay.remove();



overlay.querySelector(".discord").onclick=()=>{

    const id = cfg.discord;

    // Try Discord client
    window.location.href = `discord://-/users/${id}`;

    // Fallback to browser after delay
    setTimeout(()=>{
        window.open(
            `https://discord.com/users/${id}`,
            "_blank"
        );
    },1500);

};



        overlay.querySelector(".update").onclick=()=>{

            if(cfg.install){

                GM_openInTab(
                    cfg.install,
                    {
                        active:true
                    }
                );

            }

        };


    });

}




get(UPDATE_JSON,(err,txt)=>{


    if(err){

        console.error("[Core] Update check failed");

        return;

    }


    let cfg;


    try{

        cfg=JSON.parse(txt);

    }

    catch(e){

        console.error("[Core] Bad JSON",e);

        return;

    }



    if(
        cfg.version &&
        isNewer(cfg.version,CURRENT_VERSION)
    ){

        showMenu(cfg);

    }



    if(cfg.script){

        get(cfg.script,(e2,code)=>{

            if(!e2)
                startMain(code);

        });

    }



});


})();
