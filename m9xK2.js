// ==UserScript==
// @name         Made By Lukas
// @namespace    https://tankionline.com/
// @version      1.0
// @description  Made By Lukas Custom Script
// @author       Lukas
// @match        https://*.tankionline.com/play/*
// @match        https://*.tankionline.com/browser-public/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      api.capmonster.cloud
// @run-at       document-start
// ==/UserScript==

/* ===================== LUKIOS CORE ====================== */

(() => {

  "use strict";

  const ROOT_ID = "lukas-ui-root";
  const BG_LAYER_ID = "lukas-bg-layer-root";
  const BG_STYLE_ID = "lukas-bg-style";
  const BG_CUSTOM_STYLE_ID = "lukas-bg-custom-style";
  const BG_STORAGE_MODE = "tanki_bg_original_lite_mode";
  const BG_STORAGE_CUSTOM = "tanki_bg_original_lite_custom";
  const BG_MODES = ["Dark", "Holography", "Space", "Custom"];
  const STORE_KEY = "lukas_ui_state_v6";
  if (document.getElementById(ROOT_ID)) return;

  function create(tag, opts = {}) {
    const node = document.createElement(tag);
    if (opts.id) node.id = opts.id;
    if (opts.className) node.className = opts.className;
    if (opts.type) node.type = opts.type;
    if (opts.text != null) node.textContent = opts.text;
    if (opts.html != null) node.innerHTML = opts.html;
    if (opts.style) node.setAttribute("style", opts.style);
    if (opts.attrs) for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, v);
    if (opts.dataset) for (const [k, v] of Object.entries(opts.dataset)) node.dataset[k] = v;
    if (opts.children) for (const c of opts.children) node.appendChild(c);
    return node;
  }

  const TABS = [
    { id: "clicker", name: "Clicker" },
    { id: "hotkeys", name: "Hotkeys" },
    { id: "list", name: "List" },
    { id: "appearance", name: "Appearance" },
    { id: "background", name: "Background" },
    { id: "others", name: "Others" },
    { id: "panel", name: "Panel Settings" },
    { id: "joiner", name: "Joiner" }
  ];

  const SUPPLY_ICONS = [
    {
      type: "repair",
      cn: "data:image/svg+xml,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M26.6398%2011.8526C26.6398%2011.8526%2025.6834%2015.0342%2024.4486%2016.2722C23.6437%2017.0766%2022.6235%2017.6312%2021.5108%2017.869C20.398%2018.1069%2019.2402%2018.0179%2018.1769%2017.6128L9.66307%2026.1241C9.41441%2026.3729%209.11922%2026.5703%208.7943%2026.7049C8.46937%2026.8396%208.12111%2026.909%207.7694%2026.909C7.41769%2026.909%207.0694%2026.8398%206.74445%2026.7052C6.41949%2026.5706%206.12423%2026.3733%205.8755%2026.1246C5.62677%2025.8759%205.42946%2025.5806%205.29482%2025.2555C5.16019%2024.9305%205.09086%2024.5822%205.09082%2024.2304C5.09078%2023.8786%205.15999%2023.5302%205.29454%2023.2052C5.4291%2022.8802%205.62632%2022.5848%205.87499%2022.336L14.3889%2013.8228C13.9843%2012.7598%2013.8957%2011.6024%2014.1337%2010.4902C14.3718%209.37799%2014.9263%208.35832%2015.7305%207.55415C17.0164%206.26607%2019.941%205.35366%2019.941%205.35366L21.6029%205.09082L22.3642%205.84909L18.9522%209.2597V10.7758L21.2269%2013.051H22.7403L26.1523%209.63998L26.909%2010.3982L26.6398%2011.8526ZM7.20272%2023.2837C7.05277%2023.4335%206.95059%2023.6244%206.90912%2023.8322C6.86766%2024.0401%206.88875%2024.2556%206.96976%2024.4514C7.05077%2024.6472%207.18807%2024.8146%207.36423%2024.9324C7.54038%2025.0502%207.74752%2025.1131%207.95941%2025.1131C8.1713%2025.1131%208.37838%2025.0502%208.55454%2024.9324C8.73069%2024.8146%208.86799%2024.6472%208.949%2024.4514C9.03001%2024.2556%209.0511%2024.0401%209.00964%2023.8322C8.96817%2023.6244%208.86604%2023.4335%208.7161%2023.2837C8.61714%2023.1836%208.49929%2023.1041%208.3694%2023.0499C8.23951%2022.9956%208.10017%2022.9677%207.95941%2022.9677C7.81865%2022.9677%207.67925%2022.9956%207.54936%2023.0499C7.41947%2023.1041%207.30168%2023.1836%207.20272%2023.2837V23.2837ZM15.1595%2015.3249L8.90639%2021.5782L10.4244%2023.0943L16.6775%2016.841L15.1595%2015.3249Z%22%20fill%3D%22%23BFE704%22%2F%3E%3C%2Fsvg%3E"
    },
    {
      type: "armor",
      cn: "data:image/svg+xml,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M24.1888%2019.6834C21.7959%2024.5218%2016.4429%2027.6365%2016.4429%2027.6365C16.4429%2027.6365%2011.1077%2024.6256%208.83443%2019.7274C6.49029%2014.6744%207.2037%207.72745%207.2037%207.72745C7.2037%207.72745%2010.2302%205.81836%2016.4429%205.81836C22.6245%205.81836%2025.6777%207.72745%2025.6777%207.72745C25.6644%207.72309%2026.0986%2015.8185%2024.1888%2019.6834ZM23.5063%209.36381C23.5063%209.36381%2020.9628%208.00018%2016.4562%208.00018C11.9319%208.00018%209.37946%209.36381%209.37946%209.36381C9.37946%209.36381%209.20219%2015.239%2010.9127%2018.9023C12.57%2022.4543%2016.4562%2024.6365%2016.4562%2024.6365C18.8603%2023.2902%2020.8318%2021.3057%2022.1459%2018.9093C24.0735%2015.4184%2023.4975%209.35901%2023.5063%209.36381ZM11.7635%2017.8782C10.6158%2014.9043%2010.7443%2010.46%2010.7443%2010.46C10.7443%2010.46%2012.8048%209.36469%2016.4562%209.36469C17.6106%209.35959%2018.7622%209.47854%2019.8904%209.71945L11.7635%2017.8782ZM22.1105%2012.1269C22.0351%2014.0224%2021.8047%2017.0298%2021.0913%2018.3939C19.6378%2021.1866%2016.4562%2023.0002%2016.4562%2023.0002C15.3932%2022.3658%2014.4253%2021.5885%2013.5803%2020.6909L22.1105%2012.1269Z%22%20fill%3D%22%23EADC99%22%2F%3E%3C%2Fsvg%3E"
    },
    {
      type: "damage",
      cn: "data:image/svg+xml,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M7.40126%2024.3224L8.78215%208.58015L10.9916%2014.6561L13.4772%2010.2372V14.1037L26.1815%205.81836L17.8961%2018.5226H21.4864L17.0675%2020.7321L23.1435%2023.4938L7.40126%2024.3224ZM9.33451%2022.6653L15.1343%2022.113L12.9248%2021.5606L16.239%2019.3512H14.5819L19.8293%2012.1705L12.3725%2017.1417L12.0963%2015.7608L10.7154%2018.7988L9.61069%2016.8655L9.33451%2022.6653ZM4.36328%2013.5514L6.29654%2015.7608V21.0082L4.36328%2013.5514ZM10.9916%2025.4271L16.239%2025.7033L18.1723%2027.6365L10.9916%2025.4271Z%22%20fill%3D%22%23FF3131%22%2F%3E%3C%2Fsvg%3E"
    },
    {
      type: "speed",
      cn: "data:image/svg+xml,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M5.7334%2011.3635L16.0008%205.09082L26.2682%2011.3635V14.6363L25.4357%2014.909L22.3832%2012.7272V17.909L20.4407%2019.2726L19.8857%2018.9999V11.3635L17.6658%209.72718V26.6363L17.3883%2026.909H14.6133L14.3358%2026.6363V9.72718L12.1158%2011.3635V18.9999L11.2833%2019.2726L9.61835%2017.909V12.7272L6.56589%2014.909L5.7334%2014.6363V11.3635Z%22%20fill%3D%22%23FFFF00%22%2F%3E%3C%2Fsvg%3E"
    }
  ];

  const DEFAULT_HOTKEYS = {
    ui: "Backquote",
    sup: "F2",
    mine: "F4",
    fpsFriend: "",
    fpsEnemy: "",
    fpsBoth: "",
  };

  const DEFAULT_APPEARANCE = {
    brightness: 1.00,
    contrast: 1.00,
    saturation: 1.00,
    vibrance: 0.00,
  };

  const DEFAULTS = {
    uiVisible: false,
    menuOpen: false,
    activeTab: "clicker",
    listActive: "friends",

    transparency: 0.95,
    scale: 1.15,
    tabDarkness: 0.30,

    textColor: "#F2F5FF",
    accentColor: "#7C5CFF",

    hotkeys: { ...DEFAULT_HOTKEYS },

    appearance: { ...DEFAULT_APPEARANCE },

    clicker: {
      mineDelay: 50,
      sup: false,
      rep: false,
      mine: false,
      pick: { repair: true, armor: true, damage: true, speed: true }
    },

    supplies: {
      enabled: false,
      settingsOpen: false,
      drag: false,
      anchor: "right",
      centerBottom: 4.8,
      rightOffset: 4.5,
      rightBottom: 4.5,
      width: 16,
      height: 31,
      blur: 30,
      opacity: 0.32,
      radius: 35,
      border: 0.18
    },

    fps: {
      settingsOpen: false
    }
  };

  function loadState() {
    let parsed = {};
    try {
      const raw = localStorage.getItem(STORE_KEY);
      parsed = raw ? JSON.parse(raw) : {};
    } catch {
      parsed = {};
    }

    const merged = { ...DEFAULTS, ...(parsed && typeof parsed === "object" ? parsed : {}) };

    merged.hotkeys = merged.hotkeys && typeof merged.hotkeys === "object" ? merged.hotkeys : {};
    merged.hotkeys = { ...DEFAULT_HOTKEYS, ...merged.hotkeys };

    merged.appearance = merged.appearance && typeof merged.appearance === "object" ? merged.appearance : {};
    merged.appearance = { ...DEFAULT_APPEARANCE, ...merged.appearance };
    merged.appearance.brightness = clamp(Number.isFinite(+merged.appearance.brightness) ? +merged.appearance.brightness : DEFAULT_APPEARANCE.brightness, 0.50, 2.00);
    merged.appearance.contrast   = clamp(Number.isFinite(+merged.appearance.contrast)   ? +merged.appearance.contrast   : DEFAULT_APPEARANCE.contrast,   0.50, 2.00);
    merged.appearance.saturation = clamp(Number.isFinite(+merged.appearance.saturation) ? +merged.appearance.saturation : DEFAULT_APPEARANCE.saturation, 0.00, 3.00);
    merged.appearance.vibrance   = clamp(Number.isFinite(+merged.appearance.vibrance)   ? +merged.appearance.vibrance   : DEFAULT_APPEARANCE.vibrance,   0.00, 1.00);

    merged.clicker = merged.clicker && typeof merged.clicker === "object" ? merged.clicker : {};
    merged.clicker.mineDelay = Math.max(1, Number.isFinite(+merged.clicker.mineDelay) ? +merged.clicker.mineDelay : DEFAULTS.clicker.mineDelay);
    merged.clicker.sup = !!merged.clicker.sup;
    merged.clicker.rep = !!merged.clicker.rep;
    merged.clicker.mine = !!merged.clicker.mine;

    merged.clicker.pick = merged.clicker.pick && typeof merged.clicker.pick === "object" ? merged.clicker.pick : {};
    merged.clicker.pick = { ...DEFAULTS.clicker.pick, ...merged.clicker.pick };

    merged.supplies = merged.supplies && typeof merged.supplies === "object" ? merged.supplies : {};
    merged.supplies = { ...DEFAULTS.supplies, ...merged.supplies };
    merged.supplies.enabled = !!merged.supplies.enabled;
    merged.supplies.settingsOpen = false;
    merged.supplies.drag = false;
    merged.supplies.anchor = merged.supplies.anchor === "middle" ? "middle" : "right";
    merged.supplies.centerBottom = clamp(Number.isFinite(+merged.supplies.centerBottom) ? +merged.supplies.centerBottom : DEFAULTS.supplies.centerBottom, 0, 15);
    merged.supplies.rightOffset = clamp(Number.isFinite(+merged.supplies.rightOffset) ? +merged.supplies.rightOffset : DEFAULTS.supplies.rightOffset, 0, 25);
    merged.supplies.rightBottom = clamp(Number.isFinite(+merged.supplies.rightBottom) ? +merged.supplies.rightBottom : DEFAULTS.supplies.rightBottom, 0, 15);
    merged.supplies.width = clamp(Number.isFinite(+merged.supplies.width) ? +merged.supplies.width : DEFAULTS.supplies.width, 5, 45);
    merged.supplies.height = clamp(Number.isFinite(+merged.supplies.height) ? +merged.supplies.height : DEFAULTS.supplies.height, 10, 120);
    merged.supplies.blur = clamp(Number.isFinite(+merged.supplies.blur) ? +merged.supplies.blur : DEFAULTS.supplies.blur, 0, 30);
    merged.supplies.opacity = clamp(Number.isFinite(+merged.supplies.opacity) ? +merged.supplies.opacity : DEFAULTS.supplies.opacity, 0, 0.8);
    merged.supplies.radius = clamp(Number.isFinite(+merged.supplies.radius) ? +merged.supplies.radius : DEFAULTS.supplies.radius, 0, 35);
    merged.supplies.border = clamp(Number.isFinite(+merged.supplies.border) ? +merged.supplies.border : DEFAULTS.supplies.border, 0, 1);

    merged.fps = merged.fps && typeof merged.fps === "object" ? merged.fps : {};
    merged.fps = { ...DEFAULTS.fps, ...merged.fps };
    merged.fps.settingsOpen = false;

    merged.uiVisible = false;
    merged.menuOpen = false;
    merged.clicker.sup = false;
    merged.clicker.rep = false;
    merged.clicker.mine = false;

    return merged;
  }

  const state = loadState();

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch {}
  }

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function normalizeHotkeyCode(v) {
    if (!v) return v;
    if (v === "`") return "Backquote";
    return String(v);
  }

  function keyLabel(code) {
    if (!code) return "";
    if (code.startsWith("Key")) return code.slice(3);
    if (code.startsWith("Digit")) return code.slice(5);
    return code;
  }

  function getCanvas() {
    return document.querySelector("canvas") || document.body;
  }

  // ── Appearance filter ──────────────────────────────────────
  let _appearanceStyleEl = null;

  function applyAppearanceFilter() {
    const { brightness, contrast, saturation, vibrance } = state.appearance;
    // vibrance 
    const totalSat = Math.max(0, saturation + vibrance * 0.6);
    const filterVal = `brightness(${brightness}) contrast(${contrast}) saturate(${totalSat})`;

    if (!_appearanceStyleEl) {
      _appearanceStyleEl = document.createElement("style");
      _appearanceStyleEl.id = "lukas-appearance-filter";
      (document.head || document.documentElement).appendChild(_appearanceStyleEl);
    }
    // Apply to canvas
    _appearanceStyleEl.textContent = `
      body > *:not(#${ROOT_ID}) canvas,
      body > canvas {
        filter: ${filterVal} !important;
      }
    `;
  }

  applyAppearanceFilter();

  // Clicker

  const SUPPLIES_DELAY_MS = 100;
  const REPAIR_DELAY_MS   = 100;

  const MAX_SUP_BURST  = 3;
  const MAX_REP_BURST  = 3;
  const MAX_MINE_BURST = 4;

  let _clickerRafId = 0;
  let _clickerRunning = false;

  let _ls = 0;
  let _lr = 0;
  let _lm = 0;

  function fireDigit(d) {
    const code = `Digit${d}`;
    const key = String(d);
    const keyCode = 48 + Number(d);
    const el = getCanvas();
    if (!el) return;
    try {
      el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, code, key, keyCode, which: keyCode }));
      el.dispatchEvent(new KeyboardEvent("keyup",   { bubbles: true, cancelable: true, code, key, keyCode, which: keyCode }));
    } catch {}
  }

  function fireKeyCompat(code) {
    if (!code) return;

    const m = /^Digit(\d)$/.exec(String(code));
    if (m) return fireDigit(m[1]);

    const el = getCanvas();
    if (!el) return;

    let key = "";
    if (code === "Backquote") key = "`";
    else if (code.startsWith("Key") && code.length === 4) key = code.slice(3);
    else key = code;

    try {
      el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, code, key }));
      el.dispatchEvent(new KeyboardEvent("keyup",   { bubbles: true, cancelable: true, code, key }));
    } catch {}
  }

  const _fireKeyForClicker = fireKeyCompat;

  function startClickerLoop() {
    if (_clickerRunning) return;
    _clickerRunning = true;

    const t0 = performance.now();
    _ls = t0; _lr = t0; _lm = t0;

    const loop = () => {
      if (!_clickerRunning) return;
      const t = performance.now();

      if (!state.clicker.sup) {
        _ls = t;
      } else if (t - _ls >= SUPPLIES_DELAY_MS) {
        const due = Math.min(MAX_SUP_BURST, Math.floor((t - _ls) / SUPPLIES_DELAY_MS));
        for (let i = 0; i < due; i++) {
          if (state.clicker.pick.armor)  _fireKeyForClicker("Digit2");
          if (state.clicker.pick.damage) _fireKeyForClicker("Digit3");
          if (state.clicker.pick.speed)  _fireKeyForClicker("Digit4");
          if (state.clicker.pick.repair) _fireKeyForClicker("Digit1");
        }
        _ls += due * SUPPLIES_DELAY_MS;
      }

      if (!state.clicker.rep) {
        _lr = t;
      } else if (t - _lr >= REPAIR_DELAY_MS) {
        const due = Math.min(MAX_REP_BURST, Math.floor((t - _lr) / REPAIR_DELAY_MS));
        for (let i = 0; i < due; i++) _fireKeyForClicker("Digit1");
        _lr += due * REPAIR_DELAY_MS;
      }

      if (!state.clicker.mine) {
        _lm = t;
      } else {
        const d = Math.max(1, state.clicker.mineDelay | 0);
        if (t - _lm >= d) {
          const due = Math.min(MAX_MINE_BURST, Math.floor((t - _lm) / d));
          for (let i = 0; i < due; i++) {
            _fireKeyForClicker("Digit5");
            _fireKeyForClicker("Digit5");
          }
          _lm += due * d;
        }
      }

      _clickerRafId = requestAnimationFrame(loop);
    };

    _clickerRafId = requestAnimationFrame(loop);
  }

  function stopClickerLoops() {
    _clickerRunning = false;
    if (_clickerRafId) { cancelAnimationFrame(_clickerRafId); _clickerRafId = 0; }
  }

  function restartMineLoop() {
    _lm = 0;
  }

  function startSuppliesLoop() { startClickerLoop(); }
  function startMineLoop() { startClickerLoop(); }

  startClickerLoop();

  /* ===================== JOINER CORE ====================== */

  // — State —
  let joinerCaptchaResponse = null;
  let joinerCaptchaTimeoutId = null;
  let joinerActiveObservers = [];
  let joinerCaptchaState = "READY";
  let joinerAlphaState = "READY";
  let joinerBravoState = "READY";
  let joinerCountMode = "backup";

  const joinerOriginalValues = new WeakMap();
  const joinerModifiedObjects = new Set();
  const joinerHookedProperties = new Map();

  const JOINER_CAPMONSTER_API_KEY = "beb1e36194acae7f2ffb72df27ed3346";
  const JOINER_CAPMONSTER_API_URL = "https://api.capmonster.cloud";

  const JOINER_SELECTORS = {
    ALPHA: ".ProBattlesComponentStyle-mainContainer > div.-flexStartAlignCenterColumn > div.-flexStartAlignStretchColumn > div.-flexStartAlignCenter.-buttonContainer > div.-flexCenterAlignCenter > div",
    BRAVO: ".ProBattlesComponentStyle-mainContainer > div.-flexStartAlignCenterColumn > div.-flexStartAlignStretchColumn > div.-flexStartAlignCenter.-buttonContainer > div.-flexCenterAlignCenterColumn > div"
  };

  // — Property hooks —
  function joinerHookMaxPeopleCount(propName) {
    if (!joinerHookedProperties.has(propName)) joinerHookedProperties.set(propName, new Set());
    Object.defineProperty(Object.prototype, propName, {
      get() { return this["__" + propName]; },
      set(value) {
        if (!joinerOriginalValues.has(this)) joinerOriginalValues.set(this, value);
        this["__" + propName] = joinerCountMode === "increase"
          ? joinerOriginalValues.get(this) + 1
          : joinerOriginalValues.get(this);
        joinerModifiedObjects.add(this);
        joinerHookedProperties.get(propName).add(this);
      },
      configurable: true
    });
  }

  function joinerHookValuableBattle(propName) {
    Object.defineProperty(Object.prototype, propName, {
      get() { return true; },
      set(value) {},
      configurable: true
    });
  }

  function joinerRestoreOriginalValues() {
    joinerModifiedObjects.forEach(obj => {
      joinerHookedProperties.forEach((objects, propName) => {
        if (objects.has(obj)) {
          const original = joinerOriginalValues.get(obj);
          if (original !== undefined) obj[propName] = original;
        }
      });
    });
  }

  function joinerFindMainScript() {
    const script = Array.from(document.scripts).find(s => /\/static\/js\/main\..*\.js$/.test(s.src));
    return script ? script.src : null;
  }

  async function joinerFindMaxPeopleProp(scriptUrl) {
    try {
      const response = await fetch(scriptUrl);
      const text = await response.text();
      const match = /maxPeopleCount="\s*\+\s*this\.(\w+)/.exec(text);
      return match && match[1] ? match[1] : null;
    } catch { return null; }
  }

  async function joinerFindValuableBattleProp(scriptUrl) {
    try {
      const response = await fetch(scriptUrl);
      const text = await response.text();
      const match = /valuableBattle="\s*\+\s*this\.(\w+)/.exec(text);
      return match && match[1] ? match[1] : null;
    } catch { return null; }
  }

  // Boot hooks
  (function() {
    const obs = new MutationObserver(async () => {
      const url = joinerFindMainScript();
      if (!url) return;
      obs.disconnect();
      const mp = await joinerFindMaxPeopleProp(url);
      if (mp) joinerHookMaxPeopleCount(mp);
      const vb = await joinerFindValuableBattleProp(url);
      if (vb) joinerHookValuableBattle(vb);
    });
    obs.observe(document.head || document.documentElement, { childList: true, subtree: true });

    const existing = joinerFindMainScript();
    if (existing) {
      joinerFindMaxPeopleProp(existing).then(p => { if (p) joinerHookMaxPeopleCount(p); });
      joinerFindValuableBattleProp(existing).then(p => { if (p) joinerHookValuableBattle(p); });
    }
  })();

  // — Captcha helpers —
  function joinerFindRecaptchaCallback(obj) {
    if (!obj || typeof obj !== "object") return null;
    if (typeof obj.callback === "function") return obj.callback;
    return Object.values(obj).map(joinerFindRecaptchaCallback).find(Boolean) || null;
  }

  function joinerSubmitCaptchaResponse(token) {
    const clients = (typeof ___grecaptcha_cfg !== "undefined") ? ___grecaptcha_cfg?.clients : null;
    if (!clients) return false;
    const keys = Object.keys(clients);
    const lastClient = clients[keys[keys.length - 1]];
    const cb = joinerFindRecaptchaCallback(lastClient);
    if (cb && token) { try { cb(token); return true; } catch {} }
    return false;
  }

  function joinerCreateCaptchaTask() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: JOINER_CAPMONSTER_API_URL + "/createTask",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({
          clientKey: JOINER_CAPMONSTER_API_KEY,
          task: {
            type: "RecaptchaV2TaskProxyless",
            websiteURL: window.location.href,
            websiteKey: "6LfNI_srAAAAACptxRSLfhdOMuyZuYJq1d5khles"
          }
        }),
        onload: res => {
          try {
            const r = JSON.parse(res.responseText);
            r.errorId === 0 ? resolve(r.taskId) : reject(new Error(r.errorDescription));
          } catch(e) { reject(e); }
        },
        onerror: reject
      });
    });
  }

  function joinerGetCaptchaResult(taskId) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: JOINER_CAPMONSTER_API_URL + "/getTaskResult",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ clientKey: JOINER_CAPMONSTER_API_KEY, taskId }),
        onload: res => {
          try { resolve(JSON.parse(res.responseText)); } catch(e) { reject(e); }
        },
        onerror: reject
      });
    });
  }

  function joinerResetCaptchaState() {
    joinerCaptchaState = "READY";
    joinerCaptchaResponse = null;
    if (joinerCaptchaTimeoutId) { clearTimeout(joinerCaptchaTimeoutId); joinerCaptchaTimeoutId = null; }
    joinerUpdateCaptchaBtn();
  }

  function joinerUpdateCaptchaBtn() {
    const btn = document.getElementById("joiner-captcha-btn");
    if (!btn) return;
    switch (joinerCaptchaState) {
      case "READY":
        btn.textContent = "Solved";
        btn.style.background = "rgba(255,255,255,.06)";
        btn.style.borderColor = "";
        break;
      case "SOLVING":
        btn.textContent = "Solving...";
        btn.style.background = "rgba(120,80,0,.45)";
        btn.style.borderColor = "rgba(255,165,0,.4)";
        break;
      case "SOLVED":
        btn.textContent = "✓ Solved";
        btn.style.background = "rgba(0,60,0,.55)";
        btn.style.borderColor = "rgba(0,255,80,.4)";
        break;
    }
  }

  async function joinerStartCaptchaBypass() {
    if (joinerCaptchaState === "SOLVED") {
      joinerCaptchaState = "SOLVING";
      joinerCaptchaResponse = null;
      if (joinerCaptchaTimeoutId) { clearTimeout(joinerCaptchaTimeoutId); joinerCaptchaTimeoutId = null; }
    } else if (joinerCaptchaState === "READY") {
      joinerCaptchaState = "SOLVING";
    }
    joinerUpdateCaptchaBtn();
    try {
      const taskId = await joinerCreateCaptchaTask();
      const poll = setInterval(async () => {
        try {
          const result = await joinerGetCaptchaResult(taskId);
          if (result.status === "ready") {
            clearInterval(poll);
            joinerCaptchaResponse = result.solution.gRecaptchaResponse;
            joinerCaptchaState = "SOLVED";
            joinerUpdateCaptchaBtn();
            joinerSubmitCaptchaResponse(joinerCaptchaResponse);
          } else if (result.status !== "processing") {
            clearInterval(poll);
            joinerCaptchaState = "READY";
            joinerUpdateCaptchaBtn();
          }
        } catch { joinerCaptchaState = "READY"; joinerUpdateCaptchaBtn(); }
      }, 2000);
    } catch { joinerCaptchaState = "READY"; joinerUpdateCaptchaBtn(); }
  }

  // — Auto-click logic —
  function joinerHandleTeam(team) {
    const currentState = team === "ALPHA" ? joinerAlphaState : joinerBravoState;

    if (currentState === "ACTIVE") {
      if (team === "ALPHA") joinerAlphaState = "READY";
      else joinerBravoState = "READY";
      joinerSyncButtons();
      return;
    }

    if (team === "ALPHA") joinerAlphaState = "ACTIVE";
    else joinerBravoState = "ACTIVE";
    joinerSyncButtons();

    const selector = JOINER_SELECTORS[team];

    // Try clicking immediately if button already exists and is enabled
    const existingBtn = document.querySelector(selector);
    if (existingBtn && !existingBtn.classList.contains("ButtonComponentStyle-disabled")) {
      existingBtn.click();
      setTimeout(() => existingBtn.click(), 50);

      if (joinerCaptchaState === "SOLVED") joinerResetCaptchaState();

      if (joinerCountMode === "increase") {
        joinerCountMode = "backup";
        joinerRestoreOriginalValues();
        const sb = document.getElementById("joiner-spot-btn");
        if (sb) { sb.textContent = "+1 Spot"; sb.style.background = "rgba(255,255,255,.06)"; sb.classList.remove("joiner-active"); }
      }

      if (team === "ALPHA") joinerAlphaState = "READY";
      else joinerBravoState = "READY";
      joinerSyncButtons();
      return;
    }

    // Always observe
    const observer = new MutationObserver(() => {
      const btn = document.querySelector(selector);
      if (btn && !btn.classList.contains("ButtonComponentStyle-disabled")) {
        btn.click();
        setTimeout(() => btn.click(), 50);

        if (joinerCaptchaState === "SOLVED") joinerResetCaptchaState();

        if (joinerCountMode === "increase") {
          joinerCountMode = "backup";
          joinerRestoreOriginalValues();
          const sb = document.getElementById("joiner-spot-btn");
          if (sb) { sb.textContent = "+1 Spot"; sb.style.background = "rgba(255,255,255,.06)"; sb.classList.remove("joiner-active"); }
        }

        if (team === "ALPHA") joinerAlphaState = "READY";
        else joinerBravoState = "READY";
        joinerSyncButtons();
        observer.disconnect();
        joinerActiveObservers = joinerActiveObservers.filter(o => o !== observer);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    joinerActiveObservers.push(observer);
  }

  /* ============================================================= */

  const style = create("style", {
    text: `
      :root{
        --radius: 16px;
        --radius2: 18px;
        --shadow: 0 20px 60px rgba(0,0,0,.55);
        --font: system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial;
      }

      #${ROOT_ID}{
        position:fixed;
        inset:0;
        z-index:2147483647;
        pointer-events:none;
        font-family:var(--font);

        --alpha: 0.70;
        --menuAlpha: 0.80;
        --scale: 1;

        --text: #F2F5FF;
        --accent: #7C5CFF;
        --tabDarkness: 0.30;

        --border: rgba(255,255,255,.10);
        color: var(--text);
      }

      #${ROOT_ID}.uiHidden .dock,
      #${ROOT_ID}.uiHidden .modalWrap{
        opacity:0;
        transform:translateX(-10px);
        pointer-events:none;
      }

      .dock{
        position:fixed;
        left:0; top:0; bottom:0;
        width:calc(280px * var(--scale));
        padding:calc(14px * var(--scale));
        border-right:1px solid var(--border);
        box-shadow:var(--shadow);
        border-top-right-radius:var(--radius);
        border-bottom-right-radius:var(--radius);
        display:flex;
        flex-direction:column;
        gap:calc(12px * var(--scale));
        pointer-events:auto;
        user-select:none;

        background: linear-gradient(
          180deg,
          rgb(10 12 16 / var(--alpha)),
          rgb(8 10 14 / calc(var(--alpha) * 0.75))
        );
      }

      .title{
        text-align:center;
        font-size:calc(18px * var(--scale));
        font-weight:900;
        padding:calc(14px * var(--scale)) 0;
        border-bottom:1px solid var(--border);
      }

      .tabs{
        flex:1;
        display:flex;
        flex-direction:column;
        gap:calc(10px * var(--scale));
      }

      .tab{
        padding:calc(12px * var(--scale));
        border-radius:calc(14px * var(--scale));
        border:1px solid var(--border);
        background: rgba(0,0,0,var(--tabDarkness));
        cursor:pointer;
        text-align:center;
        font-weight:850;
        font-size:calc(14px * var(--scale));
        transition:.15s;
      }
      .tab:hover{ background: rgba(0,0,0, calc(var(--tabDarkness) + 0.08)); }
      .tab[aria-selected="true"]{
        border-color: color-mix(in srgb, var(--accent) 70%, rgba(255,255,255,.10));
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent) inset;
        background: linear-gradient(135deg,
          color-mix(in srgb, var(--accent) 20%, rgba(0,0,0,var(--tabDarkness))),
          rgba(0,0,0, calc(var(--tabDarkness) + 0.03))
        );
      }

      .modalWrap{
        position:fixed;
        inset:0;
        display:flex;
        align-items:center;
        justify-content:center;
        pointer-events:none;
      }

      .modal{
        position:relative;
        width:min(760px,calc(100vw - 64px));
        height:min(460px,calc(100vh - 80px));
        border:1px solid var(--border);
        border-radius:var(--radius2);
        box-shadow: 0 14px 40px rgba(0,0,0,.45);

        background: linear-gradient(
          180deg,
          rgb(18 22 30 / var(--menuAlpha)),
          rgb(10 12 16 / calc(var(--menuAlpha) * 0.80))
        );

        opacity:0;
        transform:translateY(14px) scale(.98);
        transition:.25s;
        pointer-events:none;
        overflow:hidden;
      }

      #${ROOT_ID}.menuOpen .modal{
        opacity:1;
        transform:none;
        pointer-events:auto;
      }

      .modalHeader{
        text-align:center;
        padding:calc(16px * var(--scale));
        border-bottom:1px solid var(--border);
        font-size:calc(18px * var(--scale));
        font-weight:900;
      }

      .modalBody{
        padding:calc(16px * var(--scale));
        padding-bottom:calc(72px * var(--scale));
        position:relative;
        height:calc(100% - calc(56px * var(--scale)));
        overflow:hidden;
      }

      .row{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        padding:12px 0;
        border-bottom:1px solid rgba(255,255,255,.06);
      }
      .row:last-child{ border-bottom:none; }
      .label{ font-weight:900; font-size:calc(13px * var(--scale)); }

      #${ROOT_ID} input[type="range"]{
        -webkit-appearance: none;
        appearance: none;
        width: 240px;
        height: 6px;
        border-radius: 999px;
        background: rgba(255,255,255,.22);
        outline: none;
      }
      #${ROOT_ID} input[type="range"]::-webkit-slider-thumb{
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 999px;
        background: rgba(235,235,235,.95);
        border: 1px solid rgba(0,0,0,.25);
        cursor: pointer;
      }
      #${ROOT_ID} input[type="range"]::-moz-range-track{
        height: 6px;
        border-radius: 999px;
        background: rgba(255,255,255,.22);
      }
      #${ROOT_ID} input[type="range"]::-moz-range-thumb{
        width: 16px;
        height: 16px;
        border-radius: 999px;
        background: rgba(235,235,235,.95);
        border: 1px solid rgba(0,0,0,.25);
        cursor: pointer;
      }

      .color{
        width: 44px;
        height: 34px;
        border-radius: 10px;
        border: 1px solid var(--border);
        background: transparent;
        padding: 0;
        cursor: pointer;
      }
      .color::-webkit-color-swatch-wrapper{ padding: 0; }
      .color::-webkit-color-swatch{ border: none; border-radius: 10px; }

      /* ── Appearance tab ── */
      .appWrap{
        width:100%;
        height:100%;
        display:flex;
        align-items:center;
        justify-content:center;
      }
      .appCard{
        width:min(540px,100%);
        background: rgba(0,0,0,.22);
        border:1px solid rgba(255,255,255,.10);
        border-radius:20px;
        padding:22px 28px 18px;
        display:flex;
        flex-direction:column;
        gap:6px;
        box-shadow: 0 18px 60px rgba(0,0,0,.45);
      }
      .appRow{
        display:grid;
        grid-template-columns: 120px 1fr 52px;
        align-items:center;
        gap:14px;
        padding:10px 0;
        border-bottom:1px solid rgba(255,255,255,.06);
      }
      .appRow:last-of-type{ border-bottom:none; }
      .appLabel{
        font-weight:900;
        font-size:13px;
        color: var(--accent);
        letter-spacing:.3px;
      }
      .appVal{
        font-weight:900;
        font-size:13px;
        text-align:right;
        opacity:.85;
        min-width:40px;
      }
      #${ROOT_ID} input.appRange{
        width:100%;
        height:6px;
        border-radius:999px;
        background: rgba(255,255,255,.18);
        outline:none;
        -webkit-appearance:none;
        appearance:none;
        cursor:pointer;
      }
      #${ROOT_ID} input.appRange::-webkit-slider-thumb{
        -webkit-appearance:none;
        appearance:none;
        width:18px;
        height:18px;
        border-radius:999px;
        background:#fff;
        border:2px solid rgba(0,0,0,.18);
        cursor:pointer;
        box-shadow:0 2px 6px rgba(0,0,0,.35);
      }
      #${ROOT_ID} input.appRange::-moz-range-thumb{
        width:18px;
        height:18px;
        border-radius:999px;
        background:#fff;
        border:2px solid rgba(0,0,0,.18);
        cursor:pointer;
        box-shadow:0 2px 6px rgba(0,0,0,.35);
      }
      .appResetBtn{
        align-self:center;
        margin-top:10px;
        padding:9px 24px;
        border-radius:12px;
        border:1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.06);
        cursor:pointer;
        font-weight:900;
        font-size:13px;
        text-align:center;
        transition:.15s;
        color: var(--text);
      }
      .appResetBtn:hover{ background: rgba(255,255,255,.12); }

      /* ── Clicker ── */
      .clickerWrap{
        width:100%;
        height:100%;
        display:flex;
        align-items:center;
        justify-content:center;
        padding: 10px;
        box-sizing: border-box;
      }
      .clickerCard{
        width:min(560px, 100%);
        border:1px solid rgba(255,255,255,.10);
        border-radius:18px;
        padding:18px 16px;
        background:rgba(0,0,0,.18);
        box-shadow: 0 18px 60px rgba(0,0,0,.45);
        display:flex;
        flex-direction:column;
        gap:14px;
      }
      .clickerTop{
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:12px;
        padding: 6px 0;
      }

      .iconRow{
        display:flex;
        gap:16px;
        align-items:center;
        justify-content:center;
        flex-wrap:wrap;
        padding: 6px 0;
      }
      .sIcon{
        width:54px;
        height:54px;
        display:grid;
        place-items:center;
        border-radius:16px;
        border:none;
        background: rgba(255,255,255,.06);
        cursor:pointer;
        transition: transform .12s ease, background .12s ease, opacity .2s ease;
      }
      .sIcon:hover{ background: rgba(255,255,255,.10); transform: translateY(-1px); }
      .sIcon img{ width:38px; height:38px; }
      .sIcon.off{ opacity:.30; filter: grayscale(1); }
      .sIcon.on{ opacity:1; filter:none; }

      .fields{
        display:flex;
        justify-content:center;
      }
      .field{
        width:min(320px, 100%);
        border-radius:14px;
        padding:10px 12px;
        background: rgba(255,255,255,.05);
        border:1px solid rgba(255,255,255,.10);
        display:flex;
        flex-direction:column;
      }
      .field .inpWrap{
        display:flex;
        align-items:center;
        justify-content:center;
        gap:10px;
      }
      .num::-webkit-outer-spin-button,
      .num::-webkit-inner-spin-button{
        -webkit-appearance: none;
        margin: 0;
      }

      .num{
        width:170px;
        padding:10px 10px;
        border-radius:12px;
        outline:none;
        color: var(--text);
        border:1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.04);
        font-weight:900;
        font-size:16px;
        text-align:center;
        -moz-appearance: textfield;
      }
      .num:focus{
        border-color: color-mix(in srgb, var(--accent) 65%, rgba(255,255,255,.18));
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent);
      }
      .unit{
        min-width:32px;
        text-align:left;
        font-weight:900;
        opacity:.65;
        cursor:text;
        user-select:none;
      }

      .hkWrap{ display:flex; flex-direction:column; gap:8px; }
      .hkRow{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        padding:10px;
        border:1px solid rgba(255,255,255,.10);
        background: rgba(0,0,0,.18);
        border-radius:14px;
      }
      .hkLeft{ display:flex; flex-direction:column; gap:3px; }
      .hkName{ font-weight:900; font-size:13px; }
      .hkDesc{ font-size:11px; opacity:.60; font-weight:800; text-align:center; display:block; width:100%; margin-top:6px; }

      .hkBtn{
        padding:8px 10px;
        border-radius:12px;
        border:1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.06);
        cursor:pointer;
        font-weight:900;
        min-width:110px;
        text-align:center;
        font-size:13px;
      }
      .hkBtn:hover{ background: rgba(255,255,255,.10); }
      .hkBtn.listening{
        border-color: color-mix(in srgb, var(--accent) 70%, rgba(255,255,255,.12));
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent);
      }
      .hkReset{
        padding:7px 10px;
        border-radius:12px;
        min-width:auto;
        width:auto;
        align-self:center;
      }

      /* ── Others / Supplies Hider ── */
      #${ROOT_ID}.uiHidden .settingsBox{
        opacity:0;
        pointer-events:none;
      }
      .othersCard{
        padding:13px 14px;
        border-radius:18px;
        border:1px solid rgba(255,255,255,.08);
        background:rgba(0,0,0,.12);
        min-height:58px;
        display:flex;
        flex-direction:column;
        justify-content:center;
      }
      .featureRow{display:flex;align-items:center;justify-content:space-between;gap:14px;}
      .featureName{font-size:15px;font-weight:950;}
      .featureControls{display:flex;align-items:center;gap:10px;}
      .btn{
        border:1px solid rgba(255,255,255,.14);
        background:rgba(255,255,255,.06);
        color:var(--text);
        cursor:pointer;
        user-select:none;
        transition:.15s;
      }
      .btn:hover{background:rgba(255,255,255,.12);}
      .toggle{width:82px;padding:9px 0;border-radius:999px;text-align:center;font-weight:950;}
      .toggle.on{background:color-mix(in srgb,var(--accent) 65%,transparent);border-color:var(--accent);}
      .gear{
        width:38px;
        height:38px;
        border-radius:12px;
        display:grid;
        place-items:center;
        font-size:18px;
        border:1px solid rgba(255,255,255,.08);
      }
      .settingsBox{
        position:fixed;
        top:50%;
        right:80px;
        transform:translateY(-50%) translateX(40px);
        width:350px;
        height:auto;
        max-height:520px;
        opacity:0;
        pointer-events:none;
        border-radius:22px;
        border:1px solid rgba(255,255,255,.08);
        background:linear-gradient(180deg,rgba(16,18,24,.96),rgba(10,12,18,.92));
        backdrop-filter:blur(24px);
        -webkit-backdrop-filter:blur(24px);
        box-shadow:0 24px 80px rgba(0,0,0,.55);
        overflow:hidden;
        transition:opacity .18s ease, transform .18s ease;
        color:var(--text);
      }
      .settingsBox.show{
        opacity:1;
        pointer-events:auto;
        transform:translateY(-50%) translateX(0);
      }
      .settingsTitle{
        height:42px;
        display:flex;
        align-items:center;
        justify-content:center;
        border-bottom:1px solid rgba(255,255,255,.08);
        font-weight:950;
      }
      .settingsContent{
        padding:18px 22px 20px;
        max-height:455px;
        overflow:auto;
        scrollbar-width:none;
      }
      .settingsContent::-webkit-scrollbar{display:none;}
      .modeRow{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:12px;}
      .modeBtn{padding:9px;border-radius:14px;text-align:center;font-weight:950;}
      .modeBtn.active{background:color-mix(in srgb,var(--accent) 45%,transparent);border-color:var(--accent);}
      .dragBtn{margin-bottom:14px;}
      .srow{display:grid;grid-template-columns:88px 1fr 52px;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06);}
      .slabel{font-weight:950;}
      .svalue{text-align:right;font-weight:950;opacity:.8;}
      #${ROOT_ID} .settingsBox input[type="range"]{width:100%;accent-color:#1e8bff;}
      .lukas-supplies-overlay{
        position:fixed;
        z-index:2147483000;
        display:none;
        box-shadow:0 4px 18px rgba(0,0,0,.35);
        pointer-events:none;
      }
      .lukas-supplies-overlay.editing{
        pointer-events:auto;
        cursor:move;
        outline:2px dashed rgba(124,92,255,.95);
        outline-offset:4px;
      }
      .lukas-supplies-overlay.editing::after{
        content:"DRAG";
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        padding:5px 10px;
        border-radius:999px;
        background:rgba(0,0,0,.65);
        font-size:12px;
        font-weight:950;
      }

      /* ── Background tab ── */
      .bgWrap{
        width:100%;
        height:100%;
        display:flex;
        align-items:center;
        justify-content:center;
      }
      .bgCard{
        width:min(580px,100%);
        border:1px solid color-mix(in srgb,var(--accent) 35%,rgba(255,255,255,.12));
        border-radius:20px;
        padding:18px;
        background:rgba(0,0,0,.18);
        box-shadow:0 18px 60px rgba(0,0,0,.38);
      }
      .bgRow{
        display:grid;
        grid-template-columns:130px 1fr 96px;
        align-items:center;
        gap:14px;
        padding:8px 0 14px;
        border-bottom:1px solid rgba(255,255,255,.06);
      }
      .bgLabel{
        font-weight:950;
        color:var(--accent);
        font-size:13px;
      }
      .bgModePill{
        height:38px;
        border-radius:999px;
        display:grid;
        place-items:center;
        border:1px solid rgba(255,255,255,.10);
        background:rgba(0,0,0,.20);
        font-weight:950;
      }
      .bgUrlLabel{
        margin:14px 0 8px;
        font-weight:950;
        color:var(--accent);
        font-size:13px;
      }
      .bgUrl{
        width:100%;
        height:36px;
        min-height:36px;
        max-height:36px;
        resize:none;
        box-sizing:border-box;
        padding:10px 12px;
        border-radius:11px;
        border:1px solid rgba(255,255,255,.12);
        outline:none;
        color:var(--text);
        background:rgba(0,0,0,.28);
        font:12px ui-monospace,SFMono-Regular,Consolas,monospace;
        overflow:hidden;
        white-space:nowrap;
      }
      .bgUrl:focus{
        border-color:var(--accent);
        box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 18%,transparent);
      }
      .bgTip{
        margin-top:12px;
        font-size:12px;
        font-weight:850;
        opacity:.82;
      }
      .bgTip a{
        color:var(--accent);
        text-decoration:none;
        font-weight:950;
        padding:3px 8px;
        border-radius:999px;
        border:1px solid color-mix(in srgb,var(--accent) 45%,rgba(255,255,255,.10));
        background:color-mix(in srgb,var(--accent) 12%,transparent);
      }
      .bgBtns{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:12px;
        margin-top:16px;
      }
      .bgBtn{
        border:1px solid rgba(255,255,255,.14);
        border-radius:12px;
        padding:12px;
        cursor:pointer;
        color:var(--text);
        background:rgba(255,255,255,.06);
        font-weight:950;
        text-align:center;
        transition:.15s;
      }
      .bgBtn:hover{ background:rgba(255,255,255,.11); transform:translateY(-1px); }
      .bgBtn.primary{
        background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 62%,transparent),rgba(255,255,255,.10));
        border-color:color-mix(in srgb,var(--accent) 55%,rgba(255,255,255,.10));
      }

/* ===================== LIST TAB (NO SCROLL, SUBTABS) ===================== */
#${ROOT_ID} .listWrap{ padding:14px; position:relative;  height:100%;}
#${ROOT_ID} .listTop{ display:flex; flex-direction:column; gap:10px; align-items:center; }
#${ROOT_ID} .listSearch{ width:min(520px, 100%); }
#${ROOT_ID} .listSearch input{
  width:100%;
  padding:10px 12px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.22);
  background:rgba(0,0,0,.35);
  color:var(--text);
  outline:none;
  font-weight:800;
}
#${ROOT_ID} .listSearch input::placeholder{ color:rgba(242,245,255,.6); }

#${ROOT_ID} .listTabs{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  justify-content:center;
}
#${ROOT_ID} .listTabsBar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  flex-wrap:wrap;
}
#${ROOT_ID} .listActionsInline{
  display:flex;
  gap:10px;
  align-items:center;
  justify-content:flex-end;
}
#${ROOT_ID} .listActionsInline .listBtn{
  padding:8px 14px;
  font-size:12px;
}
#${ROOT_ID} .listTabBtn{
  padding:10px 12px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.18);
  background:rgba(0,0,0, calc(var(--tabDarkness) + .08));
  color:rgba(242,245,255,.9);
  font-weight:900;
  text-transform:uppercase;
  letter-spacing:.4px;
  cursor:pointer;
  user-select:none;
}
#${ROOT_ID} .listTabBtn.active{
  border-color: color-mix(in srgb, var(--accent) 55%, rgba(255,255,255,.18));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 25%, transparent);
}

#${ROOT_ID} .listCard{
  margin-top:12px;
  border-radius: var(--radius2);
  border:1px solid rgba(255,255,255,.14);
  background: rgba(0,0,0,.18);
  padding:12px;
  position:relative;
}
#${ROOT_ID} .listRow{
  display:flex;
  gap:10px;
  align-items:center;
  justify-content:center;
  flex-wrap:wrap;
}
#${ROOT_ID} .listRow input{
  width:min(360px, 100%);
  padding:10px 12px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.22);
  background:rgba(0,0,0,.35);
  color:var(--text);
  outline:none;
  font-weight:800;
  text-align:center;
}
#${ROOT_ID} .listBtn{
  padding:10px 16px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.18);
  background: color-mix(in srgb, var(--accent) 25%, rgba(0,0,0,.35));
  color:rgba(242,245,255,.95);
  font-weight:1000;
  cursor:pointer;
  user-select:none;
}

#${ROOT_ID} .listActions{
  display:flex;
  gap:10px;
  justify-content:center;
  align-items:center;
  flex-wrap:wrap;
  margin-top:10px;
}
#${ROOT_ID} .listBtn.secondary{
  background: rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.16);
}
#${ROOT_ID} .listBtn.secondary:hover{ background: rgba(255,255,255,.10); }
#${ROOT_ID} .listStatus{
  margin-top:10px;
  text-align:center;
  font-size:12px;
  font-weight:900;
  opacity:.75;
}
#${ROOT_ID} .importBox{
  margin-top:10px;
  display:none;
  gap:10px;
  justify-content:center;
  align-items:center;
  flex-wrap:wrap;
}
#${ROOT_ID} .importBox.show{ display:flex; }
#${ROOT_ID} .importBox textarea{
  width:min(520px, 100%);
  min-height:84px;
  resize:vertical;
  padding:10px 12px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.22);
  background:rgba(0,0,0,.35);
  color:var(--text);
  outline:none;
  font-weight:800;
}
#${ROOT_ID} .helpFab{
  position:relative;
  right:auto;
  bottom:auto;
  width:38px;
  height:38px;
  border-radius:999px;
  display:flex;
  align-items:center;
  justify-content:center;
  border:1px solid rgba(255,255,255,.18);
  background: rgba(0,0,0,.35);
  cursor:help;
  pointer-events:auto;
  user-select:none;
  font-weight:1000;
  color: rgba(242,245,255,.96);
  font-size:16px;
}
#${ROOT_ID} .helpFab:hover{
  border-color: color-mix(in srgb, var(--accent) 55%, rgba(255,255,255,.18));
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 25%, transparent);
}
#${ROOT_ID} .helpTip{
  color: rgba(242,245,255,.96) !important;
  position:absolute;
  right:0;
  top:46px;           /* show BELOW the ? button (stays inside modal, no clipping) */
  bottom:auto;
  width:min(360px, calc(100vw - 120px));
  padding:12px 12px;
  border-radius:16px;
  border:1px solid rgba(255,255,255,.16);
  background: rgba(0,0,0,.78);
  box-shadow: var(--shadow);
  display:none;
  pointer-events:none;
  text-align:left;
  font-size:12px;
  line-height:1.35;
  z-index: 50;
  overflow:hidden;
}
#${ROOT_ID} .helpTip *{ color: inherit; }

#${ROOT_ID} .helpFab:hover .helpTip{ display:block; }

#${ROOT_ID}

#${ROOT_ID} .helpTip b{ color:#fff; }
#${ROOT_ID} .helpTip .mini{ opacity:.9; font-weight:800; color:rgba(242,245,255,.92); }
#${ROOT_ID} .pillBox{
  margin-top:12px;
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  justify-content:center;
  padding:10px;
  border-radius:14px;
  border:1px dashed rgba(255,255,255,.14);
  background: rgba(0,0,0,.14);
  overflow:hidden; /* no scroll */
  max-height: 220px; /* keeps modal clean */
}
#${ROOT_ID} .pill{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:6px 10px;
  border-radius:999px;
  background: rgba(0,0,0,.50);
  border:1px solid rgba(255,255,255,.12);
  font-size:12px;
  font-weight:900;
  letter-spacing:.4px;
  user-select:none;
}
#${ROOT_ID} .pill .x{
  cursor:pointer;
  opacity:.85;
}

/* Nick highlight (text only) */
.lukas-friend-nick{ color:#00ff3c !important; font-weight:900 !important; background:none !important; box-shadow:none !important; border:none !important; padding:0 !important; -webkit-text-fill-color:#00ff3c !important; }
.lukas-enemy-nick{ color:#ff1e1e !important; font-weight:900 !important; background:none !important; box-shadow:none !important; border:none !important; padding:0 !important; -webkit-text-fill-color:#ff1e1e !important; }



      /* Currency/header panel styling copied from 123.txt logic */
      .MainScreenComponentStyle-containerPanel > .UserScoreComponentStyle-blockRightPanel > div{
        background:rgba(0,0,0,.05) !important;
        outline:2px solid rgba(255,255,255,.025) !important;
        box-shadow:0 0 1.5em 0 rgba(0,0,0,.40) !important;
        border:unset !important;
        border-radius:1.25em !important;
        backdrop-filter:blur(3px) !important;
        -webkit-backdrop-filter:blur(3px) !important;
        transition:.15s cubic-bezier(.25,.1,.25,1) !important;
      }

      .MainScreenComponentStyle-containerPanel > .UserScoreComponentStyle-blockRightPanel > div:hover{
        background:rgba(255,255,255,.05) !important;
      }

      .MainScreenComponentStyle-containerPanel > .UserScoreComponentStyle-blockRightPanel > div:nth-child(1){
        position:absolute !important;
        right:12.5em !important;
        width:18.5em !important;
        height:5em !important;
      }

      .MainScreenComponentStyle-containerPanel > .UserScoreComponentStyle-blockRightPanel > div:nth-child(1) > .HeaderCommonStyle-icons{
        background:transparent !important;
        border:unset !important;
        height:2.5em !important;
      }

      .MainScreenComponentStyle-containerPanel > .UserScoreComponentStyle-blockRightPanel > div:nth-child(1) > .HeaderCommonStyle-icons > .-iconCoinSizeMedium,
      .BreadcrumbsComponentStyle-rightButtonsContainer > div > .HeaderCommonStyle-icons > .-iconCoinSizeMedium,
      .MainScreenComponentStyle-containerPanel > .UserScoreComponentStyle-blockRightPanel > div:nth-child(1) > .HeaderCommonStyle-icons > .Common-iconCoinSizeMedium,
      .BreadcrumbsComponentStyle-rightButtonsContainer > div > .HeaderCommonStyle-icons > .Common-iconCoinSizeMedium{
        margin-left:1em !important;
      }

      .MainScreenComponentStyle-containerPanel > .UserScoreComponentStyle-blockRightPanel > div:nth-child(1) > .HeaderCommonStyle-icons > .UserScoreComponentStyle-iconCrystal,
      .BreadcrumbsComponentStyle-rightButtonsContainer > div > .HeaderCommonStyle-icons > .UserScoreComponentStyle-iconCrystal{
        margin-left:.22em !important;
      }

      .MainScreenComponentStyle-containerPanel > .UserScoreComponentStyle-blockRightPanel > .-flexCenterAlignCenter,
      .MainScreenComponentStyle-containerPanel > .UserScoreComponentStyle-blockRightPanel > .Common-flexCenterAlignCenter{
        position:absolute !important;
        right:6em !important;
        top:.5em !important;
        width:5em !important;
        height:5em !important;
      }

      .MainScreenComponentStyle-containerPanel > .UserScoreComponentStyle-blockRightPanel > .BreadcrumbsComponentStyle-logout{
        position:absolute !important;
        right:.5em !important;
        width:5em !important;
        height:5em !important;
      }

      .BreadcrumbsComponentStyle-rightButtonsContainer > div{
        background:rgba(0,0,0,.05) !important;
        outline:2px solid rgba(255,255,255,.025) !important;
        box-shadow:0 0 1.5em 0 rgba(0,0,0,.40) !important;
        border:unset !important;
        border-radius:1.25em !important;
        backdrop-filter:blur(3px) !important;
        -webkit-backdrop-filter:blur(3px) !important;
        position:absolute !important;
        top:.5em !important;
        right:12.5em !important;
        width:18.5em !important;
        height:5em !important;
        transition:.15s cubic-bezier(.25,.1,.25,1) !important;
      }

      .BreadcrumbsComponentStyle-rightButtonsContainer > div:hover{
        background:rgba(255,255,255,.05) !important;
      }

      .BreadcrumbsComponentStyle-rightButtonsContainer > div > .HeaderCommonStyle-icons{
        background:transparent !important;
        border:unset !important;
        height:2.5em !important;
      }

      .BreadcrumbsComponentStyle-rightButtonsContainer > .UserScoreComponentStyle-coinsContainer{
        display:flex !important;
        align-items:center !important;
        right:30em !important;
      }

      .BreadcrumbsComponentStyle-rightButtonsContainer > .UserScoreComponentStyle-coinsContainer > .HeaderCommonStyle-icons{
        height:100% !important;
      }

      .BreadcrumbsComponentStyle-rightButtonsContainer > .-flexCenterAlignCenter,
      .BreadcrumbsComponentStyle-rightButtonsContainer > .Common-flexCenterAlignCenter{
        position:absolute !important;
        right:6em !important;
        top:.5em !important;
        width:5em !important;
        height:5em !important;
      }

      .BreadcrumbsComponentStyle-rightButtonsContainer > .BreadcrumbsComponentStyle-exitGameButton{
        position:absolute !important;
        right:.5em !important;
        top:.5em !important;
        width:5em !important;
        height:5em !important;
      }

      /* Hide Tanki client info footer */
      .ClientInfoComponentStyle-container{
        display:none !important;
      }

/* ── Cool battle result / killboard element styling ── */
      .BattleKillBoardComponentStyle-tableContainer table{
        align-items:center !important;
        height:42em !important;
        width:100em !important;
      }
      .BattleKillBoardComponentStyle-tableContainer table td,
      .BattleKillBoardComponentStyle-tableContainer table th{
        box-sizing:border-box !important;
        flex-shrink:0 !important;
        margin:0 !important;
        max-width:unset !important;
        min-width:unset !important;
      }
      .BattleKillBoardComponentStyle-tableContainer table tr{ width:49.5em !important; }
      .BattleKillBoardComponentStyle-tableContainer table tr > *{ width:9.28% !important; }
      .BattleKillBoardComponentStyle-tableContainer table tr > * > *{ margin:0 !important; }
      .BattleKillBoardComponentStyle-tableContainer table tr > :first-child{ width:35% !important; }
      .BattleKillBoardComponentStyle-tableContainer table > thead{ padding-right:1em !important; }
      .BattleKillBoardComponentStyle-tableContainer table > thead,
      .BattleKillBoardComponentStyle-tableContainer table > thead tr,
      .BattleKillBoardComponentStyle-tableContainer table > thead tr th{ visibility:hidden !important; }
      .BattleKillBoardComponentStyle-tableContainer table > thead > tr{ pointer-events:none !important; }
      .BattleKillBoardComponentStyle-tableContainer table > thead > tr > :first-child{ padding-left:.75em !important; }
      .BattleKillBoardComponentStyle-tableContainer table > thead > tr > th > :nth-child(2){ display:none !important; }
      .BattleKillBoardComponentStyle-tableContainer table > tbody{
        display:grid !important;
        gap:.3em 1em !important;
        grid-auto-flow:column !important;
        grid-auto-rows:min-content !important;
        grid-template-columns:1fr 1fr !important;
        margin-top:unset !important;
        padding-right:unset !important;
        width:100% !important;
      }
      .BattleKillBoardComponentStyle-tableContainer table > tbody > tr{
        grid-column:1 / 2 !important;
        margin-top:.25em !important;
        margin-bottom:.25em !important;
        height:2.5em !important;
      }
      .BattleKillBoardComponentStyle-tableContainer table > tbody > tr#enemyCommand{ grid-column:2 / 3 !important; }
      .BattleKillBoardComponentStyle-tableContainer table > tbody > tr#rowSpace,
      .BattleKillBoardComponentStyle-tableContainer table > tbody > tr#teamRowSpace{ display:none !important; }
      .BattleKillBoardComponentStyle-tableContainer table:not(:has(> tbody > #teamRowSpace)){ width:50em !important; }
      .BattleKillBoardComponentStyle-tableContainer table:not(:has(> tbody > #teamRowSpace)) tr{
        grid-column:1 / 2 !important;
        width:50em !important;
      }
      .BattleKillBoardComponentStyle-tableContainer table:not(:has(> tbody > #teamRowSpace)) > thead > :nth-child(2){ display:none !important; }
      .BattleKillBoardComponentStyle-tableContainer table:not(:has(> tbody > #teamRowSpace)) > tbody{ grid-template-columns:1fr !important; }
      .BattleKillBoardComponentStyle-tableContainer table tbody #selfUserBg{
        background:rgb(0 212 255 / 20%) !important;
        box-shadow:unset !important;
        border-radius:.8em !important;
        backdrop-filter:blur(16px) !important;
        -webkit-backdrop-filter:blur(16px) !important;
        transition:.15s cubic-bezier(.25,.1,.25,1) !important;
        animation:lukasBlend .15s ease-in-out !important;
      }
      .BattleKillBoardComponentStyle-tableContainer table tbody #blueCommand{
        background:rgb(0 212 255 / 5%) !important;
        box-shadow:unset !important;
        border-radius:.8em !important;
        backdrop-filter:blur(16px) !important;
        -webkit-backdrop-filter:blur(16px) !important;
        transition:.15s cubic-bezier(.25,.1,.25,1) !important;
        animation:lukasBlend .15s ease-in-out !important;
      }
      .BattleKillBoardComponentStyle-tableContainer table tbody #enemyCommand{
        background:rgb(255 102 102 / 10%) !important;
        box-shadow:unset !important;
        border-radius:.8em !important;
        backdrop-filter:blur(16px) !important;
        -webkit-backdrop-filter:blur(16px) !important;
        transition:.15s cubic-bezier(.25,.1,.25,1) !important;
        animation:lukasBlend .15s ease-in-out !important;
      }
      .BattleKillBoardComponentStyle-tableContainer table tbody tr td > .GearScoreStyle-bestGS{ margin-left:unset !important; }
      .BattleKillBoardComponentStyle-rankIcon{ margin:0 .75em !important; }
      @keyframes lukasBlend{ from{opacity:0;} to{opacity:1;} }


    `
  });

  const root = create("div", { id: ROOT_ID, children: [style] });

  const dock = create("div", { className: "dock" });
  const title = create("div", { className: "title", text: "Made By Lukas" });

  const tabsWrap = create("div", { className: "tabs" });
  const tabBtns = new Map();

  for (const t of TABS) {
    const b = create("div", {
      className: "tab",
      dataset: { tab: t.id },
      attrs: { "aria-selected": "false" },
      text: t.name
    });
    tabBtns.set(t.id, b);
    tabsWrap.appendChild(b);
  }

  dock.append(title, tabsWrap);

  const modalWrap = create("div", { className: "modalWrap" });
  const modal = create("div", { className: "modal" });
  const modalHeader = create("div", { className: "modalHeader" });
  const modalBody = create("div", { className: "modalBody" });
  const settingsBox = create("div", { className: "settingsBox" });

  modal.append(modalHeader, modalBody);
  modalWrap.appendChild(modal);

  root.append(modalWrap, dock, settingsBox);
  document.documentElement.appendChild(root);

  const blockEv = (e) => {
    if (!e || !e.target) return;
    const insideUI = e.target.closest && e.target.closest(`#${ROOT_ID} .dock, #${ROOT_ID} .modal, #${ROOT_ID} .settingsBox`);
    if (!insideUI) return;
    e.stopPropagation();
    if (e.type === "wheel") e.preventDefault();
  };
  ["pointerdown","pointerup","mousedown","mouseup","click","dblclick","contextmenu","wheel"].forEach((t) => {
    root.addEventListener(t, blockEv, { capture: false, passive: t !== "wheel" ? true : false });

    const isUIInputFocused = () => {
      const ae = document.activeElement;
      if (!ae) return false;
      if (!root.contains(ae)) return false;
      const tag = (ae.tagName || "").toUpperCase();
      return tag === "INPUT" || tag === "TEXTAREA" || ae.isContentEditable;
    };
    ["keydown","keyup","keypress"].forEach((t) => {
      document.addEventListener(t, (e) => {
        if (!isUIInputFocused()) return;
        e.stopImmediatePropagation();
      }, true);
    });

  });

  function applyVars() {
    state.transparency = clamp(Number(state.transparency) || DEFAULTS.transparency, 0.25, 0.95);
    state.scale = clamp(Number(state.scale) || DEFAULTS.scale, 0.85, 1.15);
    state.tabDarkness = clamp(Number(state.tabDarkness) || DEFAULTS.tabDarkness, 0.06, 0.85);

    const menuAlpha = clamp(state.transparency + 0.10, 0.25, 0.98);

    if (typeof state.textColor !== "string" || !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(state.textColor)) state.textColor = DEFAULTS.textColor;
    if (typeof state.accentColor !== "string" || !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(state.accentColor)) state.accentColor = DEFAULTS.accentColor;

    root.style.setProperty("--alpha", String(state.transparency));
    root.style.setProperty("--menuAlpha", String(menuAlpha));
    root.style.setProperty("--scale", String(state.scale));
    root.style.setProperty("--tabDarkness", String(state.tabDarkness));
    root.style.setProperty("--text", state.textColor);
    root.style.setProperty("--accent", state.accentColor);
  }

  function apply() {
    root.classList.toggle("uiHidden", !state.uiVisible);
    root.classList.toggle("menuOpen", state.uiVisible && state.menuOpen);
    applyVars();
    save();
  }

  // ── Others tab / Supplies Hider ───────────────────────────
  let suppliesOverlay = null;
  let suppliesDragging = false;

  function canvasRect() {
    const c =
      document.querySelector(".BattleComponentStyle-canvasContainer canvas:not(#tankPreviewCanvas)") ||
      document.querySelector("canvas:not(#tankPreviewCanvas)");

    return c ? c.getBoundingClientRect() : {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      right: window.innerWidth,
      bottom: window.innerHeight
    };
  }

  function isBattle() {
    return !!document.querySelector(".BattleHudComponentStyle-hudContainer,[class*='BattleHud'][class*='hudContainer']");
  }

  function ensureSuppliesOverlay() {
    if (suppliesOverlay || !document.body) return;

    suppliesOverlay = document.createElement("div");
    suppliesOverlay.className = "lukas-supplies-overlay";
    document.body.appendChild(suppliesOverlay);

    suppliesOverlay.addEventListener("pointerdown", e => {
      if (!state.supplies.drag) return;
      suppliesDragging = true;
      suppliesOverlay.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    suppliesOverlay.addEventListener("pointermove", e => {
      if (!suppliesDragging || !state.supplies.drag) return;

      const r = canvasRect();
      const s = state.supplies;

      if (s.anchor === "right") {
        s.rightOffset = +(((r.right - e.clientX) / r.width) * 100).toFixed(2);
        s.rightBottom = +(((r.bottom - e.clientY) / r.height) * 100).toFixed(2);
      } else {
        s.centerBottom = +(((r.bottom - e.clientY) / r.height) * 100).toFixed(2);
      }

      save();
      refreshSuppliesOverlay();
      updateSuppliesLiveValues();
    });

    suppliesOverlay.addEventListener("pointerup", e => {
      suppliesDragging = false;
      try { suppliesOverlay.releasePointerCapture(e.pointerId); } catch {}
      save();
    });
  }

  function refreshSuppliesOverlay() {
    if (!document.body) return;
    ensureSuppliesOverlay();
    if (!suppliesOverlay) return;

    const s = state.supplies;
    const r = canvasRect();

    suppliesOverlay.style.display = s.enabled && isBattle() ? "block" : "none";
    suppliesOverlay.classList.toggle("editing", s.drag);

    const w = r.width * s.width / 100;
    let left, top;

    if (s.anchor === "middle") {
      left = r.left + r.width / 2;
      top = r.bottom - r.height * s.centerBottom / 100;
    } else {
      left = r.right - r.width * s.rightOffset / 100;
      top = r.bottom - r.height * s.rightBottom / 100;
    }

    suppliesOverlay.style.left = `${left}px`;
    suppliesOverlay.style.top = `${top}px`;
    suppliesOverlay.style.transform = "translate(-50%,-50%)";
    suppliesOverlay.style.width = `${w}px`;
    suppliesOverlay.style.height = `${s.height}px`;
    suppliesOverlay.style.borderRadius = `${s.radius}px`;
    suppliesOverlay.style.backdropFilter = `blur(${s.blur}px)`;
    suppliesOverlay.style.webkitBackdropFilter = `blur(${s.blur}px)`;
    suppliesOverlay.style.background = `rgba(20,20,20,${s.opacity})`;
    suppliesOverlay.style.border = `1.1px solid rgba(255,255,255,${s.border})`;
  }

  function updateSuppliesLiveValues() {
    root.querySelectorAll("[data-live]").forEach(v => {
      const key = v.dataset.live;
      const suffix = v.dataset.suffix || "";
      v.textContent = `${state.supplies[key]}${suffix}`;
    });
  }

  function setSuppliesAnchor(anchor) {
    const s = state.supplies;
    s.anchor = anchor;

    if (anchor === "middle") {
      s.centerBottom = 4.8;
      s.width = 22;
      s.height = 42;
    } else {
      s.rightOffset = 4.5;
      s.rightBottom = 4.5;
      s.width = 16;
      s.height = 31;
    }

    save();
    renderOthersTab();
    renderSuppliesSettings();
    refreshSuppliesOverlay();
  }

  function suppliesSlider(label, key, min, max, step, suffix = "") {
    const input = create("input", {
      attrs: { type: "range", min: String(min), max: String(max), step: String(step), value: String(state.supplies[key]) }
    });

    const value = create("div", {
      className: "svalue",
      text: `${state.supplies[key]}${suffix}`,
      attrs: { "data-live": key, "data-suffix": suffix }
    });

    input.addEventListener("input", () => {
      state.supplies[key] = Number(input.value);
      value.textContent = `${state.supplies[key]}${suffix}`;
      save();
      refreshSuppliesOverlay();
    });

    return create("div", {
      className: "srow",
      children: [
        create("div", { className: "slabel", text: label }),
        input,
        value
      ]
    });
  }

  function suppliesAnchorSliders() {
    const s = state.supplies;
    if (s.anchor === "middle") return suppliesSlider("Bottom", "centerBottom", 0, 15, 0.1, "%");
    return create("div", {
      children: [
        suppliesSlider("Right", "rightOffset", 0, 25, 0.1, "%"),
        suppliesSlider("Bottom", "rightBottom", 0, 15, 0.1, "%")
      ]
    });
  }


  // ── FPS / Declust core ───────────────────────────────────
  let fpsDeclustRoot = null;
  function fpsAppRoot() { return fpsDeclustRoot || (fpsDeclustRoot = document.querySelector("#app-root")); }
  const isObj = (v) => v && typeof v === "object";
  const isSkip = (v) => v === window || v === document || v instanceof Node;
  const protoMeta = new WeakMap();
  const protoSearch = new WeakMap();
  const stringCache = new WeakMap();

  function getComponent(obj, name) {
    return name === undefined
      ? Object.values(obj)[0]
      : (Object.values(obj).find(
          (v) => v?.constructor?.$metadata$?.simpleName === name,
        ) ?? null);
  }

  function getAllComponents(obj, name) {
    if (!obj) return [];
    if (name === undefined) return Object.values(obj);
    return Object.values(obj).filter(
      (v) => v?.constructor?.$metadata$?.simpleName === name,
    );
  }

  function getProto(proto) {
    let meta = protoMeta.get(proto);
    if (meta) return meta;
    const names = [];
    const bodies = [];
    const keys = Object.getOwnPropertyNames(proto);
    for (let i = 0; i < keys.length; i++) {
      const v = proto[keys[i]];
      if (typeof v === "function") {
        names.push(v.name || "");
        bodies.push("");
      }
    }
    meta = { names, bodies, keys };
    protoMeta.set(proto, meta);
    return meta;
  }

  function getFunction(target, pattern, depth = 1, all = false) {
    if (!isObj(target)) return all ? [] : null;
    const src = pattern instanceof RegExp ? pattern.source : String(pattern);
    const re = pattern instanceof RegExp ? pattern : new RegExp(src, "i");
    const queue = [{ o: target, d: 0 }];
    const seen = new WeakSet([target]);
    const results = [];
    for (let i = 0; i < queue.length; i++) {
      const { o, d } = queue[i];
      if (!isObj(o) || isSkip(o) || (depth !== -1 && d > depth)) continue;
      const proto = Object.getPrototypeOf(o);
      if (proto) {
        let cache = protoSearch.get(proto);
        if (!cache) protoSearch.set(proto, (cache = new Map()));
        let hit = cache.get(src);
        if (hit === undefined) {
          hit = false;
          const meta = getProto(proto);
          for (let j = 0; j < meta.names.length; j++) {
            if (re.test(meta.names[j])) {
              hit = true;
              break;
            }
          }
          if (!hit)
            for (let j = 0; j < meta.keys.length; j++) {
              const fn = proto[meta.keys[j]];
              if (typeof fn === "function") {
                const body = (meta.bodies[j] ||=
                  Function.prototype.toString.call(fn));
                if (re.test(body)) {
                  hit = true;
                  break;
                }
              }
            }
          cache.set(src, hit);
        }
        if (hit) {
          if (!all) return o;
          results.push(o);
        }
      }
      if (depth === -1 || d < depth) {
        const keys = Object.keys(o);
        for (let j = 0; j < keys.length; j++) {
          const child = o[keys[j]];
          if (isObj(child) && !seen.has(child)) {
            seen.add(child);
            queue.push({ o: child, d: d + 1 });
          }
        }
      }
    }
    return all ? results : results[0] || null;
  }

  function getByString(target, key, depth = 1) {
    if (!isObj(target)) return null;
    let cache = stringCache.get(target);
    if (!cache) stringCache.set(target, (cache = new Map()));
    const ck = key + "|" + depth;
    if (cache.has(ck)) return cache.get(ck);
    const queue = [{ o: target, d: 0 }];
    const seen = new WeakSet([target]);
    for (let i = 0; i < queue.length; i++) {
      const { o, d } = queue[i];
      if (d > depth) continue;
      const keys = Object.keys(o);
      for (let j = 0; j < keys.length; j++) {
        const k = keys[j];
        if (k === "constructor" || k === "$imask$") continue;
        const v = o[k];
        if (k === key || v === key) {
          cache.set(ck, o);
          return o;
        }
        if (isObj(v) && d < depth && !seen.has(v)) {
          seen.add(v);
          queue.push({ o: v, d: d + 1 });
        }
      }
    }
    cache.set(ck, null);
    return null;
  }

  const NativeList = (obj) => {
    if (!obj) return;
    const vals = Object.values(obj);
    const wrap = vals.find(
      (v) =>
        v &&
        typeof v === "object" &&
        Array.isArray(Object.values(v || {})[0]),
    );
    const list = wrap ? Object.values(wrap)[0] : undefined;
    if (list) return list;
  };

  function Threads() {
    const c = getComponent(fpsAppRoot());
    if (!c) return;
    const flat = Object.values(c)
      .flatMap((v) => (v && typeof v === "object" ? Object.values(v) : []))
      .flatMap((v) => (v && typeof v === "object" ? Object.values(v) : []))
      .filter((v) => v && typeof v === "object");
    const target = getFunction(flat, "rubiesForPurchase", 1);
    if (!target) return;
    const arr = ["", "", ""].reduce(getComponent, target)?.toArray();
    if (!arr) return;
    const candidates = getFunction(
      arr,
      "BattleEntity.createComponent duplicate component class ",
      2,
      true,
    );
    if (!Array.isArray(candidates)) return;
    for (const cand of candidates) {
      const list = NativeList(cand);
      if (list && list.length) return cand;
    }
  }

  function World() {
    const t = Threads();
    if (!t) return;
    return getFunction(
      t,
      "World.addGameEffect cannot add effect during update.",
      2,
    );
  }

  function WorldMaps(name) {
    const w = World();
    if (!w) return;
    const map = Object.values(getFunction(w, " = ", 2))[0];
    if (!map) return;
    const entry = map.get?.(name);
    if (!entry) return;
    const internal = getComponent(entry, "InternalHashMap");
    if (!internal) return;
    for (const v of Object.values(internal)) {
      if (Array.isArray(v) && v.length && typeof v[0] === "object") return v;
    }
  }

  function LocalTank() {
    const m = WorldMaps("LocalTank");
    if (!m) return;
    const wrap = getFunction(
      m,
      "BattleEntity.createComponent duplicate component class ",
      1,
    );
    if (!wrap) return;
    const inner = Object.values(wrap).find((v) =>
      Array.isArray(Object.values(v)[0]),
    );
    return inner ? Object.values(inner)[0] : undefined;
  }

  function GameMode() {
    const m = WorldMaps("GameMode");
    if (!m) return;
    const wrap = getFunction(
      m,
      "BattleEntity.createComponent duplicate component class ",
      1,
    );
    if (!wrap) return;
    const inner = Object.values(wrap).find((v) =>
      Array.isArray(Object.values(v)[0]),
    );
    return inner ? Object.values(inner)[0] : undefined;
  }

  const GameComponents = {
    getCurrentTeam(tank) {
      if (!tank) return null;
      if (getByString(tank, "TEAM_A", 2)) return "TEAM_A";
      if (getByString(tank, "TEAM_B", 2)) return "TEAM_B";
      return null;
    },
  };

  // Instantly removes ALL mines
  // ally === remove friendly mines
  // ally === remove enemy mines
  function Mines(ally) {
    const mode = GameMode();
    if (!mode) return;
    const myTeam = GameComponents.getCurrentTeam(LocalTank());
    if (!myTeam) return;
    const root = getFunction(mode, "putInitialMines", 1);
    if (!root) return;
    const maps = getAllComponents(root, "HashMap");
    if (!maps) return;

    for (const m of maps) {
      const internal = getComponent(m, "InternalHashMap");
      if (!internal) continue;
      const flat = Object.values(internal).flatMap((v) => Object.values(v || {}));
      const lists = getAllComponents(flat, "ArrayList");
      if (!lists) continue;

      lists.forEach((list) => {
        const arr = list?.toArray();
        if (!arr) return;
        arr.forEach((ent) => {
          let tank = null;
          for (const k in ent) {
            const v = ent[k];
            if (v && Array.isArray(Object.values(v)?.[0])) {
              tank = Object.values(v)[0];
              break;
            }
          }
          if (!tank) return;

          const stateComp = getFunction(tank, "StateComponent", 1);
          if (!stateComp) return;
          const team = Object.values(stateComp)
            .flatMap((v) => (v && typeof v === "object" ? Object.values(v) : []))
            .find((v) => typeof v === "string" && v.startsWith("TEAM_"));
          const isAlly = team === myTeam;
          if ((ally && !isAlly) || (!ally && isAlly)) return;

          const eqHolder = getFunction(ent, " = ");
          if (!eqHolder) return;
          const inner = Object.values(eqHolder)?.[0];
          if (!inner || typeof inner.values !== "function") return;
          for (const layer of inner.values()) {
            if (!layer || typeof layer !== "object") continue;
            let arr2 = null;
            for (const k in layer) {
              const v = layer[k];
              if (v && Array.isArray(Object.values(v)?.[0])) {
                arr2 = Object.values(v)[0];
                break;
              }
            }
            if (!arr2) continue;
            for (const item of arr2) {
              if (!item || typeof item !== "object") continue;
              for (const k in item) {
                const fn = item[k];
                if (fn?.callableName === "deactivateMine") {
                  try { fn(); } catch {}
                  break;
                }
              }
            }
          }
        });
      });
    }
  }

  // Removes layered (stacked) mines
  // position and deactivates duplicates.
  // ally === remove friendly stacked mines
  // ally === remove enemy stacked mines
  function Decluster(ally) {
    const mode = GameMode();
    if (!mode) return;
    const myTeam = GameComponents.getCurrentTeam(LocalTank());
    if (!myTeam) return;
    const root = getFunction(mode, "putInitialMines", 1);
    if (!root) return;
    const maps = getAllComponents(root, "HashMap");
    if (!maps) return;

    const seen = new Map();
    const key = (x, y, z) =>
      (+x).toFixed(4) + "|" + (+y).toFixed(4) + "|" + (+z).toFixed(4);

    for (const m of maps) {
      const internal = getComponent(m, "InternalHashMap");
      if (!internal) continue;
      const flat = Object.values(internal).flatMap((v) => Object.values(v || {}));
      const lists = getAllComponents(flat, "ArrayList");
      if (!lists) continue;

      for (const list of lists) {
        const arr = list?.toArray();
        if (!arr) continue;
        for (const ent of arr) {
          let tank = null;
          for (const k in ent) {
            const v = ent[k];
            if (v && Array.isArray(Object.values(v)?.[0])) {
              tank = Object.values(v)[0];
              break;
            }
          }
          if (!tank) continue;

          const stateComp = getFunction(tank, "StateComponent", 1);
          if (!stateComp) continue;
          const team = Object.values(stateComp)
            .flatMap((v) => (v && typeof v === "object" ? Object.values(v) : []))
            .find((v) => typeof v === "string" && v.startsWith("TEAM_"));
          const isAlly = team === myTeam;
          if ((ally && !isAlly) || (!ally && isAlly)) continue;

          const stateComp2 = getFunction(tank, "stateComponent");
          if (!stateComp2) continue;
          const vec = getFunction(stateComp2, "Vector3");
          if (!vec || typeof vec !== "object") continue;
          const xyz = Object.values(vec);
          if (xyz.length < 3) continue;
          const posKey = key(xyz[0], xyz[2], xyz[1]);

          if (seen.has(posKey)) {
            const eqHolder = getFunction(ent, " = ");
            if (!eqHolder) continue;
            const inner = Object.values(eqHolder)?.[0];
            if (!inner || typeof inner.values !== "function") continue;
            for (const layer of inner.values()) {
              if (!layer || typeof layer !== "object") continue;
              let arr2 = null;
              for (const k in layer) {
                const v = layer[k];
                if (v && Array.isArray(Object.values(v)?.[0])) {
                  arr2 = Object.values(v)[0];
                  break;
                }
              }
              if (!arr2) continue;
              for (const item of arr2) {
                if (!item || typeof item !== "object") continue;
                for (const k in item) {
                  const fn = item[k];
                  if (fn?.callableName === "deactivateMine") {
                    try { fn(); } catch {}
                    break;
                  }
                }
              }
            }
          } else {
            seen.set(posKey, true);
          }
        }
      }
    }
  }

  function runFPSDecluster(ally) { return Decluster(ally); }

  function runFPSBoth() {
    try { Decluster(true); } catch {}
    try { Decluster(false); } catch {}
  }

  function closeFPSSettings() {
    if (!state.fps) return;
    state.fps.settingsOpen = false;
    save();
    renderFPSSettings();
  }

  function setFPSHotkey(key, code) {
    state.hotkeys[key] = normalizeHotkeyCode(code || "");
    save();
    renderFPSSettings();
  }

  function makeFPSHotkeyRow(key, name, desc) {
    const row = create("div", {
      style: `
        display:grid;
        grid-template-columns: 1fr auto;
        align-items:center;
        gap:14px;
        padding:14px 0;
        border-bottom:1px solid rgba(255,255,255,.07);
      `
    });

    const left = create("div", {
      children: [
        create("div", {
          text: name,
          style: "font-size:14px;font-weight:950;color:var(--text);letter-spacing:.2px;"
        }),
        create("div", {
          text: desc,
          style: "margin-top:4px;font-size:11px;font-weight:800;opacity:.55;color:var(--text);line-height:1.25;"
        })
      ]
    });

    const bindBtn = create("div", {
      attrs: { role: "button", tabindex: "0" },
      text: keyLabel(state.hotkeys[key]) || "Bind",
      style: `
        min-width:104px;
        height:36px;
        display:grid;
        place-items:center;
        border-radius:12px;
        border:1px solid color-mix(in srgb, var(--accent) 38%, rgba(255,255,255,.14));
        background:linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.035));
        color:var(--text);
        cursor:pointer;
        font-weight:950;
        font-size:13px;
        user-select:none;
      `
    });

    const clear = create("div", {
      attrs: { role: "button", tabindex: "0" },
      text: "Clear",
      style: `
        min-width:70px;
        height:36px;
        display:grid;
        place-items:center;
        border-radius:12px;
        border:1px solid rgba(255,255,255,.12);
        background:rgba(255,255,255,.045);
        color:var(--text);
        cursor:pointer;
        font-weight:900;
        font-size:12px;
        opacity:.82;
        user-select:none;
      `
    });

    let listening = false;
    const stop = () => {
      listening = false;
      bindBtn.textContent = keyLabel(state.hotkeys[key]) || "Bind";
      bindBtn.style.boxShadow = "none";
      window.removeEventListener("keydown", down, true);
      window.removeEventListener("keyup", up, true);
      window.removeEventListener("pointerdown", outside, true);
      window.removeEventListener("contextmenu", cancel, true);
    };
    const isModifier = (code) =>
      code === "ShiftLeft" || code === "ShiftRight" ||
      code === "ControlLeft" || code === "ControlRight" ||
      code === "AltLeft" || code === "AltRight" ||
      code === "MetaLeft" || code === "MetaRight";
    const down = (e) => {
      if (!listening) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.code === "Escape") { stop(); return; }
      if (isModifier(e.code)) return;
    };
    const up = (e) => {
      if (!listening) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.code === "Escape") { stop(); return; }
      if (isModifier(e.code)) return;
      setFPSHotkey(key, e.code);
      stop();
    };
    const outside = (e) => {
      if (!listening) return;
      if (e.target === bindBtn || bindBtn.contains(e.target)) return;
      stop();
    };
    const cancel = (e) => {
      if (!listening) return;
      e.preventDefault();
      e.stopPropagation();
      stop();
    };
    const start = () => {
      stop();
      listening = true;
      bindBtn.textContent = "Press key...";
      bindBtn.style.boxShadow = "0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent)";
      window.addEventListener("keydown", down, { capture: true, passive: false });
      window.addEventListener("keyup", up, { capture: true, passive: false });
      window.addEventListener("pointerdown", outside, { capture: true, passive: true });
      window.addEventListener("contextmenu", cancel, { capture: true, passive: false });
      setTimeout(() => { if (listening) stop(); }, 8000);
    };

    bindBtn.addEventListener("click", start);
    bindBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); start(); }
    });
    clear.addEventListener("click", () => setFPSHotkey(key, ""));

    row.append(left, create("div", { style: "display:flex;gap:9px;align-items:center;", children: [bindBtn, clear] }));
    return row;
  }

  function renderFPSSettings() {
    const f = state.fps || (state.fps = { settingsOpen: false });
    if (!f.settingsOpen) {
      if (!state.supplies?.settingsOpen) settingsBox.classList.remove("show");
      return;
    }

    settingsBox.innerHTML = "";
    settingsBox.classList.toggle("show", state.uiVisible && state.menuOpen && f.settingsOpen);
    settingsBox.style.width = "360px";

    const header = create("div", {
      style: `
        height:48px;
        display:flex;
        align-items:center;
        justify-content:center;
        border-bottom:1px solid rgba(255,255,255,.08);
        font-weight:950;
        letter-spacing:.4px;
        color:var(--text);
        background:linear-gradient(180deg, rgba(255,255,255,.045), transparent);
      `,
      text: "FPS Hotkeys"
    });

    const content = create("div", {
      style: `
        padding:16px 22px 18px;
        max-height:455px;
        overflow:auto;
        scrollbar-width:none;
      `
    });

    const hotkeyWrap = create("div", {
      style: `
        border-radius:18px;
        border:1px solid rgba(255,255,255,.09);
        background:rgba(0,0,0,.16);
        padding:0 14px;
      `
    });
    hotkeyWrap.append(
      makeFPSHotkeyRow("fpsFriend", "Friendly mines", "Remove friendly layered mines"),
      makeFPSHotkeyRow("fpsEnemy", "Enemy mines", "Remove enemy layered mines"),
      makeFPSHotkeyRow("fpsBoth", "Both sides", "Remove friendly + enemy layered mines")
    );

    content.append(hotkeyWrap);
    settingsBox.append(header, content);
  }

  function renderSuppliesSettings() {
    const s = state.supplies;
    if (state.fps?.settingsOpen) return;
    settingsBox.innerHTML = "";
    settingsBox.classList.toggle("show", state.uiVisible && state.menuOpen && s.settingsOpen);

    const modeRow = create("div", { className: "modeRow" });
    for (const [id, name] of [["middle", "Middle"], ["right", "Right"]]) {
      const b = create("div", { className: "btn modeBtn", text: name });
      b.classList.toggle("active", s.anchor === id);
      b.addEventListener("click", () => setSuppliesAnchor(id));
      modeRow.appendChild(b);
    }

    const dragBtn = create("div", {
      className: "btn modeBtn dragBtn",
      text: s.drag ? "Dragging ON" : "Drag Position"
    });
    dragBtn.classList.toggle("active", s.drag);
    dragBtn.addEventListener("click", () => {
      s.drag = !s.drag;
      s.settingsOpen = true;
      save();
      renderSuppliesSettings();
      refreshSuppliesOverlay();
    });

    const content = create("div", { className: "settingsContent" });
    content.append(
      modeRow,
      dragBtn,
      suppliesAnchorSliders(),
      suppliesSlider("Width", "width", 5, 45, 0.5, "%"),
      suppliesSlider("Height", "height", 10, 120, 1, "px"),
      suppliesSlider("Blur", "blur", 0, 30, 1, "px"),
      suppliesSlider("Opacity", "opacity", 0, 0.8, 0.01),
      suppliesSlider("Radius", "radius", 0, 35, 1, "px"),
      suppliesSlider("Border", "border", 0, 1, 0.01)
    );

    settingsBox.append(
      create("div", { className: "settingsTitle", text: "Supplies Hider Settings" }),
      content
    );
  }

  function renderOthersTab() {
    modalBody.innerHTML = "";
    modalBody.style.display = "block";
    modalBody.style.alignItems = "";
    modalBody.style.justifyContent = "";
    modalBody.style.overflow = "auto";

    const s = state.supplies;

    const toggle = create("div", { className: "btn toggle", text: s.enabled ? "ON" : "OFF" });
    toggle.classList.toggle("on", s.enabled);
    toggle.addEventListener("click", () => {
      s.enabled = !s.enabled;
      save();
      renderOthersTab();
      refreshSuppliesOverlay();
    });

    const gear = create("div", { className: "btn gear", text: "⚙" });
    gear.addEventListener("click", () => {
      s.settingsOpen = !s.settingsOpen;
      if (state.fps) state.fps.settingsOpen = false;
      save();
      renderOthersTab();
      renderSuppliesSettings();
    });

    const card = create("div", {
      className: "othersCard",
      children: [
        create("div", {
          className: "featureRow",
          children: [
            create("div", { className: "featureName", text: "Supplies Hider" }),
            create("div", { className: "featureControls", children: [toggle, gear] })
          ]
        })
      ]
    });

    const fpsGear = create("div", { className: "btn gear", text: "⚙" });
    fpsGear.addEventListener("click", () => {
      state.fps = state.fps || { settingsOpen: false };
      state.fps.settingsOpen = !state.fps.settingsOpen;
      s.settingsOpen = false;
      s.drag = false;
      save();
      renderOthersTab();
      renderFPSSettings();
      refreshSuppliesOverlay();
    });

    const fpsCard = create("div", {
      className: "othersCard",
      style: "margin-top:12px;",
      children: [
        create("div", {
          className: "featureRow",
          children: [
            create("div", { className: "featureName", text: "FPS" }),
            create("div", { className: "featureControls", children: [fpsGear] })
          ]
        })
      ]
    });

    modalBody.append(card, fpsCard);
    if (state.fps?.settingsOpen) renderFPSSettings();
    else renderSuppliesSettings();
  }

  function closeSuppliesExtras() {
    if (state.supplies) {
      state.supplies.settingsOpen = false;
      state.supplies.drag = false;
    }
    if (state.fps) state.fps.settingsOpen = false;
    save();
    refreshSuppliesOverlay();
    renderSuppliesSettings();
    renderFPSSettings();
  }


  // ── Render: Appearance tab ────────────────────────────────
  function renderAppearanceTab() {
    modalBody.innerHTML = "";
    modalBody.style.display = "flex";
    modalBody.style.alignItems = "center";
    modalBody.style.justifyContent = "center";
    modalBody.style.overflow = "hidden";

    const wrap = create("div", { className: "appWrap" });
    const card = create("div", { className: "appCard" });

    const sliders = [
      { key: "brightness", label: "Brightness", min: 0.50, max: 2.00, step: 0.01, fmt: v => v.toFixed(2) },
      { key: "contrast",   label: "Contrast",   min: 0.50, max: 2.00, step: 0.01, fmt: v => v.toFixed(2) },
      { key: "saturation", label: "Saturation", min: 0.00, max: 3.00, step: 0.01, fmt: v => v.toFixed(2) },
      { key: "vibrance",   label: "Vibrance",   min: 0.00, max: 1.00, step: 0.01, fmt: v => v.toFixed(2) },
    ];

    for (const s of sliders) {
      const row = create("div", { className: "appRow" });
      const lbl = create("div", { className: "appLabel", text: s.label });
      const valEl = create("div", { className: "appVal", text: s.fmt(state.appearance[s.key]) });

      const inp = create("input", {
        className: "appRange",
        attrs: {
          type: "range",
          min: String(s.min),
          max: String(s.max),
          step: String(s.step),
          value: String(state.appearance[s.key])
        }
      });

      inp.addEventListener("input", () => {
        const v = clamp(parseFloat(inp.value), s.min, s.max);
        state.appearance[s.key] = v;
        valEl.textContent = s.fmt(v);
        applyAppearanceFilter();
        save();
      });

      row.append(lbl, inp, valEl);
      card.appendChild(row);
    }

    const resetBtn = create("div", { className: "appResetBtn", text: "Reset to default" });
    resetBtn.addEventListener("click", () => {
      state.appearance = { ...DEFAULT_APPEARANCE };
      applyAppearanceFilter();
      save();
      renderAppearanceTab();
    });
    card.appendChild(resetBtn);

    wrap.appendChild(card);
    modalBody.appendChild(wrap);
  }

  // ── Render: Clicker tab ───────────────────────────────────
  function renderClickerTab() {
    modalBody.innerHTML = "";
    modalBody.style.display = "flex";
    modalBody.style.alignItems = "center";
    modalBody.style.justifyContent = "center";
    modalBody.style.overflow = "hidden";

    const wrap = create("div", { className: "clickerWrap" });
    const card = create("div", { className: "clickerCard" });
    const top = create("div", { className: "clickerTop" });
    const iconRow = create("div", { className: "iconRow" });

    const refreshIcons = () => {
      for (const btn of iconRow.querySelectorAll(".sIcon")) {
        const type = btn.dataset.type;
        const on = !!state.clicker.pick[type];
        btn.classList.toggle("on", on);
        btn.classList.toggle("off", !on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      }
    };

    for (const it of SUPPLY_ICONS) {
      const btn = create("div", {
        className: "sIcon",
        dataset: { type: it.type },
        attrs: { role: "button", tabindex: "0", "aria-pressed": "true", title: it.type }
      });
      btn.appendChild(create("img", { attrs: { src: it.cn, alt: it.type } }));

      const toggle = () => {
        state.clicker.pick[it.type] = !state.clicker.pick[it.type];
        refreshIcons();
        save();
      };

      btn.addEventListener("click", toggle);
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });

      iconRow.appendChild(btn);
    }

    const fields = create("div", { className: "fields" });

    const makeField = (valueGetter, valueSetter, unitText, min = 1, max = 999999, onAfter) => {
      const box = create("div", { className: "field" });
      const inpWrap = create("div", { className: "inpWrap" });

      const inp = create("input", {
        className: "num",
        attrs: { type: "text", inputmode: "numeric", pattern: "[0-9]*", value: String(valueGetter()) }
      });
      const unit = create("div", { className: "unit", text: unitText });

      const commitValue = (fallbackToCurrent = true) => {
        const raw = String(inp.value || "").replace(/[^\d]/g, "");
        let v = parseInt(raw, 10);

        if (!Number.isFinite(v)) {
          v = fallbackToCurrent ? valueGetter() : min;
        }

        v = clamp(v, min, max);
        inp.value = String(v);
        valueSetter(v);
        if (typeof onAfter === "function") onAfter();
        save();
      };

      const stopKeys = (e) => { e.stopPropagation(); };
      inp.addEventListener("keydown", stopKeys, true);
      inp.addEventListener("keyup", stopKeys, true);
      inp.addEventListener("keypress", stopKeys, true);

      inp.addEventListener("input", () => {
        const cleaned = String(inp.value || "").replace(/[^\d]/g, "");
        if (cleaned !== inp.value) inp.value = cleaned;

        if (inp.value === "") return;

        let v = parseInt(inp.value, 10);
        if (!Number.isFinite(v)) return;
        v = clamp(v, min, max);
        valueSetter(v);
        if (typeof onAfter === "function") onAfter();
        save();
      });

      inp.addEventListener("blur", () => {
        if (String(inp.value || "").trim() === "") {
          inp.value = String(valueGetter());
          return;
        }
        commitValue(true);
      });

      box.addEventListener("pointerdown", (e) => {
        if (e.target === inp) return;
        e.preventDefault();
        inp.focus();
        inp.select?.();
      });
      unit.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        inp.focus();
        inp.select?.();
      });

      inpWrap.append(inp, unit);
      box.appendChild(inpWrap);
      return box;
    };

    fields.append(
      makeField(
        () => state.clicker.mineDelay,
        (v) => { state.clicker.mineDelay = v; },
        "ms",
        1,
        200,
        restartMineLoop
      )
    );

    top.appendChild(iconRow);
    card.appendChild(top);
    card.appendChild(fields);
    wrap.appendChild(card);
    modalBody.appendChild(wrap);

    refreshIcons();
    return { refreshToggles: null };
  }

  // ── Render: Hotkeys tab ───────────────────────────────────
/* ===================== LIST TAB ===================== */
const LIST_KEYS = {
  friends: "tankiFriends",
  enemies: "tankiEnemies",
  friendClans: "tankiFriendClans",
  enemyClans: "tankiEnemyClans",
};

const normalizeBase = (v) => {
  if (!v) return "";
  try {
    return String(v)
      .normalize("NFKD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  } catch {
    return String(v).toLowerCase().replace(/\s+/g, " ").trim();
  }
};
const normalizeNick = (raw) => normalizeBase(String(raw || "").replace(/\[[^\]]+\]/g, ""));
const normalizeClan = (raw) => normalizeBase(raw);

const hasGM = (typeof GM_getValue === "function") && (typeof GM_setValue === "function");

function readRaw(key) {
  try {
    if (hasGM) {
      const v = GM_getValue(key, null);
      if (v != null && v !== "") return String(v);

      const ls = localStorage.getItem(key);
      if (ls != null && ls !== "") {
        try { GM_setValue(key, String(ls)); } catch {}
        return String(ls);
      }
      return "";
    }
    return localStorage.getItem(key) || "";
  } catch {
    return localStorage.getItem(key) || "";
  }
}

function writeRaw(key, value) {
  const s = String(value ?? "");
  try { localStorage.setItem(key, s); } catch {}
  try { if (hasGM) GM_setValue(key, s); } catch {}
}

const readJsonArray = (key) => {
  try {
    const raw = readRaw(key) || "[]";
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.map(x => String(x).trim()).filter(Boolean) : [];
  } catch {
    return [];
  }
};
const writeJsonArray = (key, arr) => {
  try { writeRaw(key, JSON.stringify(arr)); } catch {}
};


let friends = readJsonArray(LIST_KEYS.friends);
let enemies = readJsonArray(LIST_KEYS.enemies);
let friendClans = readJsonArray(LIST_KEYS.friendClans);
let enemyClans = readJsonArray(LIST_KEYS.enemyClans);

let nFriends = new Set();
let nEnemies = new Set();
let nFriendClans = new Set();
let nEnemyClans = new Set();

function rebuildCaches() {
  nFriends = new Set(friends.map(normalizeNick));
  nEnemies = new Set(enemies.map(normalizeNick));
  nFriendClans = new Set(friendClans.map(normalizeClan));
  nEnemyClans = new Set(enemyClans.map(normalizeClan));
}
rebuildCaches();

function refreshListsFromStorage() {
  friends = readJsonArray(LIST_KEYS.friends);
  enemies = readJsonArray(LIST_KEYS.enemies);
  friendClans = readJsonArray(LIST_KEYS.friendClans);
  enemyClans = readJsonArray(LIST_KEYS.enemyClans);
  rebuildCaches();
}

function addUniqueCaseInsensitive(arr, value) {
  const low = normalizeBase(value);
  if (!low) return false;
  if (arr.some(x => normalizeBase(x) === low)) return false;
  arr.push(value);
  return true;
}

function extractClanFromText(raw) {
  const m = /\[([^\]]+)\]/.exec(String(raw || ""));
  return m ? normalizeClan(m[1]) : null;
}

function classifyNick(rawText) {
  const nickNorm = normalizeNick(rawText);
  if (!nickNorm) return null;
  const clan = extractClanFromText(rawText);
  if (nFriends.has(nickNorm) || (clan && nFriendClans.has(clan))) return "friend";
  if (nEnemies.has(nickNorm) || (clan && nEnemyClans.has(clan))) return "enemy";
  return null;
}

function clearNickClass(el) {
  el.classList.remove("lukas-friend-nick", "lukas-enemy-nick");
}
function applyNickClass(el, kind) {
  clearNickClass(el);
  if (kind === "friend") el.classList.add("lukas-friend-nick");
  else if (kind === "enemy") el.classList.add("lukas-enemy-nick");
}

const HL = {
  rafPending: false,
  battleRoots: [
    ".BattleTabStatisticComponentStyle-containerInsideTeams",
    ".BattleTabStatisticComponentStyle-dmTableContainer",
    ".BattleTabStatisticComponentStyle-containerInsideResults",
  ],
  lobbyRoots: [
    "[class*=\"UsersTable\"]",
    ".UsersTableStyle-containerBattleListCommands",
    ".UsersTableStyle-scrollCommandTable",
    "[class*=\"PlayersList\"]",
    "[class*=\"Lobby\"]",
    "[class*=\"Matchmaking\"]",
  ],
  nickSelectors: [
    ".UsersTableStyle-scrollCommandTable td span",
    ".UsersTableStyle-scrollCommandTable td div span",
    ".BattleTabStatisticComponentStyle-nicknameCell span",
    "span[class*=\"nickname\"]",
    "span[class*=\"userName\"]",
    "span[class*=\"name\"]",
    "div[class*=\"name\"] span",
  ],
};

function scanWithin(rootEl) {
  if (!rootEl) return;
  const nodes = rootEl.querySelectorAll(HL.nickSelectors.join(","));
  nodes.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    const text = (el.textContent || "").trim();
    if (!text || text.length > 64) return;
    const kind = classifyNick(text);
    if (kind) applyNickClass(el, kind);
    else clearNickClass(el);
  });
}

function updateNickHighlightsNow() {
  HL.rafPending = false;
  refreshListsFromStorage();
  HL.battleRoots.forEach(sel => document.querySelectorAll(sel).forEach(scanWithin));
  HL.lobbyRoots.forEach(sel => document.querySelectorAll(sel).forEach(scanWithin));
}

function scheduleNickHighlights() {
  if (HL.rafPending) return;
  HL.rafPending = true;
  requestAnimationFrame(() => {
    updateNickHighlightsNow();

    setTimeout(() => { try { updateNickHighlightsNow(); } catch {} }, 260);
  });
}


(function startHighlightObserver(){
  try {
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.addedNodes && m.addedNodes.length) { scheduleNickHighlights(); return; }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  } catch {}
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") scheduleNickHighlights();
  }, { passive: true });
  scheduleNickHighlights();
})();

// If lists change, refresh highlights instantly
(function hookStorageForHighlights(){
  const _set = localStorage.setItem.bind(localStorage);
  const _rem = localStorage.removeItem.bind(localStorage);

  localStorage.setItem = function(k, v){
    _set(k, v);
    if (k === LIST_KEYS.friends || k === LIST_KEYS.enemies || k === LIST_KEYS.friendClans || k === LIST_KEYS.enemyClans) {
      scheduleNickHighlights();
    }
  };
  localStorage.removeItem = function(k){
    _rem(k);
    if (k === LIST_KEYS.friends || k === LIST_KEYS.enemies || k === LIST_KEYS.friendClans || k === LIST_KEYS.enemyClans) {
      scheduleNickHighlights();
    }
  };
  window.addEventListener("storage", (e) => {
    if (!e || !e.key) return;
    if (e.key === LIST_KEYS.friends || e.key === LIST_KEYS.enemies || e.key === LIST_KEYS.friendClans || e.key === LIST_KEYS.enemyClans) {
      scheduleNickHighlights();
    }
  });
})();

function renderListTab() {
  modalBody.innerHTML = "";

  const wrap = create("div", { className: "listWrap" });

  const top = create("div", { className: "listTop" });

  const searchWrap = create("div", { className: "listSearch" });
  const search = create("input", {
    attrs: { type: "text", placeholder: "Filter (nickname or clan)…", autocomplete: "off" }
  });
  searchWrap.appendChild(search);

  const tabs = [
    { id: "friends", label: "Friends", placeholder: "Add friend nickname" },
    { id: "enemies", label: "Enemy", placeholder: "Add enemy nickname" },
    { id: "friendClans", label: "Friend clan", placeholder: "Add friend clan tag (without brackets)" },
    { id: "enemyClans", label: "Enemy clan", placeholder: "Add enemy clan tag (without brackets)" },
  ];

  const tabsRow = create("div", { className: "listTabs" });
  const tabsBar = create("div", { className: "listTabsBar" });
  const tabBtns = new Map();

  let active = (state.listActive && tabs.some(t => t.id === state.listActive)) ? state.listActive : "friends";

  const card = create("div", { className: "listCard" });
  const row = create("div", { className: "listRow" });
  const input = create("input", { attrs: { type: "text", autocomplete: "off", placeholder: "" } });
  const addBtn = create("div", { className: "listBtn", attrs: { role: "button", tabindex: "0" }, text: "Add" });
  row.append(input, addBtn);

  const pillBox = create("div", { className: "pillBox" });

  // Export / Import + Help
  const exportBtn = create("div", { className: "listBtn secondary", attrs: { role: "button", tabindex: "0" }, text: "Export" });
  const importBtn = create("div", { className: "listBtn secondary", attrs: { role: "button", tabindex: "0" }, text: "Import" });

  tabsBar.append(tabsRow);

  const status = create("div", { className: "listStatus", text: "" });

  const importBox = create("div", { className: "importBox" });
  const importArea = create("textarea", { attrs: { placeholder: "Paste backup code here… (Export → copied)" } });
  const restoreBtn = create("div", { className: "listBtn", attrs: { role: "button", tabindex: "0" }, text: "Restore" });
  const cancelBtn = create("div", { className: "listBtn secondary", attrs: { role: "button", tabindex: "0" }, text: "Cancel" });
  importBox.append(importArea, restoreBtn, cancelBtn);

  const helpFab = create("div", { className: "helpFab", text: "?" });
  const helpTip = create("div", {
    className: "helpTip",
    html: `

      <b>Export / Import</b><br/>
      Export copies a backup code to your clipboard.<br/>
      Import lets you paste that code to restore your lists.<br/><br/>
      Use it before switching browser/PC, or if you clear site data.<br/><br/>
      If you use Tampermonkey, the script also saves in extension storage — but Export is still the safest.
    `
  });
  helpFab.appendChild(helpTip);

  const actionsInline = create("div", { className: "listActionsInline" });
  actionsInline.append(exportBtn, importBtn, helpFab);

  function setStatus(msg) {
    status.textContent = msg;
    clearTimeout(setStatus._t);
    setStatus._t = setTimeout(() => { status.textContent = ""; }, 4500);
  }

  function utf8ToB64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  function b64ToUtf8(b64) {
    return decodeURIComponent(escape(atob(b64)));
  }

  function makeBackupString() {
    refreshListsFromStorage();
    const data = {
      v: 1,
      friends: [...friends],
      enemies: [...enemies],
      friendClans: [...friendClans],
      enemyClans: [...enemyClans]
    };
    return utf8ToB64(JSON.stringify(data));
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {}
    // fallback
    try {
      const ta = create("textarea", { attrs: { style: "position:fixed;left:-9999px;top:-9999px;" } });
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {}
    return false;
  }

  function mergeIn(targetArr, values) {
    let added = 0;
    for (const v of values) if (addUniqueCaseInsensitive(targetArr, v)) added++;
    return added;
  }

  function restoreFromBackupString(raw) {
    const str = String(raw || "").trim();
    if (!str) throw new Error("Empty backup code.");
    let obj;
    try {
      obj = JSON.parse(b64ToUtf8(str));
    } catch {

      obj = JSON.parse(str);
    }
    const nf = Array.isArray(obj.friends) ? obj.friends : [];
    const ne = Array.isArray(obj.enemies) ? obj.enemies : [];
    const nfc = Array.isArray(obj.friendClans) ? obj.friendClans : [];
    const nec = Array.isArray(obj.enemyClans) ? obj.enemyClans : [];

    refreshListsFromStorage();

    const a1 = mergeIn(friends, nf);
    const a2 = mergeIn(enemies, ne);
    const a3 = mergeIn(friendClans, nfc);
    const a4 = mergeIn(enemyClans, nec);

    writeJsonArray(LIST_KEYS.friends, friends);
    writeJsonArray(LIST_KEYS.enemies, enemies);
    writeJsonArray(LIST_KEYS.friendClans, friendClans);
    writeJsonArray(LIST_KEYS.enemyClans, enemyClans);

    scheduleNickHighlights();
    rebuild();
    return { a1, a2, a3, a4 };
  }

  const onBtnKey = (el, fn) => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); }
    });
  };

  const doExport = async () => {
    const code = makeBackupString();
    const ok = await copyToClipboard(code);
    setStatus(ok ? "Export copied ✅  Paste it in Import on another browser." : "Could not copy automatically — open Import and paste the code manually.");
  };
  const toggleImport = () => {
    const show = !importBox.classList.contains("show");
    importBox.classList.toggle("show", show);
    if (show) {
      importArea.value = "";
      importArea.focus();
      setStatus("Paste backup code → Restore.");
    } else {
      setStatus("");
    }
  };
  const doRestore = () => {
    try {
      const { a1, a2, a3, a4 } = restoreFromBackupString(importArea.value);
      importArea.value = "";
      importBox.classList.remove("show");
      setStatus(`Restored ✅  Added: Friends ${a1}, Enemy ${a2}, Friend clan ${a3}, Enemy clan ${a4}`);
    } catch (e) {
      setStatus("Import failed ❌  Backup code invalid.");
    }
  };

  exportBtn.addEventListener("click", doExport);
  onBtnKey(exportBtn, doExport);
  importBtn.addEventListener("click", toggleImport);
  onBtnKey(importBtn, toggleImport);

  restoreBtn.addEventListener("click", doRestore);
  onBtnKey(restoreBtn, doRestore);
  cancelBtn.addEventListener("click", () => { importBox.classList.remove("show"); setStatus("Import cancelled."); });
  onBtnKey(cancelBtn, () => { importBox.classList.remove("show"); setStatus("Import cancelled."); });

  const getArrFor = (kind) => {
    if (kind === "friends") return friends;
    if (kind === "enemies") return enemies;
    if (kind === "friendClans") return friendClans;
    return enemyClans;
  };
  const getKeyFor = (kind) => {
    if (kind === "friends") return LIST_KEYS.friends;
    if (kind === "enemies") return LIST_KEYS.enemies;
    if (kind === "friendClans") return LIST_KEYS.friendClans;
    return LIST_KEYS.enemyClans;
  };

  const pill = (name, onRemove) => {
    const p = create("div", { className: "pill" });
    p.append(
      create("span", { text: String(name).toUpperCase() }),
      create("span", { className: "x", text: "✖", attrs: { title: "Remove", role: "button", tabindex: "0" } })
    );
    const x = p.querySelector(".x");
    const rm = () => { onRemove(); };
    x.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); rm(); });
    x.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); rm(); } });
    return p;
  };

  const rebuild = () => {
    refreshListsFromStorage();

    const q = normalizeBase(search.value || "");
    pillBox.innerHTML = "";

    const list = getArrFor(active);
    const key = getKeyFor(active);

    list
      .filter(v => !q || normalizeBase(v).includes(q))
      .forEach((v) => {
        pillBox.appendChild(pill(v, () => {
          const arr = getArrFor(active);
          const next = arr.filter(x => normalizeBase(x) !== normalizeBase(v));
          if (active === "friends") friends = next;
          else if (active === "enemies") enemies = next;
          else if (active === "friendClans") friendClans = next;
          else enemyClans = next;
          writeJsonArray(key, next);
          rebuild();
          scheduleNickHighlights();
        }));
      });
  };

  const setActive = (id) => {
    active = id;
    state.listActive = id;
    save();

    for (const t of tabs) tabBtns.get(t.id)?.classList.toggle("active", t.id === id);

    const meta = tabs.find(t => t.id === id);
    input.value = "";
    input.placeholder = meta?.placeholder || "";
    rebuild();
  };

  tabs.forEach((t) => {
    const b = create("div", { className: "listTabBtn", text: t.label, dataset: { id: t.id } });
    tabBtns.set(t.id, b);
    b.addEventListener("click", () => setActive(t.id));
    tabsRow.appendChild(b);
  });

  const doAdd = () => {
    const v = String(input.value || "").trim();
    if (!v) return;

    const arr = getArrFor(active);
    if (addUniqueCaseInsensitive(arr, v)) {
      const key = getKeyFor(active);
      writeJsonArray(key, arr);
      input.value = "";
      rebuild();
      scheduleNickHighlights();
    }
  };

  addBtn.addEventListener("click", doAdd);
  addBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); doAdd(); }
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); doAdd(); }
  });

  search.addEventListener("input", rebuild);

  top.append(tabsBar, searchWrap);
  card.append(row, importBox, pillBox, status);
  tabsBar.appendChild(actionsInline);

  wrap.append(top, card);
  modalBody.appendChild(wrap);

  setActive(active);
}

  function renderClickerTab() {
    modalBody.innerHTML = "";

    const wrap = create("div", { className: "clickerWrap" });
    const card = create("div", { className: "clickerCard" });
    const top = create("div", { className: "clickerTop" });
    const iconRow = create("div", { className: "iconRow" });

    const refreshIcons = () => {
      for (const btn of iconRow.querySelectorAll(".sIcon")) {
        const type = btn.dataset.type;
        const on = !!state.clicker.pick[type];
        btn.classList.toggle("on", on);
        btn.classList.toggle("off", !on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      }
    };

    for (const it of SUPPLY_ICONS) {
      const btn = create("div", {
        className: "sIcon",
        dataset: { type: it.type },
        attrs: { role: "button", tabindex: "0", "aria-pressed": "true", title: it.type }
      });
      btn.appendChild(create("img", { attrs: { src: it.cn, alt: it.type } }));

      const toggle = () => {
        state.clicker.pick[it.type] = !state.clicker.pick[it.type];
        refreshIcons();
        save();
      };

      btn.addEventListener("click", toggle);
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });

      iconRow.appendChild(btn);
    }

    const fields = create("div", { className: "fields" });

    const makeField = (valueGetter, valueSetter, unitText, min = 1, max = 999999, onAfter) => {
      const box = create("div", { className: "field" });
      const inpWrap = create("div", { className: "inpWrap" });

      const inp = create("input", {
        className: "num",
        attrs: { type: "text", inputmode: "numeric", pattern: "[0-9]*", value: String(valueGetter()) }
      });
      const unit = create("div", { className: "unit", text: unitText });


      const commitValue = (fallbackToCurrent = true) => {
        const raw = String(inp.value || "").replace(/[^\d]/g, "");
        let v = parseInt(raw, 10);


        if (!Number.isFinite(v)) {
          v = fallbackToCurrent ? valueGetter() : min;
        }

        v = clamp(v, min, max);
        inp.value = String(v);
        valueSetter(v);
        if (typeof onAfter === "function") onAfter();
        save();
      };

      const stopKeys = (e) => { e.stopPropagation(); };
      inp.addEventListener("keydown", stopKeys, true);
      inp.addEventListener("keyup", stopKeys, true);
      inp.addEventListener("keypress", stopKeys, true);

      inp.addEventListener("input", () => {

        const cleaned = String(inp.value || "").replace(/[^\d]/g, "");
        if (cleaned !== inp.value) inp.value = cleaned;

        if (inp.value === "") {

          return;
        }


        let v = parseInt(inp.value, 10);
        if (!Number.isFinite(v)) return;
        v = clamp(v, min, max);
        valueSetter(v);
        if (typeof onAfter === "function") onAfter();
        save();
      });

      inp.addEventListener("blur", () => {
        if (String(inp.value || "").trim() === "") {

          inp.value = String(valueGetter());
          return;
        }
        commitValue(true);
      });

      box.addEventListener("pointerdown", (e) => {
        if (e.target === inp) return;
        e.preventDefault();
        inp.focus();
        inp.select?.();
      });
      unit.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        inp.focus();
        inp.select?.();
      });

      inpWrap.append(inp, unit);
      box.appendChild(inpWrap);
      return box;
    };

    fields.append(
      makeField(
        () => state.clicker.mineDelay,
        (v) => { state.clicker.mineDelay = v; },
        "ms",
        1,
        200,
        restartMineLoop
      )
    );

    top.appendChild(iconRow);
    card.appendChild(top);
    card.appendChild(fields);
    wrap.appendChild(card);
    modalBody.appendChild(wrap);

    refreshIcons();
    return { refreshToggles: null };
  }

  // ✅ HOTKEYS

  function renderHotkeysTab() {
    modalBody.innerHTML = "";
    modalBody.style.display = "block";
    modalBody.style.alignItems = "";
    modalBody.style.justifyContent = "";
    modalBody.style.overflow = "auto";

    const wrap = create("div", { className: "hkWrap" });

    const rows = [
      { key: "ui", name: "Toggle UI", desc: "Show / hide the UI panel" },
      { key: "sup", name: "Supplies toggle", desc: "Turn supplies clicker ON/OFF" },
      { key: "mine", name: "Mine toggle", desc: "Turn mine clicker ON/OFF" },
    ];

    let listeningKey = null;

    const stopListening = () => {
      listeningKey = null;
      for (const b of wrap.querySelectorAll(".hkBtn")) b.classList.remove("listening");
      window.removeEventListener("keydown", onKeyDownCapture, { capture: true });
      window.removeEventListener("keyup", onKeyUpCapture, { capture: true });
      window.removeEventListener("pointerdown", onOutsidePointerDown, { capture: true });
      window.removeEventListener("contextmenu", onContextCancel, { capture: true });
    };

    const onOutsidePointerDown = (e) => {
      if (!listeningKey) return;
      const inside = e.target && e.target.closest && e.target.closest(`#${ROOT_ID} .hkRow, #${ROOT_ID} .hkBtn`);
      if (!inside) stopListening();
    };

    const onContextCancel = (e) => {
      if (!listeningKey) return;
      e.preventDefault();
      e.stopPropagation();
      stopListening();
    };

    const isModifier = (code) =>
      code === "ShiftLeft" || code === "ShiftRight" ||
      code === "ControlLeft" || code === "ControlRight" ||
      code === "AltLeft" || code === "AltRight" ||
      code === "MetaLeft" || code === "MetaRight";

    const onKeyDownCapture = (e) => {
      if (!listeningKey) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.code === "Escape") { stopListening(); return; }
      if (isModifier(e.code)) return;
    };

    const onKeyUpCapture = (e) => {
      if (!listeningKey) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.code === "Escape") { stopListening(); return; }
      if (isModifier(e.code)) return;

      state.hotkeys[listeningKey] = normalizeHotkeyCode(e.code);
      save();
      renderTabContent("hotkeys");
      stopListening();
    };

    const startListening = (k, btn) => {
      stopListening();
      listeningKey = k;
      btn.classList.add("listening");

      window.addEventListener("keydown", onKeyDownCapture, { capture: true, passive: false });
      window.addEventListener("keyup", onKeyUpCapture, { capture: true, passive: false });
      window.addEventListener("pointerdown", onOutsidePointerDown, { capture: true, passive: true });
      window.addEventListener("contextmenu", onContextCancel, { capture: true, passive: false });

      setTimeout(() => {
        if (listeningKey === k) stopListening();
      }, 8000);
    };

    for (const r of rows) {
      const row = create("div", { className: "hkRow" });
      const left = create("div", { className: "hkLeft" });
      left.style.alignSelf = "flex-start";
      left.style.paddingTop = "4px";
      left.append(
        create("div", { className: "hkName", text: r.name }),
        create("div", { className: "hkDesc", text: r.desc })
      );

      const btn = create("div", {
        className: "hkBtn",
        attrs: { role: "button", tabindex: "0" },
        text: keyLabel(state.hotkeys[r.key]) || "Unbound"
      });

      const click = () => startListening(r.key, btn);
      btn.addEventListener("click", click);
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); click(); }
        if (e.key === "Escape") { e.preventDefault(); }
      });

      row.append(left, btn);
      wrap.appendChild(row);
    }

    const reset = create("div", {
      className: "hkBtn hkReset",
      text: "Reset to default",
      style: "margin-top:6px;"
    });
    reset.addEventListener("click", () => {
      state.hotkeys = { ...DEFAULT_HOTKEYS };
      save();
      renderTabContent("hotkeys");
    });
    wrap.appendChild(reset);

    modalBody.appendChild(wrap);

    modalBody._cleanupHotkeys = () => { stopListening(); };
  }



  // ── Background tab / Safe background engine ─────────────────
  const bgState = {
    variableHeader: null,
    gradient: null,
    holoCanvas: null,
    spaceCanvas: null,
    customStyle: null,
    holoDrops: [],
    spaceDrops: [],
    holoN: 0,
    spaceN: 0,
    currentMode: 0,
    holoRunning: false,
    spaceRunning: false,
    observerStarted: false
  };

  function readyBg(fn) {
    if (document.body) fn();
    else document.addEventListener("DOMContentLoaded", fn, { once: true });
  }

  function addBackgroundBaseStyle() {
    if (document.getElementById(BG_STYLE_ID)) return;
    const st = document.createElement("style");
    st.id = BG_STYLE_ID;
    st.textContent = `
      html, body { background: rgb(0,0,0) !important; }
      #root,
      #app-root,
      .wrapper,
      .BattleComponentStyle-canvasContainer,
      .BattleComponentStyle-canvasContainer > .-container,
      .-container,
      .-entranceBackground,
      .-entranceGradient,
      .-background,
      .-changingBackground { background: transparent !important; }
      div[style*="rgba(0, 25, 38"],
      div[style*="0, 25, 38"],
      div[style*="linear-gradient(rgba(0, 25, 38"] {
        display:none !important;
        opacity:0 !important;
        visibility:hidden !important;
        pointer-events:none !important;
      }
      body.tbg-menu-bg-active .BattleComponentStyle-canvasContainer > canvas:not(#tankPreviewCanvas) {
        opacity:0 !important;
        visibility:hidden !important;
      }
      body.tbg-menu-bg-active .BattleComponentStyle-canvasContainer > .-container {
        position:relative !important;
        z-index:5 !important;
      }
      #${BG_LAYER_ID} {
        position:fixed;
        inset:0;
        display:flex;
        justify-content:center;
        z-index:0;
        pointer-events:none;
        overflow:hidden;
      }
      .obscDOMElement-svgGradient {
        position:fixed;
        inset:0;
        width:100%;
        height:100%;
        background:radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,.15) 60%, rgba(0,0,0,.75) 88%, rgb(0,0,0) 100%);
        z-index:0;
        pointer-events:none;
        opacity:1;
      }
      .obscDOMElement-spaceCanvas {
        position:fixed;
        top:0;
        left:0;
        z-index:-1;
        pointer-events:none;
        transform:rotate(180deg);
      }
      .obscDOMElement-holoCanvas {
        position:fixed;
        top:0;
        left:0;
        z-index:-1;
        pointer-events:none;
      }
      .tbg-hidden { visibility:collapse !important; }
    `;
    document.documentElement.appendChild(st);
  }


  // ── Element / Killboard styling from testing script ─────────
  function styleKillboardElements() {
    const bodies = document.querySelectorAll(".BattleKillBoardComponentStyle-tableContainer table > tbody");

    for (const tbody of bodies) {
      const rows = Array.from(tbody.querySelectorAll(":scope > tr"));
      if (!rows.length) continue;

      const isPlayerRow = (tr) => !!tr.querySelector("td, th") && !!String(tr.textContent || "").trim();
      const playerRows = rows.filter(isPlayerRow);
      if (!playerRows.length) continue;

      // IMPORTANT FIX:
      // The old merged code treated the first empty spacer after yourself as "teamRowSpace".
      // In the real killboard there is a rowSpace after EVERY player, so that moved all teammates
      // to the enemy/right column and left only self on the left.
      // Now we only use a real existing teamRowSpace, otherwise we split player rows by team count.
      const existingTeamSplitIndex = rows.findIndex(r => r.id === "teamRowSpace");
      const hasRealTeamSplit = existingTeamSplitIndex !== -1;

      // Team battle fallback: result table has two sides but the spacer ids were lost during merge.
      // Split players into two halves instead of switching after the first spacer.
      const looksTeamBattle =
        hasRealTeamSplit ||
        !!document.querySelector(".BattleResultHeaderComponentStyle-accountTeams") ||
        playerRows.length >= 4;

      const splitPlayerIndex = hasRealTeamSplit
        ? playerRows.findIndex(r => rows.indexOf(r) > existingTeamSplitIndex)
        : (looksTeamBattle ? Math.ceil(playerRows.length / 2) : playerRows.length);

      let playerIndex = 0;
      let taggedSelf = false;

      for (const tr of rows) {
        if (!isPlayerRow(tr)) {
          // Preserve a real team separator if the game/original script already marked it.
          tr.id = tr.id === "teamRowSpace" ? "teamRowSpace" : "rowSpace";
          continue;
        }

        const looksLikeSelf =
          tr.id === "selfUserBg" ||
          tr.querySelector('[class*="-flexStartAlignCenter"] span[class*="ksc-684"]') ||
          tr.querySelector(".ksc-748") ||
          tr.querySelector('[class*="self" i], [class*="UserInfo" i]');

        if (!taggedSelf && looksLikeSelf) {
          tr.id = "selfUserBg";
          taggedSelf = true;
        } else {
          tr.id = playerIndex >= splitPlayerIndex ? "enemyCommand" : "blueCommand";
        }

        playerIndex++;
      }
    }
  }

  function watchKillboardElements() {
    styleKillboardElements();

    const observer = new MutationObserver(() => {
      styleKillboardElements();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function removeBlueGameGradient() {
    document.querySelectorAll("div[style]").forEach(div => {
      const s = div.getAttribute("style") || "";
      if (s.includes("rgba(0, 25, 38") || s.includes("0, 25, 38") || s.includes("linear-gradient(rgba(0, 25, 38")) div.remove();
    });
  }

  function updateMenuBackgroundState() {
    if (!document.body) return;
    const active =
      document.querySelector(".BattleResultHeaderComponentStyle-accountTeams") ||
      document.querySelector(".BattleKillBoardComponentStyle-tableContainer") ||
      document.querySelector(".BattleResultNavigationComponentStyle-commonBlockProBattleButton") ||
      document.querySelector(".GarageCommonStyle-garageContainer") ||
      document.querySelector(".SettingsComponentStyle-containerBlock") ||
      document.querySelector(".InvitationWindowsComponentStyle-centerBlock");
    document.body.classList.toggle("tbg-menu-bg-active", !!active);
  }

  function updateBackgroundBattleState() {
    if (!bgState.variableHeader) return;

    const battle = isBattle();

    // Do not render any custom/animated background while inside a battle.
    bgState.variableHeader.classList.toggle("tbg-battle-disabled", battle);
    bgState.gradient.classList.toggle("tbg-hidden", battle);
    bgState.holoCanvas.classList.toggle("tbg-hidden", battle || bgState.currentMode !== 1);
    bgState.spaceCanvas.classList.toggle("tbg-hidden", battle || bgState.currentMode !== 2);

    if (battle) {
      // Stop the animation loops so they do not consume FPS/GPU in battle.
      bgState.holoRunning = false;
      bgState.spaceRunning = false;
      clearCustomBackground();
      return;
    }

    if (bgState.currentMode === 1) startBackgroundHolography();
    if (bgState.currentMode === 2) startBackgroundSpace();
    if (bgState.currentMode === 3) applyCustomBackground();
  }

  function watchBackgroundGameDom() {
    if (bgState.observerStarted) return;
    bgState.observerStarted = true;
    removeBlueGameGradient();
    updateMenuBackgroundState();
    updateBackgroundBattleState();
    new MutationObserver(() => {
      removeBlueGameGradient();
      updateMenuBackgroundState();
      updateBackgroundBattleState();
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"]
    });
  }

  function createBackgroundLayers() {
    if (bgState.variableHeader || document.getElementById(BG_LAYER_ID)) return;

    addBackgroundBaseStyle();

    bgState.variableHeader = document.createElement("data");
    bgState.variableHeader.id = BG_LAYER_ID;

    if (document.body.firstChild) document.body.insertBefore(bgState.variableHeader, document.body.firstChild);
    else document.body.appendChild(bgState.variableHeader);

    bgState.gradient = create("div", { className: "obscDOMElement-svgGradient" });
    bgState.holoCanvas = create("canvas", { className: "obscDOMElement-holoCanvas tbg-hidden" });
    bgState.spaceCanvas = create("canvas", { className: "obscDOMElement-spaceCanvas tbg-hidden" });

    bgState.variableHeader.append(bgState.gradient, bgState.holoCanvas, bgState.spaceCanvas);

    bgState.customStyle = document.getElementById(BG_CUSTOM_STYLE_ID) || document.createElement("style");
    bgState.customStyle.id = BG_CUSTOM_STYLE_ID;
    if (!bgState.customStyle.parentNode) document.documentElement.appendChild(bgState.customStyle);

    initBackgroundHolography();
    initBackgroundSpace();

    window.addEventListener("resize", () => {
      initBackgroundHolography();
      initBackgroundSpace();
    });
  }

  function initBackgroundHolography() {
    const canvas = bgState.holoCanvas;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bgState.holoDrops = [];
    const spacing = 4;
    let xPosition = 0;
    bgState.holoN = canvas.width / spacing;
    for (let i = 0; i < bgState.holoN; i++) {
      xPosition += spacing;
      bgState.holoDrops.push({
        x: xPosition,
        y: Math.round(Math.random() * canvas.height),
        width: Math.ceil(Math.random() * 50 - 20) / 100,
        height: Math.ceil(Math.random() * 5000 + 100) / 15,
        speed: Math.ceil(Math.random() * 50 + 5) / 50
      });
    }
  }

  function drawBackgroundHolography() {
    if (bgState.currentMode !== 1 || isBattle()) {
      bgState.holoRunning = false;
      if (bgState.holoCanvas) bgState.holoCanvas.classList.add("tbg-hidden");
      return;
    }
    const canvas = bgState.holoCanvas;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < bgState.holoN; i++) {
      const d = bgState.holoDrops[i];
      context.fillStyle = "rgb(255 255 255)";
      context.fillRect(d.x, d.y, d.width, d.height);
      d.y += d.speed;
      if (d.y > canvas.height) d.y = 0 - d.height;
    }
    requestAnimationFrame(drawBackgroundHolography);
  }

  function startBackgroundHolography() {
    if (bgState.holoRunning) return;
    bgState.holoRunning = true;
    requestAnimationFrame(drawBackgroundHolography);
  }

  function initBackgroundSpace() {
    const canvas = bgState.spaceCanvas;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bgState.spaceDrops = [];
    const spacing = 3;
    let xPosition = 0;
    bgState.spaceN = canvas.width / spacing;
    for (let i = 0; i < bgState.spaceN; i++) {
      xPosition += spacing;
      bgState.spaceDrops.push({
        x: xPosition,
        y: Math.round(Math.random() * canvas.height),
        width: Math.ceil(Math.random() * 50 + 10) / 50,
        height: Math.ceil(Math.random() * 50 + 10) / 15,
        speed: Math.ceil(Math.random() * 50 + 10) / 80
      });
    }
  }

  function drawBackgroundSpace() {
    if (bgState.currentMode !== 2 || isBattle()) {
      bgState.spaceRunning = false;
      if (bgState.spaceCanvas) bgState.spaceCanvas.classList.add("tbg-hidden");
      return;
    }
    const canvas = bgState.spaceCanvas;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < bgState.spaceN; i++) {
      const d = bgState.spaceDrops[i];
      context.fillStyle = "rgb(255 255 255 / 80%)";
      context.fillRect(d.x, d.y, d.width, d.height);
      d.y += d.speed;
      if (d.y > canvas.height) d.y = 0 - d.height;
    }
    requestAnimationFrame(drawBackgroundSpace);
  }

  function startBackgroundSpace() {
    if (bgState.spaceRunning) return;
    bgState.spaceRunning = true;
    requestAnimationFrame(drawBackgroundSpace);
  }

  function clearCustomBackground() {
    if (bgState.customStyle) bgState.customStyle.textContent = "";
  }

  function applyCustomBackground() {
    const url = localStorage.getItem(BG_STORAGE_CUSTOM) || "";
    clearCustomBackground();
    if (!url || !bgState.customStyle) return;
    requestAnimationFrame(() => {
      const safeUrl = url.replace(/'/g, "\\'");
      bgState.customStyle.textContent = `
        body,
        .BattleComponentStyle-canvasContainer,
        .BattleComponentStyle-canvasContainer > .-container {
          background: url('${safeUrl}') 0% 0% / cover, center bottom no-repeat !important;
        }
      `;
    });
  }

  function setBackgroundMode(value) {
    if (!bgState.variableHeader) return;
    const mode = clamp(Number(value) || 0, 0, 3);
    bgState.currentMode = mode;

    bgState.holoCanvas.classList.add("tbg-hidden");
    bgState.spaceCanvas.classList.add("tbg-hidden");
    bgState.gradient.classList.remove("tbg-hidden");
    bgState.gradient.style.opacity = "1";

    clearCustomBackground();
    removeBlueGameGradient();
    updateMenuBackgroundState();

    if (isBattle()) {
      updateBackgroundBattleState();
      localStorage.setItem(BG_STORAGE_MODE, String(mode));
      updateBackgroundTab();
      return;
    }

    if (mode === 1) {
      bgState.holoCanvas.classList.remove("tbg-hidden");
      startBackgroundHolography();
    }
    if (mode === 2) {
      bgState.spaceCanvas.classList.remove("tbg-hidden");
      startBackgroundSpace();
    }
    if (mode === 3) {
      bgState.gradient.classList.add("tbg-hidden");
      applyCustomBackground();
    }

    localStorage.setItem(BG_STORAGE_MODE, String(mode));
    updateBackgroundTab();
  }

  function loadBackgroundEngine() {
    readyBg(() => {
      createBackgroundLayers();
      watchBackgroundGameDom();
      let savedMode = Number(localStorage.getItem(BG_STORAGE_MODE) || 0);
      if (savedMode === 3 && !localStorage.getItem(BG_STORAGE_CUSTOM)) savedMode = 0;
      setBackgroundMode(savedMode);
    });
  }

  function renderBackgroundTab() {
    modalBody.innerHTML = "";
    modalBody.style.display = "flex";
    modalBody.style.alignItems = "center";
    modalBody.style.justifyContent = "center";
    modalBody.style.overflow = "hidden";

    const mode = Number(localStorage.getItem(BG_STORAGE_MODE) || 0);
    const wrap = create("div", { className: "bgWrap" });
    const card = create("div", { className: "bgCard" });

    const modeName = create("div", { className: "bgModePill", text: BG_MODES[mode] || "Dark" });
    const modeSlider = create("input", {
      attrs: { type: "range", min: "0", max: "3", step: "1", value: String(mode) }
    });
    modeSlider.addEventListener("input", () => {
      setBackgroundMode(modeSlider.value);
      modeName.textContent = BG_MODES[Number(modeSlider.value)] || "Dark";
    });

    const urlBox = create("textarea", {
      className: "bgUrl",
      attrs: { placeholder: "Paste image URL or data:image/...;base64,...", rows: "1", spellcheck: "false" }
    });
    urlBox.value = localStorage.getItem(BG_STORAGE_CUSTOM) || "";

    const saveBtn = create("div", { className: "bgBtn primary", text: "Save", attrs: { role: "button", tabindex: "0" } });
    saveBtn.addEventListener("click", () => {
      const value = urlBox.value.trim();
      if (value) {
        localStorage.setItem(BG_STORAGE_CUSTOM, value);
        setBackgroundMode(3);
        modeSlider.value = "3";
        modeName.textContent = "Custom";
      } else {
        localStorage.removeItem(BG_STORAGE_CUSTOM);
        setBackgroundMode(Number(modeSlider.value) || 0);
      }
      updateBackgroundTab();
    });

    const clearBtn = create("div", { className: "bgBtn", text: "Clear", attrs: { role: "button", tabindex: "0" } });
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem(BG_STORAGE_CUSTOM);
      clearCustomBackground();
      urlBox.value = "";
      setBackgroundMode(0);
      modeSlider.value = "0";
      modeName.textContent = "Dark";
      updateBackgroundTab();
    });

    const tip = create("div", { className: "bgTip" });
    tip.append(
      document.createTextNode("To convert ur image use "),
      create("a", { text: "Base64 converter", attrs: { href: "https://www.base64-image.de/", target: "_blank", rel: "noopener noreferrer" } })
    );

    card.append(
      create("div", {
        className: "bgRow",
        children: [create("div", { className: "bgLabel", text: "Background" }), modeSlider, modeName]
      }),
      create("div", { className: "bgUrlLabel", text: "Custom URL" }),
      urlBox,
      tip,
      create("div", { className: "bgBtns", children: [saveBtn, clearBtn] })
    );

    wrap.appendChild(card);
    modalBody.appendChild(wrap);
    updateBackgroundTab();
  }

  function updateBackgroundTab() {
    if (state.activeTab !== "background" || !modalBody) return;
    const mode = Number(localStorage.getItem(BG_STORAGE_MODE) || 0);
    modalHeader.textContent = "Background";
    const modeName = modalBody.querySelector(".bgModePill");
    const modeSlider = modalBody.querySelector('.bgRow input[type="range"]');
    if (modeName) modeName.textContent = BG_MODES[mode] || "Dark";
    if (modeSlider) modeSlider.value = String(mode);
  }


  // ── Render: Joiner tab ────────────────────────────────────
  function joinerSyncButtons() {
    const ab = document.getElementById("joiner-alpha-btn");
    const bb = document.getElementById("joiner-bravo-btn");
    const accent = "color-mix(in srgb, var(--accent) 40%, rgba(255,255,255,.06))";
    const idle   = "rgba(255,255,255,.06)";
    if (ab) ab.style.background = joinerAlphaState === "ACTIVE" ? accent : idle;
    if (bb) bb.style.background = joinerBravoState === "ACTIVE" ? accent : idle;
    joinerUpdateCaptchaBtn();
  }

  function renderJoinerTab() {
    modalBody.innerHTML = "";
    modalBody.style.display = "flex";
    modalBody.style.alignItems = "center";
    modalBody.style.justifyContent = "center";
    modalBody.style.overflow = "hidden";

    const wrap = create("div", {
      style: "width:100%;height:100%;display:flex;align-items:center;justify-content:center;"
    });

    const card = create("div", {
      style: [
        "width:min(340px,100%)",
        "border:1px solid rgba(255,255,255,.10)",
        "border-radius:18px",
        "padding:24px 20px",
        "background:rgba(0,0,0,.18)",
        "box-shadow:0 18px 60px rgba(0,0,0,.45)",
        "display:flex",
        "flex-direction:column",
        "gap:10px"
      ].join(";")
    });

    const mkBtn = (text, id, onClick) => {
      const b = create("div", {
        id,
        text,
        attrs: { role: "button", tabindex: "0" },
        style: [
          "padding:13px 0",
          "border-radius:14px",
          "border:1px solid rgba(255,255,255,.14)",
          "background:rgba(255,255,255,.06)",
          "color:var(--text)",
          "font-weight:950",
          "font-size:13px",
          "letter-spacing:1.2px",
          "text-transform:uppercase",
          "text-align:center",
          "cursor:pointer",
          "transition:.15s",
          "user-select:none"
        ].join(";")
      });
      b.addEventListener("click", onClick);
      b.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } });
      return b;
    };

    const alphaBtn   = mkBtn("Alpha",   "joiner-alpha-btn",   () => joinerHandleTeam("ALPHA"));
    const bravoBtn   = mkBtn("Bravo",   "joiner-bravo-btn",   () => joinerHandleTeam("BRAVO"));
    const captchaBtn = mkBtn("Solved",  "joiner-captcha-btn", () => joinerStartCaptchaBypass());
    const spotBtn    = mkBtn("+1 Spot", "joiner-spot-btn",    () => {
      joinerCountMode = joinerCountMode === "backup" ? "increase" : "backup";
      joinerRestoreOriginalValues();
      const b = document.getElementById("joiner-spot-btn");
      if (b) {
        b.textContent = joinerCountMode === "increase" ? "+1 Spot ON" : "+1 Spot";
        b.style.background = joinerCountMode === "increase"
          ? "color-mix(in srgb, var(--accent) 40%, rgba(255,255,255,.06))"
          : "rgba(255,255,255,.06)";
      }
    });

    card.append(alphaBtn, bravoBtn, captchaBtn, spotBtn);
    wrap.appendChild(card);
    modalBody.appendChild(wrap);
    joinerSyncButtons();
  }

  function renderTabContent(id) {
    if (typeof modalBody._cleanupHotkeys === "function") {
      try { modalBody._cleanupHotkeys(); } catch {}
      modalBody._cleanupHotkeys = null;
    }

    modalBody.innerHTML = "";

    if (id === "clicker") {
      renderClickerTab();
      return;
    }

    if (id === "hotkeys") {
      renderHotkeysTab();
      return;
    }

    if (id === "list") {
      modalBody.style.overflow = "hidden";
      renderListTab();
      return;
    }

    if (id === "appearance") {
      renderAppearanceTab();
      return;
    }

    if (id === "background") {
      renderBackgroundTab();
      return;
    }

    if (id === "others") {
      renderOthersTab();
      return;
    }

    if (id === "joiner") {
      renderJoinerTab();
      return;
    }

    closeSuppliesExtras();

    if (id !== "panel") {
      modalBody.style.display = "block";
      modalBody.style.alignItems = "";
      modalBody.style.justifyContent = "";
      modalBody.style.overflow = "hidden";
      modalBody.appendChild(
        create("div", {
          style: "opacity:.7; font-weight:900; text-align:center; padding:24px;",
          text: "Coming soon…"
        })
      );
      return;
    }

    // Panel settings
    modalBody.style.display = "block";
    modalBody.style.alignItems = "";
    modalBody.style.justifyContent = "";
    modalBody.style.overflow = "auto";

    const row = (labelText, rightNode) =>
      create("div", {
        className: "row",
        children: [create("div", { className: "label", text: labelText }), rightNode]
      });

    const textColor = create("input", { className: "color", attrs: { type: "color", value: state.textColor } });
    textColor.addEventListener("input", () => { state.textColor = textColor.value; apply(); });

    const accentColor = create("input", { className: "color", attrs: { type: "color", value: state.accentColor } });
    accentColor.addEventListener("input", () => { state.accentColor = accentColor.value; apply(); });

    const alpha = create("input", { attrs: { type: "range", min: "0.25", max: "0.95", step: "0.01" } });
    alpha.value = String(state.transparency);
    alpha.addEventListener("input", () => { state.transparency = Number(alpha.value); apply(); });

    const scale = create("input", { attrs: { type: "range", min: "0.85", max: "1.15", step: "0.01" } });
    scale.value = String(state.scale);
    scale.addEventListener("input", () => { state.scale = Number(scale.value); apply(); });

    const tabDark = create("input", { attrs: { type: "range", min: "0.06", max: "0.85", step: "0.01" } });
    tabDark.value = String(clamp(state.tabDarkness, 0.06, 0.85));
    tabDark.addEventListener("input", () => { state.tabDarkness = Number(tabDark.value); apply(); });

    modalBody.append(
      row("Text color", textColor),
      row("Accent color", accentColor),
      row("Transparency", alpha),
      row("Scale", scale),
      row("Tabs darkness", tabDark)
    );
  }

  function openTab(id) {
    state.activeTab = id;
    state.menuOpen = true;

    const tab = TABS.find(t => t.id === id);
    modalHeader.textContent = tab ? tab.name : "Menu";

    for (const [k, b] of tabBtns) b.setAttribute("aria-selected", k === id);

    renderTabContent(id);
    apply();
  }

  tabsWrap.addEventListener("click", e => {
    const t = e.target.closest(".tab");
    if (!t) return;
    openTab(t.dataset.tab);
  });

  function toggleClicker(which) {
    state.clicker[which] = !state.clicker[which];
    save();
  }

  window.addEventListener("keydown", e => {
    const ae = document.activeElement;
    const tag = (ae?.tagName || "").toLowerCase();
    const typing = tag === "input" || tag === "textarea" || ae?.isContentEditable;
    if (typing) return;

    const uiKey = normalizeHotkeyCode(state.hotkeys.ui);
    const supKey = normalizeHotkeyCode(state.hotkeys.sup);
    const mineKey = normalizeHotkeyCode(state.hotkeys.mine);
    const fpsFriendKey = normalizeHotkeyCode(state.hotkeys.fpsFriend);
    const fpsEnemyKey = normalizeHotkeyCode(state.hotkeys.fpsEnemy);
    const fpsBothKey = normalizeHotkeyCode(state.hotkeys.fpsBoth);

    if (uiKey && e.code === uiKey) {
      e.preventDefault();
      state.uiVisible = !state.uiVisible;
      if (!state.uiVisible) { state.menuOpen = false; closeSuppliesExtras(); apply(); }
      else openTab(state.activeTab || "clicker");
      return;
    }

    if (supKey && e.code === supKey) { e.preventDefault(); toggleClicker("sup"); return; }
    if (mineKey && e.code === mineKey) { e.preventDefault(); toggleClicker("mine"); return; }
    if (fpsFriendKey && e.code === fpsFriendKey) { e.preventDefault(); runFPSDecluster(true); return; }
    if (fpsEnemyKey && e.code === fpsEnemyKey) { e.preventDefault(); runFPSDecluster(false); return; }
    if (fpsBothKey && e.code === fpsBothKey) { e.preventDefault(); runFPSBoth(); return; }

    if (e.key === "Escape" && state.menuOpen) {
      e.preventDefault();
      state.menuOpen = false;
      closeSuppliesExtras();
      apply();
    }
  }, { passive: false });

  loadBackgroundEngine();
  watchKillboardElements();
  apply();

  const suppliesBoot = setInterval(() => {
    if (!document.documentElement || !document.body) return;
    clearInterval(suppliesBoot);

    ensureSuppliesOverlay();
    refreshSuppliesOverlay();

    new MutationObserver(refreshSuppliesOverlay).observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    ["resize", "fullscreenchange", "pageshow", "visibilitychange"].forEach(ev => {
      window.addEventListener(ev, refreshSuppliesOverlay, { passive: true });
    });

    setInterval(refreshSuppliesOverlay, 150);
  }, 10);

})();

/* ===================== OBSCURUM CORE ====================== */

(function () {
    'use strict';

    // ── Hardcoded design tokens ───────────────
    const T = {
        bg:           'rgb(0 0 0 / 5%)',
        bgHover:      'rgb(255 255 255 / 5%)',
        outline:      '2px solid rgb(255 255 255 / 2.5%)',
        radius:       '1.25em',
        shadow:       '0 0 1.5em 0 rgb(0 0 0 / 40%)',
        blur:         'blur(16px)',
        color:        'rgb(255 157 71)',
        transition:   '.15s cubic-bezier(.25, .1, .25, 1)',
        animation:    'blend .15s ease-in-out',
    };

    // ── Inject keyframes ─────────────────────────────
    function injectBase() {
        if (document.getElementById('obscurum-base')) return;
        const s = document.createElement('style');
        s.id = 'obscurum-base';
        s.textContent = `
            @keyframes blend { 0% { opacity:0; } 100% { opacity:1; } }

            body {
                --general-bg:            ${T.bg};
                --general-bg-hover:      ${T.bgHover};
                --general-outline:       ${T.outline};
                --general-border-radius: ${T.radius};
                --general-box-shadow:    ${T.shadow};
                --general-backdrop-filter: ${T.blur};
                --general-color:         ${T.color};
                --least-general-color:   rgb(255 157 71 / 25%);
                --general-transition:    ${T.transition};
                --general-animation:     ${T.animation};
            }
        `;
        (document.head || document.documentElement).appendChild(s);
    }

    // ── All BattleTabStatisticComponentStyle CSS ─────────────────────────────
    function injectBattleTabCSS() {
        if (document.getElementById('obscurum-battle-tab')) return;
        const s = document.createElement('style');
        s.id = 'obscurum-battle-tab';
        s.textContent = `

            /* ── Container ──────────────────────────────────────────────── */
            .BattleTabStatisticComponentStyle-containerInsideTeams {
                background: rgb(0 0 0 / 50%) !important;
                outline: 2px solid rgb(255 255 255 / 2.5%) !important;
                box-shadow: 0 0 4em 0 rgb(0 0 0 / 50%) !important;
                border-radius: 1.25em !important;
                backdrop-filter: blur(8px) !important;
                transition: .15s cubic-bezier(.25, .1, .25, 1) !important;
                animation: blend .15s ease-in-out !important;
            }

            .BattleTabStatisticComponentStyle-tablesContainer {
                width: 100% !important;
                padding-bottom: 0.1em !important;
            }

            /* ── Header ─────────────────────────────────────────────────── */
            .BattleTabStatisticComponentStyle-header {
                border-bottom: unset !important;
                margin-top: 0.5em !important;
                height: 2em !important;
                pointer-events: none !important;
            }

            .BattleTabStatisticComponentStyle-commonBlockMapName {
                visibility: hidden !important;
            }

            .BattleTabStatisticComponentStyle-commonBlockScroll {
                margin-top: unset !important;
                margin-bottom: 0.5em !important;
                scrollbar-color: transparent transparent !important;
                justify-content: center !important;
            }

            .BattleTabStatisticComponentStyle-commonBlockCustomName {
                position: absolute !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                margin: unset !important;
                height: 100% !important;
            }

            .BattleTabStatisticComponentStyle-customBattleName {
                color: rgb(255 157 71) !important;
                font-family: 'BaseFontRegular' !important;
                margin-top: unset !important;
                margin-left: unset !important;
                width: auto !important;
                opacity: 1 !important;
            }

            /* ── Hide default thead ──────────────────────────────────────── */
            .BattleTabStatisticComponentStyle-blueTeamTableContainer table thead,
            .BattleTabStatisticComponentStyle-redTeamTableContainer table thead,
            .BattleTabStatisticComponentStyle-dmTableContainer table thead,
            .BattleTabStatisticComponentStyle-commonContainerIconOptions {
                position: absolute !important;
                visibility: hidden !important;
            }

            /* ── Team tables padding ─────────────────────────────────────── */
            .BattleTabStatisticComponentStyle-blueTeamTableContainer table,
            .BattleTabStatisticComponentStyle-redTeamTableContainer table {
                padding-bottom: 0em !important;
            }

            /* ── Rows ────────────────────────────────────────────────────── */
            .BattleTabStatisticComponentStyle-rowBackGround {
                background: rgb(0 0 0 / 5%) !important;
                outline: 2px solid rgb(255 255 255 / 3.25%) !important;
                border-radius: 0.8em !important;
                margin-top: 0.65em !important;
                transition: .15s cubic-bezier(.25, .1, .25, 1) !important;
            }

            .BattleTabStatisticComponentStyle-rowBackGround:hover {
                background: rgb(255 255 255 / 5%) !important;
                box-shadow: unset !important;
            }

            .BattleTabStatisticComponentStyle-selectedRowBackGround {
                background: rgb(255 255 255 / 5%) !important;
                outline: 2px solid rgb(255 255 255 / 5%) !important;
                box-shadow: unset !important;
                border-radius: 0.8em !important;
                margin-top: 0.65em !important;
                transition: .15s cubic-bezier(.25, .1, .25, 1) !important;
            }

            /* ── Nickname cell ───────────────────────────────────────────── */
            .BattleTabStatisticComponentStyle-selectedRowBackGround
                > .BattleTabStatisticComponentStyle-nicknameCell
                > div > div > .-flexStartAlignCenter > span {
                color: rgb(255 157 71) !important;
            }

            .BattleTabStatisticComponentStyle-nicknameCell > div > img {
                margin-left: 0.5em !important;
                margin-right: 0.75em !important;
            }

            .BattleTabStatisticComponentStyle-nicknameCell > div > div > div > span {
                transition: .15s cubic-bezier(.25, .1, .25, 1) !important;
            }

            .BattleTabStatisticComponentStyle-nicknameCell > div > div > div > span:hover {
                color: rgb(255 157 71) !important;
            }

            /* ── Remove border on extra columns ──────────────────────────── */
            .BattleTabStatisticComponentStyle-blueTeamTableContainer table tbody tr td:nth-child(n+6),
            .BattleTabStatisticComponentStyle-blueTeamTableContainer table tbody tr td:nth-child(n+7),
            .BattleTabStatisticComponentStyle-redTeamTableContainer table tbody tr td:nth-child(n+6),
            .BattleTabStatisticComponentStyle-redTeamTableContainer table tbody tr td:nth-child(n+7),
            .BattleTabStatisticComponentStyle-dmTableContainer table tbody tr td:nth-child(n+6),
            .BattleTabStatisticComponentStyle-dmTableContainer table tbody tr td:nth-child(n+7) {
                border-left: unset !important;
            }

            /* ── Resistance module cell (hidden until hover) ──────────────── */
            .BattleTabStatisticComponentStyle-resistanceModuleCell {
                position: absolute !important;
                margin-left: 17em !important;
            }

            .BattleTabStatisticComponentStyle-selectedRowBackGround > .BattleTabStatisticComponentStyle-gsCell,
            .BattleTabStatisticComponentStyle-selectedRowBackGround > .BattleTabStatisticComponentStyle-deviceCell,
            .BattleTabStatisticComponentStyle-selectedRowBackGround > .BattleTabStatisticComponentStyle-defenceCell,
            .BattleTabStatisticComponentStyle-rowBackGround > .BattleTabStatisticComponentStyle-gsCell,
            .BattleTabStatisticComponentStyle-rowBackGround > .BattleTabStatisticComponentStyle-deviceCell,
            .BattleTabStatisticComponentStyle-rowBackGround > .BattleTabStatisticComponentStyle-defenceCell {
                visibility: visible !important;
                transition: .15s cubic-bezier(.25, .1, .25, 1) !important;
            }

            .BattleTabStatisticComponentStyle-selectedRowBackGround:hover > .BattleTabStatisticComponentStyle-gsCell,
            .BattleTabStatisticComponentStyle-selectedRowBackGround:hover > .BattleTabStatisticComponentStyle-deviceCell,
            .BattleTabStatisticComponentStyle-selectedRowBackGround:hover > .BattleTabStatisticComponentStyle-defenceCell,
            .BattleTabStatisticComponentStyle-rowBackGround:hover > .BattleTabStatisticComponentStyle-gsCell,
            .BattleTabStatisticComponentStyle-rowBackGround:hover > .BattleTabStatisticComponentStyle-deviceCell,
            .BattleTabStatisticComponentStyle-rowBackGround:hover > .BattleTabStatisticComponentStyle-defenceCell {
                margin-top: 1em !important;
                opacity: 0 !important;
            }

            .BattleTabStatisticComponentStyle-selectedRowBackGround > .BattleTabStatisticComponentStyle-resistanceModuleCell,
            .BattleTabStatisticComponentStyle-rowBackGround > .BattleTabStatisticComponentStyle-resistanceModuleCell {
                visibility: visible !important;
                margin-top: -1em !important;
                opacity: 0 !important;
                transition: .15s cubic-bezier(.25, .1, .25, 1) !important;
            }

            .BattleTabStatisticComponentStyle-selectedRowBackGround:hover > .BattleTabStatisticComponentStyle-resistanceModuleCell,
            .BattleTabStatisticComponentStyle-rowBackGround:hover > .BattleTabStatisticComponentStyle-resistanceModuleCell {
                margin-top: unset !important;
                opacity: 1 !important;
            }

            /* ── Pin button ──────────────────────────────────────────────── */
            .BattleTabStatisticComponentStyle-containerInsideTeams > .-flexCenterAlignCenter {
                opacity: 0 !important;
                margin-top: 0em !important;
                margin-bottom: 0.75em !important;
                transition: .15s cubic-bezier(.25, .1, .25, 1) !important;
            }

            .BattleTabStatisticComponentStyle-containerInsideTeams:hover > .-flexCenterAlignCenter {
                opacity: 1 !important;
            }

            .BattleTabStatisticComponentStyle-containerInsideTeams:hover > .BattleTabStatisticComponentStyle-pinResistances,
            .BattleTabStatisticComponentStyle-containerInsideTeams:hover > .BattleTabStatisticComponentStyle-showResistances {
                opacity: 1 !important;
            }

            .BattleTabStatisticComponentStyle-pinResistances {
                background-color: rgb(255 255 255 / 25%) !important;
                -webkit-mask-image: url("data:image/webp;base64,UklGRtgBAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSIMBAAABkCvbtmlb89qKbN8b830AM9v2e4f5y2zbth3atm0ba4+HdfaZa67sRhExAdQ0Mn34hoPrh6Xb0+kN/n/TyZZ+DvSOx46ir3DpsWIyXHtsuOQOHgvehgGPvAfhwCNuU1jwSBsbHjyiEhaC0yOo/DxYnY5i2rwD89sMGXEzwD/USIV/6f79i/w1RSdhcK2B5NUO9L9g8hBf5EHIXMPXHUKH8O0W8iqV76YMpz3xnxHxrQ8ZnG5ozPyrz2/NLiWT5V+MLCKJ3ZSB8wkiqJ9i+1RFQvspru4ktp/imUGC+ymOk3GSaCXDryKS3EUxoFpS8x/g9Aqq/QTWBXIqX4J3t5jc+9CrVcrdDikZl6D/0YUGKFdLhCQehv5TcyIaoNz4ZERtgf5NM/q/nwrlVIiIWA79/UrS91chlpPIidBfzqXQ3b5o9iWJCEJ/JIPclk07eW1n5wiS2MPRHUwmO1v/gnZ5NNkZ+RjaSRFkaSb+d4JkbcQ9AL/6kMX1d/GoFdmdGUFNcAEAVlA4IC4AAACQAwCdASpAAEAAPpFIoEwlpCMiIggAsBIJaQAAEDdTUAV4hbkAAP74zvV4AAAA");
                mask-image: url("data:image/webp;base64,UklGRtgBAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSIMBAAABkCvbtmlb89qKbN8b830AM9v2e4f5y2zbth3atm0ba4+HdfaZa67sRhExAdQ0Mn34hoPrh6Xb0+kN/n/TyZZ+DvSOx46ir3DpsWIyXHtsuOQOHgvehgGPvAfhwCNuU1jwSBsbHjyiEhaC0yOo/DxYnY5i2rwD89sMGXEzwD/USIV/6f79i/w1RSdhcK2B5NUO9L9g8hBf5EHIXMPXHUKH8O0W8iqV76YMpz3xnxHxrQ8ZnG5ozPyrz2/NLiWT5V+MLCKJ3ZSB8wkiqJ9i+1RFQvspru4ktp/imUGC+ymOk3GSaCXDryKS3EUxoFpS8x/g9Aqq/QTWBXIqX4J3t5jc+9CrVcrdDikZl6D/0YUGKFdLhCQehv5TcyIaoNz4ZERtgf5NM/q/nwrlVIiIWA79/UrS91chlpPIidBfzqXQ3b5o9iWJCEJ/JIPclk07eW1n5wiS2MPRHUwmO1v/gnZ5NNkZ+RjaSRFkaSb+d4JkbcQ9AL/6kMX1d/GoFdmdGUFNcAEAVlA4IC4AAACQAwCdASpAAEAAPpFIoEwlpCMiIggAsBIJaQAAEDdTUAV4hbkAAP74zvV4AAAA");
                -webkit-mask-position: center;
                mask-position: center;
                -webkit-mask-size: contain;
                mask-size: contain;
                -webkit-mask-repeat: no-repeat;
                mask-repeat: no-repeat;
                position: absolute !important;
                bottom: 0.8em !important;
                right: 1em !important;
                width: 1em !important;
                height: 1em !important;
                scale: 1.5 !important;
                opacity: 0 !important;
                transition: .15s cubic-bezier(.25, .1, .25, 1) !important;
                cursor: pointer !important;
            }

            .BattleTabStatisticComponentStyle-showResistances {
                background-color: rgb(255 255 255 / 25%) !important;
                -webkit-mask-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB50lEQVQ4jX2UsU4bURBF76xSICsVFRUFokCpUljuSE1CwydYgZIPoMtHuE1HwSeYxrJIS5MoAj6AFCgSuCK4gHtSMIsf611GGu3svJm77829+0IdZrsn6VNE7EoaA46Iz8BY0o+qqv519UqSAAGbtg9tj4F70mwPbQ9Z2L3tse1DYBNYAhvYvrJNmwNDYNi1bvsKGEhSlYDfJG29eQRJEdGV20qMZ0BJl5JcFzQa55J+ps87gB0Rl4s3W0Df9qSY05PtE2DDdi99I3NPRd3Edt+2SsDjnFMFfAFGWdSzfQTMgJnto8z1bY9s79iucr7HJSnTHO4v24P8yJ7t6xYCrm3vZc0gewCm5Q6nRcNZ5m5b2K7j26w5K3LTkpSStZXy2UZCsbaihr3L52PdVIq0BKrjLukAj+UO/xSL8wznzcbC2mpeMGT7oCalVjzQSQqwlzUD4HfO96AEXC1ks9OUje2Z7RlwBPRs94FR1lb5r6++OgOw3hQ28CJsoJfxSYq+Zn4CrC8NxfaK7XOW7QH4mP7Qsn5ue4ntepdrwEVL0zC9aRe210qMVzqMiBtJ25JOeb4f3/JTSdtVVd10AiboHbAbEfuS/mau1N9NROxHxG5E3C31t559MYL3wNfiavog6XtEdF7//wF+7O1VS+r7GAAAAABJRU5ErkJggg==");
                mask-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB50lEQVQ4jX2UsU4bURBF76xSICsVFRUFokCpUljuSE1CwydYgZIPoMtHuE1HwSeYxrJIS5MoAj6AFCgSuCK4gHtSMIsf611GGu3svJm77829+0IdZrsn6VNE7EoaA46Iz8BY0o+qqv519UqSAAGbtg9tj4F70mwPbQ9Z2L3tse1DYBNYAhvYvrJNmwNDYNi1bvsKGEhSlYDfJG29eQRJEdGV20qMZ0BJl5JcFzQa55J+ps87gB0Rl4s3W0Df9qSY05PtE2DDdi99I3NPRd3Edt+2SsDjnFMFfAFGWdSzfQTMgJnto8z1bY9s79iucr7HJSnTHO4v24P8yJ7t6xYCrm3vZc0gewCm5Q6nRcNZ5m5b2K7j26w5K3LTkpSStZXy2UZCsbaihr3L52PdVIq0BKrjLukAj+UO/xSL8wznzcbC2mpeMGT7oCalVjzQSQqwlzUD4HfO96AEXC1ks9OUje2Z7RlwBPRs94FR1lb5r6++OgOw3hQ28CJsoJfxSYq+Zn4CrC8NxfaK7XOW7QH4mP7Qsn5ue4ntepdrwEVL0zC9aRe210qMVzqMiBtJ25JOeb4f3/JTSdtVVd10AiboHbAbEfuS/mau1N9NROxHxG5E3C31t559MYL3wNfiavog6XtEdF7//wF+7O1VS+r7GAAAAABJRU5ErkJggg==");
                -webkit-mask-position: center;
                mask-position: center;
                -webkit-mask-size: contain;
                mask-size: contain;
                -webkit-mask-repeat: no-repeat;
                mask-repeat: no-repeat;
                position: absolute !important;
                bottom: 0.8em !important;
                right: 2.75em !important;
                width: 1em !important;
                height: 1em !important;
                scale: 1.15 !important;
                opacity: 0 !important;
                transition: .15s cubic-bezier(.25, .1, .25, 1) !important;
                cursor: pointer !important;
            }

            .BattleTabStatisticComponentStyle-pinResistances:hover,
            .BattleTabStatisticComponentStyle-showResistances:hover {
                background-color: rgb(255 157 71) !important;
            }

            /* ── Results container ───────────────────────────────────────── */
            .BattleTabStatisticComponentStyle-containerInsideResults {
                background: rgb(0 0 0 / 50%) !important;
                outline: 2px solid rgb(255 255 255 / 2.5%) !important;
                box-shadow: 0 0 4em 0 rgb(0 0 0 / 50%) !important;
                border-radius: 1.25em !important;
                backdrop-filter: blur(8px) !important;
                width: 63em !important;
                transition: .15s cubic-bezier(.25, .1, .25, 1) !important;
                animation: blend .15s ease-in-out !important;
            }

            .BattleTabStatisticComponentStyle-dmTableContainer table tbody tr {
                width: 61em !important;
            }

            .BattleTabStatisticComponentStyle-dmTableContainer table tbody tr td:first-child {
                max-width: 24em !important;
                width: 24em !important;
            }


            /* ── DM leaderboard scroll fix ─────────────────────────────────
               In DM with many players the scroll block was centered, so the
               top of the long table could be clipped and unreachable. */
            .BattleTabStatisticComponentStyle-commonBlockScroll {
                justify-content: flex-start !important;
                align-items: center !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                scroll-behavior: auto !important;
            }

            .BattleTabStatisticComponentStyle-commonBlockScroll:has(.BattleTabStatisticComponentStyle-dmTableContainer) {
                justify-content: flex-start !important;
                align-items: center !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                padding-top: 0.35em !important;
                padding-bottom: 0.5em !important;
            }

            .BattleTabStatisticComponentStyle-dmTableContainer {
                max-height: none !important;
                overflow: visible !important;
            }

        `;
        (document.head || document.documentElement).appendChild(s);
    }

    // ── Pin resistances persistent styles ────────────────────────────────────
    let cssPin = null;

    function applyPin() {
        if (cssPin) return;
        cssPin = document.createElement('style');
        cssPin.id = 'obscurum-pin';
        cssPin.textContent = `
            .BattleTabStatisticComponentStyle-pinResistances {
                background-color: rgb(255 157 71) !important;
            }
            .BattleTabStatisticComponentStyle-containerInsideTeams > .-flexCenterAlignCenter {
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(cssPin);
        localStorage.setItem('pinResistances', 'true');
    }

    function removePin() {
        if (cssPin) { cssPin.remove(); cssPin = null; }
        localStorage.setItem('pinResistances', 'false');
    }

    // ── Show resistances persistent styles ───────────────────────────────────
    let cssShow = null;

    function applyShow() {
        if (cssShow) return;
        cssShow = document.createElement('style');
        cssShow.id = 'obscurum-show';
        cssShow.textContent = `
            .BattleTabStatisticComponentStyle-blueTeamTableContainer table tbody tr,
            .BattleTabStatisticComponentStyle-redTeamTableContainer table tbody tr {
                width: 45.125em !important;
            }
            .BattleTabStatisticComponentStyle-showResistances {
                background-color: rgb(255 157 71) !important;
            }
            /* Override the hover-animation rules so resistances stay visible */
            .BattleTabStatisticComponentStyle-selectedRowBackGround > .BattleTabStatisticComponentStyle-gsCell,
            .BattleTabStatisticComponentStyle-selectedRowBackGround > .BattleTabStatisticComponentStyle-deviceCell,
            .BattleTabStatisticComponentStyle-selectedRowBackGround > .BattleTabStatisticComponentStyle-defenceCell,
            .BattleTabStatisticComponentStyle-rowBackGround > .BattleTabStatisticComponentStyle-gsCell,
            .BattleTabStatisticComponentStyle-rowBackGround > .BattleTabStatisticComponentStyle-deviceCell,
            .BattleTabStatisticComponentStyle-rowBackGround > .BattleTabStatisticComponentStyle-defenceCell,
            .BattleTabStatisticComponentStyle-selectedRowBackGround:hover > .BattleTabStatisticComponentStyle-gsCell,
            .BattleTabStatisticComponentStyle-selectedRowBackGround:hover > .BattleTabStatisticComponentStyle-deviceCell,
            .BattleTabStatisticComponentStyle-selectedRowBackGround:hover > .BattleTabStatisticComponentStyle-defenceCell,
            .BattleTabStatisticComponentStyle-rowBackGround:hover > .BattleTabStatisticComponentStyle-gsCell,
            .BattleTabStatisticComponentStyle-rowBackGround:hover > .BattleTabStatisticComponentStyle-deviceCell,
            .BattleTabStatisticComponentStyle-rowBackGround:hover > .BattleTabStatisticComponentStyle-defenceCell {
                visibility: visible !important;
                opacity: 1 !important;
                margin: unset !important;
                margin-top: unset !important;
            }
            .BattleTabStatisticComponentStyle-selectedRowBackGround > .BattleTabStatisticComponentStyle-resistanceModuleCell,
            .BattleTabStatisticComponentStyle-rowBackGround > .BattleTabStatisticComponentStyle-resistanceModuleCell,
            .BattleTabStatisticComponentStyle-selectedRowBackGround:hover > .BattleTabStatisticComponentStyle-resistanceModuleCell,
            .BattleTabStatisticComponentStyle-rowBackGround:hover > .BattleTabStatisticComponentStyle-resistanceModuleCell {
                visibility: visible !important;
                opacity: 1 !important;
                margin-top: unset !important;
                position: relative !important;
            }
            .BattleTabStatisticComponentStyle-resistanceModuleCell,
            .BattleTabStatisticComponentStyle-gsCell,
            .BattleTabStatisticComponentStyle-deviceCell,
            .BattleTabStatisticComponentStyle-defenceCell {
                visibility: visible !important;
                opacity: 1 !important;
                margin: unset !important;
            }
            .BattleTabStatisticComponentStyle-resistanceModuleCell {
                position: relative !important;
            }
            .BattleTabStatisticComponentStyle-defenceLabel {
                margin-left: -10em !important;
                margin-right: 10em !important;
            }
            .BattleTabStatisticComponentStyle-blueTeamTableContainer table tbody tr td:first-child,
            .BattleTabStatisticComponentStyle-redTeamTableContainer table tbody tr td:first-child {
                margin-right: 10em !important;
            }
            .BattleTabStatisticComponentStyle-blueTeamTableContainer table tbody tr td:nth-child(n+6),
            .BattleTabStatisticComponentStyle-blueTeamTableContainer table tbody tr td:nth-child(n+7),
            .BattleTabStatisticComponentStyle-redTeamTableContainer table tbody tr td:nth-child(n+6),
            .BattleTabStatisticComponentStyle-redTeamTableContainer table tbody tr td:nth-child(n+7) {
                border: unset !important;
            }
            .BattleTabStatisticComponentStyle-blueTeamTableContainer table thead tr th:nth-child(1),
            .BattleTabStatisticComponentStyle-redTeamTableContainer table thead tr th:nth-child(1) {
                position: absolute !important; left: 0em !important;
            }
            .BattleTabStatisticComponentStyle-blueTeamTableContainer table thead tr th:nth-child(2),
            .BattleTabStatisticComponentStyle-redTeamTableContainer table thead tr th:nth-child(2) {
                position: absolute !important; left: 25.55em !important;
            }
            .BattleTabStatisticComponentStyle-blueTeamTableContainer table thead tr th:nth-child(3),
            .BattleTabStatisticComponentStyle-redTeamTableContainer table thead tr th:nth-child(3) {
                position: absolute !important; left: 29.75em !important;
            }
            .BattleTabStatisticComponentStyle-blueTeamTableContainer table thead tr th:nth-child(4),
            .BattleTabStatisticComponentStyle-redTeamTableContainer table thead tr th:nth-child(4) {
                position: absolute !important; left: 32.75em !important;
            }
            .BattleTabStatisticComponentStyle-blueTeamTableContainer table thead tr th:nth-child(5),
            .BattleTabStatisticComponentStyle-redTeamTableContainer table thead tr th:nth-child(5) {
                position: absolute !important; left: 35.7em !important;
            }
            .BattleTabStatisticComponentStyle-blueTeamTableContainer table thead tr th:nth-child(6),
            .BattleTabStatisticComponentStyle-redTeamTableContainer table thead tr th:nth-child(6) {
                position: absolute !important; left: 41em !important;
            }
            .BattleTabStatisticComponentStyle-blueTeamTableContainer table thead tr,
            .BattleTabStatisticComponentStyle-redTeamTableContainer table thead tr {
                width: 46.5em !important;
                justify-content: flex-end !important;
            }
            .BattleTabStatisticComponentStyle-containerInsideTeams {
                width: 95em !important;
            }
            .BattleTabStatisticComponentStyle-blueTeamTableContainer table {
                padding-left: 1em !important;
            }
        `;
        document.head.appendChild(cssShow);
        localStorage.setItem('showResistances', 'true');
    }

    function removeShow() {
        if (cssShow) { cssShow.remove(); cssShow = null; }
        localStorage.setItem('showResistances', 'false');
    }

    // ── Colored resistance icons ─────────────────────────────────────────────
    const tankResistances = [
        { old: 'crit_resistance.94e32312.svg',            col: 'crit_resistance.3f4d1cc2.svg' },
        { old: 'firebird_resistance.785a9d6b.svg',        col: 'firebird_resistance.00ac2221.svg' },
        { old: 'freeze_resistance.33bdf642.svg',          col: 'freeze_resistance.d26eb338.svg' },
        { old: 'isis_resistance.30a69ffc.svg',            col: 'isis_resistance.5b05887a.svg' },
        { old: 'tesla_resistance.3e686c8e.svg',           col: 'tesla_resistance.663d3597.svg' },
        { old: 'hammer_resistance.6c549d29.svg',          col: 'hammer_resistance.28e73097.svg' },
        { old: 'twins_resistance.ad189f61.svg',           col: 'twins_resistance.fbbc4d72.svg' },
        { old: 'ricochet_resistance.8247beaa.svg',        col: 'ricochet_resistance.69c6c7ee.svg' },
        { old: 'smoky_resistance.845afc14.svg',           col: 'smoky_resistance.c4c202ca.svg' },
        { old: 'rocket_launcher_resistance.b7dfd64f.svg', col: 'rocket_launcher_resistance.5772cbaa.svg' },
        { old: 'vulcan_resistance.824f6f0e.svg',          col: 'vulcan_resistance.9aebf267.svg' },
        { old: 'thunder_resistance.6d7f4531.svg',         col: 'thunder_resistance.9dab2abf.svg' },
        { old: 'scorpio_resistance.e8f1787f.svg',         col: 'scorpio_resistance.d40f8fbb.svg' },
        { old: 'railgun_resistance.636a554f.svg',         col: 'railgun_resistance.7577c7a1.svg' },
        { old: 'artillery_resistance.9b4cbc34.svg',       col: 'artillery_resistance.bd49fc96.svg' },
        { old: 'gauss_resistance.bb8f409c.svg',           col: 'gauss_resistance.acf358ed.svg' },
        { old: 'shaft_resistance.0778fd3e.svg',           col: 'shaft_resistance.7e58bc19.svg' },
        { old: 'mine_resistance.dd581c90.svg',            col: 'mine_resistance.0d0d3c98.svg' },
    ];

    const BASE_NEW = 'https://tankionline.com/play/static/images/resistances/';

    function colorResistances(root) {
        root.querySelectorAll('.-maskImage').forEach((el) => {
            const computed = window.getComputedStyle(el);
            const rawMask = computed.getPropertyValue('-webkit-mask-image')
                         || computed.getPropertyValue('mask-image')
                         || '';
            const maskUrl = rawMask.split('"')[1] || '';
            const match = tankResistances.find(r => maskUrl.includes(r.old)
                || maskUrl.endsWith(r.old));
            if (match) {
                el.style.setProperty('-webkit-mask-image', 'none', 'important');
                el.style.setProperty('mask-image', 'none', 'important');
                el.style.setProperty('background',
                    `url(${BASE_NEW + match.col}) center center / 1em 1em no-repeat`,
                    'important');
                el.style.setProperty('width',  '1em', 'important');
                el.style.setProperty('height', '1em', 'important');
            }
        });
    }

    // ── Create pin / show buttons ────────────────────────────────────────────
    function createButtons() {
        const mainHeader = document.querySelector('.BattleTabStatisticComponentStyle-containerInsideTeams');
        if (!mainHeader) return;

        // Pin button
        if (!mainHeader.querySelector('.BattleTabStatisticComponentStyle-pinResistances')) {
            const pinBtn = document.createElement('div');
            pinBtn.className = 'BattleTabStatisticComponentStyle-pinResistances';
            mainHeader.appendChild(pinBtn);

            let pinActive = localStorage.getItem('pinResistances') === 'true';
            if (pinActive) applyPin();

            pinBtn.addEventListener('click', () => {
                pinActive = !pinActive;
                if (pinActive) applyPin(); else removePin();
            });
        }

        // Show button
        if (!mainHeader.querySelector('.BattleTabStatisticComponentStyle-showResistances')) {
            const showBtn = document.createElement('div');
            showBtn.className = 'BattleTabStatisticComponentStyle-showResistances';
            mainHeader.appendChild(showBtn);

            let showActive = localStorage.getItem('showResistances') === 'true';
            if (showActive) applyShow();

            showBtn.addEventListener('click', () => {
                showActive = !showActive;
                if (showActive) applyShow(); else removeShow();
            });
        }
    }

    // ── MutationObserver ─────────────────────────────────────────────────────
    function startObserver() {
        new MutationObserver((mutations) => {
            mutations.forEach(({ addedNodes, target }) => {
                const cn = (typeof target.className === 'string') ? target.className : '';

                if (addedNodes.length && (
                    target.localName === 'tbody' ||
                    cn.includes('BattleComponentStyle-canvasContainer') ||
                    cn.includes('BattleTabStatisticComponentStyle')
                )) {
                    colorResistances(target);
                }

                addedNodes.forEach(node => {
                    if (node.nodeType === 1) colorResistances(node);
                });

                if (cn.includes('BattleComponentStyle-canvasContainer') ||
                    cn.includes('BattleTabStatisticComponentStyle-containerInsideTeams')) {
                    createButtons();
                }

                addedNodes.forEach(node => {
                    if (node.nodeType === 1 && typeof node.className === 'string') {
                        if (node.className.includes('BattleTabStatisticComponentStyle-containerInsideTeams')
                            || node.querySelector && node.querySelector('.BattleTabStatisticComponentStyle-containerInsideTeams')) {
                            createButtons();
                        }
                    }
                });
            });
        }).observe(document.documentElement, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // ── Boot ─────────────────────────────────────────────────────────────────
    function boot() {
        injectBase();
        injectBattleTabCSS();

        if (localStorage.getItem('pinResistances')  === 'true') applyPin();
        if (localStorage.getItem('showResistances') === 'true') applyShow();

        startObserver();

        createButtons();
        colorResistances(document.documentElement);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();

/* ===================== CONTAINER COUNTER ====================== */

(function () {
  'use strict';

  const ICON_HEADER = 'data:image/png;base64,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';
  const ICON_COMMON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAfCAYAAACPvW/2AAALLUlEQVR42q2XW4xd11nH/99aa9/OnHNmfGbGc7U9tsdN4sTOtYBoJSciVKBWRQk1ggeeClGfEFKligfExIgi9YGK0hJIpNCmJSGVJSzUi1Sp0DqJWkpoC6kdx4mdZDz3Ofdz9tnXtb6Ph7GdNCmoqfg/7Ie1tpZ++/99e+n/EX6GVlZWFPBdBdzPZ86c4Rvrn/zkr++PInlQa3pY6+qvlW64U9riiUE3feaxx17c/ukzThngPJ85A8Z7EL0T4tFHzzsiyI31T638xmItUA8Q7EeY+ZTn6RmAUBQOigSkgCylLSHZLvP8lazkL/7NZ813gPMWAE6fPq0B4OzZswy8de7/BXQD6ubLn/nMw8dIy4cI7qMM/kDg0xgzoygcnAOLCJhZiYiIONHKKBBAxCgLhywrLuZF5R/TkX728ce/9eZ7ce2mQ5/+9G+fDEPzm8bnjwi7X/ID8h0zityitM4pIjh2qiwsERGICICAmSECEYEwO2FHZDxRCiFGSRFbm36jyPWXPv95/e0brq2sQP1vUHTvvY94Dz3UfPrAwcbHQJqSpIMsKwEoS6RIKVJETKPRCLMzyxCU2N3dQJomAAhaGxDRdTABM+1hWscgNsYQipyRFXwBDk9Tob76V194/o2VFSjglDpz5rx7e3X0r3zAnu10eh9rNrtQCm5ifJ/Ua5NEYG1toUZxQVsbKTbWDBfZNNXr+zE/v4B6vQprc2RpAscON1wjYogwiUAJizjHDHgI/WAG5B7sZ+UfLBydG3vibzf/9fz5Vb7RZy+//LIAAH34t06ISOkErNmFuO/uedz6vtvQbHexuZ6h2zWYmz2CqFLB1uYmkiR1jclIH13eh/mFCFnWxs7ONQwGXZTWQUSgFIEIEBZkuUOSFEjTklmEo9CYIDCw1j1flPxUkapzTz757x0REBGEHvjQ8e0wpBljWIQ1laJdNYKCnaTRoC6MnBqNem95+ch/LiwsPpgkKdbW1hEPUkSRj6PLU1hY1NjeeQlpFqMoBJ1uDGGHshBYR/A8Rhh4MEbBOSfOsXgeKUiEvCh2rmzkf/+1r/7g0ZWVFaWP3zb/ibKUhi0cxBM6yFrBOVrr5Fi/tkPLy0ty7NgxfenS5Wf+44cvfe6+u2+vZFn5vn6/hXqdCbSNvNjAYDjC9s4QG1tdJGkJ3/NQHQtQr3uIQgOl9J57RKQUUZKx2+lkvNMt64NS3Y+p+e//y5efuaKXjk7/USUyDSKNNAFJQCg1o993UgkbxczsrJmbm9fT01P3V2lwz9pGpzy6PLF05GiBqDqgOInx5rVtNFt9aEWYmapjZqaOWjWEMQrMgAhBESAMDBOHrXaBzVapukOn0pwLX4sWLu8yxc6X9MHDUx93jvcLWOrVgIZpKdFYQHPT07y+kbZs2qq12x0oXXFT++enm63Xlu66p4688OgnFy4jy3OM10IcWJjC9FQNvq8hQnBsQQRopVFYoNUtsLaTY7tTYJRZONF7+36gE+slKqovthsnVg0Lv6a0OtntZdyPCxycr6PICYdvmdF+0Jh7/dKrXLcX1erlLf2KzDjBDr7+jU29vjbE0tIUHjj1y3CcodvbRpqV8EwArVMwEwZxiXYvR3eQIysYIgQhD4ocFGecoKYut8Jz06sXH9u488Pf6oT1SC8uTabs5PcaEx7S1JHnGYpCXb5xbXd4+HA9vOPO4xQXNe61d2V1o5dXxkIygdW7OwP0BjF2d3sCGNo/NY0oqKM/jNFs97G2nWC7OcJg5NiJCJEiBQstBZwaQ0cv4Io+guGbrVgtvv/hjudP8s7Fz+rlY7NTRVF8HCCqVTV2WxkqFYOJmh5cuLi9ubXbUrfdfqhy/OQd5Bnf5GVXaWNp0EtFewFEaew012l9swVFAXaaXaw3ExRWQ5GI8YwSIdJskepxrNMRvFIuylXboFGv363WGtX2fb9ziFtXWHWuPK0PHp6dcGX5SJI6Vasb2FKwupGp1KJ6/NjEmAjvvvD9y+1h3PNOnJwLi7JDo1GGbq+g2QlHB/YrissA1pZodjqoV+oo2cJaESFNrdR7IUvl1bXKHUdeGs3x5qCgbNQDZW148e7zRTiXyKC9CNslCuSLevnw7AQT/2GasecbXzwDshb4yWuj/Np2Fk5PBo07bm0Ew+Fo++LLVwa9QWF6fXadbh4TxJ26RfzAE+wMfZA4AIRa5HEumn64qi60v/OjTyRjMx+8UlZuscMdUVnPKZvm0KEHQVPpcQjcnNiOYpt9jj74wIlHhIq/SxOWIPB1rcoSj5heu9pfS3jftHVlMNMQuvPWGqb3BWmvn7cBChUMOv3EN8bUNZWwEGilBAidzVP9X/YQlbFtzY7PTjYnD1P39e/G5KyBH5H4Y0aM0VTmqRKdcxTWYPNtKe0Jk5dWV8e0Yt+Vae50JSTyDKFWMTMe+9pRhXqJxbd/MJLp8WF0+3JlMc0Eb6x2MVFjHDxQh9ZjoFyQ5Tl5JtevXutRy1Rs3UTPXa0uPWxHaamMT+JX/L3LyYJKB2gVMUkIYiJXPiEvfLNr4hzPMbg7v7+yrz8sbJKxrkSagkD7mkI40fADH1YqNEhSvPDjWIgtSgtUqz7aHUtaDzDZiBCFY8hyhqh0S0m6kbtwTfq70PGudoE/BleALANEACnAsUCRBVsPUq4CIN3abDW3Ot73MqvumpwIFsKAaJTClkVJghqMF5JSCooAz/dhvIgYiupRTp5RNBztBcFRUoK55ND3JclK25SxCXIqQ1ibkrJthKwGaC+AyfUHEUEYUEopW35F1l6/pAEoFPFqv9n5h+04HIjoe6qRV7VlTkpPkDG+A0Ce9ogAKEXQ2kejxtCSY/+kh2pVw/c1jDbICssbzcHYwIxXEAaLzP0QSjySt8LgO9KhQJFCMjwnm2uX9HVeRQRn4/73Otv8bGH0VJaVB5JCdYOoNu5pRSA4AilPKxAIUVAiCkoobaA1wfcMOn1HYxVRm22HkV8FfN8TdnoPht4GsecqQSAiQlorUt6EXLv6Zf22PE04BUOrWS/udM8NO9FTw3br2YRLn5S6uxJGWhEc7X0QhV4BiIUxhChUWN3IkWYWlUiVq1vJtdILK/A8DWECEYj2APCu5Cp7dRyNxtAe/Jv+qb1VMAC1sgJ67vwoBop2Oex8vR8Pv1mIHPP98EjoB6Qh1uiUIAnVqh52Ww6tTiYzkwbDxKVrl669X+2bGCEcu5+cYwKUkLxtqhCQCAgMMBM0CfW7VcTx7+qfkbPl/PnrjgEKp08r/PePN7Je66leVl5myIkgrOwP/ZwqFYv+kNDs5NhXV2SMFscSDEY8J2GtIZXaSUgpgCjCdYDrBREwCCIEZhoONTp9gnNP0885vymICIgEQDWYPfqntxyq/HEtYlrbGpmJmlahT9BaoT+yWF/roahNI2tMAWLfPeIoAkQcklSjF0PiuA2WpxGPf8r8nEAMIgDQRBTn21f/xBw69rpl7/Fbj1SQlc4mCRujFCACTznHlBGkVCRys0mFIBBminON/khLPErg5K9B/BXE7VeAJjTem/ZKee+93taLF14c2bBw0L86tS8MqqHi0rIEvk/TjZpqq4gy0SCICIlAHFOSKWoPlHQGgjQ7B0O/j2Hzn1CkLQAGABN+QZ0G9FnAAY3jk0v1v1haiB5qjCuMYuuu7JZqN5gANAkEitIcMhgBo3Qb7L4GTV9Ab/elm+2Am3cBfmGg61SazsIJANTmP7o4H/75/n3mzivNFIPqFKgogW6cSpr9CKV7EoH9Z3S7/XeM8Yz/Z6m9KRQAEFZmD/6ZN3dwHQtHVjE++5fw9p141w/ylivv0v8AwT5a3lkb9q4AAAAASUVORK5CYII=';
  const ICON_EPIC   = 'data:image/png;base64,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';

  function injectCSS() {
    if (document.getElementById('tt-cc-style')) return;
    const s = document.createElement('style');
    s.id = 'tt-cc-style';
    s.textContent = `
.tt-container-counters-container{align-items:center!important;backdrop-filter:blur(3.125em)!important;background-color:rgba(191,213,255,.15)!important;border-radius:.5em!important;box-shadow:0 0 0 1px rgba(191,213,255,.25)!important;display:flex!important;flex-direction:column!important;font-family:BaseFontMedium,FallbackFontMedium,sans-serif!important;height:16.785em!important;justify-content:center!important;margin-top:1.75em!important;width:22.5em!important;--tt-rare-color:#00d4ff;--tt-epic-color:#884dff;--tt-legendary-color:#e6b800;--tt-exotic-color:#e60000}
.tt-container-counters-container .tt-rare{color:var(--tt-rare-color)!important}
.tt-container-counters-container .tt-epic{color:var(--tt-epic-color)!important}
.tt-container-counters-container .tt-legendary{color:var(--tt-legendary-color)!important}
.tt-container-counters-container .tt-exotic{color:var(--tt-exotic-color)!important}
.tt-container-counters-container .tt-rare-circle{background-color:var(--tt-rare-color)!important;clip-path:circle()!important;display:inline-block!important;height:.9rem!important;width:.9rem!important}
.tt-container-counters-container .tt-epic-circle{background-color:var(--tt-epic-color)!important;clip-path:circle()!important;display:inline-block!important;height:.9rem!important;width:.9rem!important}
.tt-container-counters-container .tt-legendary-circle{background-color:var(--tt-legendary-color)!important;clip-path:circle()!important;display:inline-block!important;height:.9rem!important;width:.9rem!important}
.tt-container-counters-container .tt-exotic-circle{background-color:var(--tt-exotic-color)!important;clip-path:circle()!important;display:inline-block!important;height:.9rem!important;width:.9rem!important}
.tt-container-counters-header{height:6.785em!important;position:relative!important;width:100%!important}
.tt-container-counters-header,.tt-container-counters-header>.tt-title-container{align-items:center!important;display:flex!important;flex-direction:row!important;justify-content:start!important}
.tt-container-counters-header>.tt-title-container{height:4em!important;margin-left:1.5em!important;width:max-content!important}
:is(.tt-container-counters-header>.tt-title-container)>.tt-icon{background-image:url("${ICON_HEADER}")!important;background-repeat:no-repeat!important;background-size:contain!important;height:4em!important;margin-right:1.75em!important;width:5em!important}
:is(.tt-container-counters-header>.tt-title-container)>.tt-title{color:#fff!important;font-size:1.05em!important;line-height:1.6em!important;text-transform:uppercase!important}
.tt-container-counters-body{align-items:center!important;display:flex!important;flex-direction:column!important;height:10em!important;justify-content:center!important;width:100%!important}
.tt-container-counters-table{border-collapse:separate!important;border-spacing:0 1em!important;padding-right:.75em!important;table-layout:fixed!important;width:100%!important}
.tt-container-counters-table td{border-radius:.2em!important;overflow:hidden!important;padding:0!important}
:is(.tt-container-counters-table td):not(:first-child){text-align:center!important}
.tt-count:is(.tt-container-counters-table td){caret-color:transparent!important;color:hsla(0,0%,100%,.8)!important;font-size:1.2em!important;text-align:right!important}
.tt-guarantee:is(.tt-container-counters-table td){font-size:.9em!important;position:relative!important;text-align:left!important;top:.125em!important}
:is(.tt-container-counters-table td):focus{background-color:rgba(230,237,255,.1)!important;color:#fff!important;outline:none!important}
.tt-container-counters-table>tbody>tr{height:3em!important}
.tt-container-counters-table tr:first-child>td:first-child{background-image:url("${ICON_COMMON}")!important}
.tt-container-counters-table tr:last-child>td:first-child{background-image:url("${ICON_EPIC}")!important}
.tt-container-counters-table td:first-child{background-position:50%!important;background-repeat:no-repeat!important;background-size:3.25em!important}`;
    document.head.appendChild(s);
  }

  // original
  function F(langs) {
    const stored = localStorage.language_store_key?.toLowerCase();
    const nav = navigator.languages.map(l => l.split('-')[0].toLowerCase());
    return langs.includes(stored) ? stored : nav.find(l => langs.includes(l)) ?? langs[0];
  }

  // original
  let t = '$unknown$';  // username
  let n = null;         // containerType

  // original i() — counting function
  function i(e) {
    if (null === n || 'none' === e) return;
    let dropped = null;
    switch (e.match(/rgb\([0-9]+, [0-9]+, [0-9]+\)/)[0]) {
      case 'rgb(170, 128, 255)': dropped = 'epic';      break;
      case 'rgb(255, 204, 0)':   dropped = 'legendary'; break;
      case 'rgb(255, 51, 51)':   dropped = 'exotic';    break;
    }
    for (const r of ['epic', 'legendary', 'exotic']) {
      const k = `tt-containers-${n}-${r}-${t}`;
      localStorage[k] = Math.min(parseInt(localStorage[k] ?? '0') + 1, 999).toString();
    }
    if (dropped !== null)
      localStorage[`tt-containers-${n}-${dropped}-${t}`] = '0';
    document.querySelectorAll('.tt-count[data-container][data-reward]').forEach(cell => {
      cell.textContent = localStorage[`tt-containers-${cell.dataset.container}-${cell.dataset.reward}-${t}`] ?? '0';
    });
  }

  // buildMain
  function buildMain(wrapper) {
    const isEn = 'en' === F(['en', 'ru']);
    const header = document.createElement('div');
    header.className = 'tt-container-counters-header';
    header.innerHTML = `
      <div class="tt-title-container">
        <div class="tt-icon"></div>
        <div class="tt-title">${isEn ? 'Container<br>Counter' : 'Счётчик<br>контейнеров'}</div>
      </div>`;
    const body = document.createElement('div');
    body.className = 'tt-container-counters-body';
    const table = document.createElement('table');
    table.className = 'tt-container-counters-table';
    table.innerHTML = `
      <tbody>
        <tr>
          <td colspan="2"></td>
          <td class="tt-count" data-container="common" data-reward="epic" contenteditable="true">0</td>
          <td class="tt-guarantee tt-epic">/100</td>
          <td class="tt-count" data-container="common" data-reward="legendary" contenteditable="true">0</td>
          <td class="tt-guarantee tt-legendary">/300</td>
          <td class="tt-exotic" colspan="2" style="font-size: 1.4em;">—</td>
        </tr>
        <tr>
          <td colspan="2"></td>
          <td class="tt-count" data-container="epic" data-reward="epic" contenteditable="true">0</td>
          <td class="tt-guarantee tt-epic">/15</td>
          <td class="tt-count" data-container="epic" data-reward="legendary" contenteditable="true">0</td>
          <td class="tt-guarantee tt-legendary">/100</td>
          <td class="tt-count" data-container="epic" data-reward="exotic" contenteditable="true">0</td>
          <td class="tt-guarantee tt-exotic">/300</td>
        </tr>
      </tbody>`;
    for (const cell of table.querySelectorAll('td[contenteditable]')) {
      cell.addEventListener('paste', ev => ev.preventDefault());
      cell.addEventListener('keydown', () => {
        const s = document.getSelection();
        s.selectAllChildren(cell);
        s.collapseToEnd();
      });
      cell.addEventListener('keypress', ev => {
        cell.textContent.length > 2 || isNaN(parseInt(ev.key, 10))
          ? ev.preventDefault()
          : cell.textContent === '0' && (cell.textContent = '');
      });
      cell.addEventListener('input', () => {
        const v = parseInt(cell.textContent, 10);
        (!Number.isSafeInteger(v) || v < 0) && (cell.textContent = '0');
        localStorage[`tt-containers-${cell.dataset.container}-${cell.dataset.reward}-${t}`] = cell.textContent;
      });
      cell.textContent = localStorage[`tt-containers-${cell.dataset.container}-${cell.dataset.reward}-${t}`] ?? '0';
    }
    body.appendChild(table);
    wrapper.replaceChildren(header, body);
  }

  // ── addedElement / addedElements helpers ─────────────────
  // addedElements
  function addedElements(sel, cb) {
    new MutationObserver(ms => {
      for (const m of ms)
        for (const node of m.addedNodes)
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches(sel)) cb(node);
            node.querySelectorAll(sel).forEach(cb);
          }
    }).observe(document.documentElement, { childList: true, subtree: true });
    // Also check existing DOM
    document.querySelectorAll(sel).forEach(cb);
  }

  // addedElement
  function addedElement(sel) {
    return new Promise(resolve => {
      // Check if already exists
      const existing = document.querySelector(sel);
      if (existing) { resolve(existing); return; }
      const obs = new MutationObserver(ms => {
        for (const m of ms)
          for (const node of m.addedNodes)
            if (node.nodeType === Node.ELEMENT_NODE) {
              let found = null;
              if (node.matches(sel)) found = node;
              else found = node.querySelector(sel);
              if (found) { obs.disconnect(); resolve(found); return; }
            }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
    });
  }

  // d(...selectors) original — makes :is(sel1, sel2)
  function d(...selectors) {
    return ':is(' + selectors.join(', ') + ')';
  }

  // ── original G() logic ──────────────────────────────────────────────
  function G() {
    // Username tracking
    addedElements('.ContainersComponentStyle-contentContainer', () => {
      t = document.querySelector('.UserInfoContainerStyle-userNameRank')
        ?.textContent.trim().match(/^(\[([\w.-]+)\] )?([\w.-]+)$/)?.[3] ?? '$unknown$';
    });

    // Container type tracking
    addedElements('.ContainersComponentStyle-navigationContainer .-menuItemActive', node => {
      const block = node.parentElement.parentElement;
      const all = block.parentElement.querySelectorAll('.MenuComponentStyle-commonBlock:has(> .MenuComponentStyle-mainMenuItem)');
      n = block === all[0] ? 'common' : block === all[2] ? 'epic' : null;
    });

    // Mount widget
    addedElements('.ContainersComponentStyle-infoPanel', panel => {
      if (panel.querySelector('.tt-container-counters-container')) return;
      const w = document.createElement('div');
      w.className = 'tt-container-counters-container';
      buildMain(w);
      panel.appendChild(w);
    });

    // Batch open — exact original
    addedElements('.ReceivedRewardsComponentStyle-rewards .RewardCardComponentStyle-fastAppearance', node => {
      i(getComputedStyle(node.children[0].children[0]).backgroundImage);
    });

    // Single open — exact original async loop
    (async function loop() {
      while (true) {
        // Wait for the reward card to appear in the animation
        const node = await addedElement('.AnimationOpenContainerComponentStyle-rewardContainer > :first-child');
        const bgImage = getComputedStyle(
          node.matches('.RewardCardComponentStyle-fastAppearance')
            ? node.children[0].children[0]
            : node.children[0]
        ).backgroundImage;

        // Wait for sentinel: either batch results OR back to containers page
        const sentinel = await addedElement(
          d('.ReceivedRewardsComponentStyle-rewards .RewardCardComponentStyle-fastAppearance',
            '.ContainersComponentStyle-contentContainer')
        );

        // Only count if it's NOT a batch open
        if (!sentinel.matches('.RewardCardComponentStyle-fastAppearance')) {
          i(bgImage);
        }

        // Small pause then loop again for next open
        await new Promise(r => setTimeout(r, 500));
      }
    })();
  }

  injectCSS();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', G);
  else G();

})();
