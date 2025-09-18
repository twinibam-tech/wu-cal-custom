/* wu-cal-custom.js – CSS-Injection + sichtbarer Badge + "SPACE" -> "Verfügbarkeiten" */
(function () {
  const STYLE_ID = "wu-inline-css";
  const BADGE_ID = "wu-inline-badge";

  // === Dein funktionierendes CSS (unverändert) ===
  const CSS = `
/* ============================================================================ */
/* ===== Header Logo (smaller, moved inward, responsive) ====================== */
/* ============================================================================ */
.usi-gradientbackground{
  position: relative;
  padding-right: clamp(120px, 12vw, 220px) !important;
}
.usi-gradientbackground::after{
  content: ""; position: absolute;
  right: clamp(28px, 4vw, 56px);
  top: 50%; transform: translateY(-48%);
  height: clamp(56px, 7.5vw, 96px); aspect-ratio: 16 / 9;
  -webkit-mask-image: url("https://www.wu.ac.at/typo3temp/assets/_processed_/0/a/csm_news_fallback_lg_692ea2c9f7.png");
  mask-image: url("https://www.wu.ac.at/typo3temp/assets/_processed_/0/a/csm_news_fallback_lg_692ea2c9f7.png");
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  -webkit-mask-size: contain; mask-size: contain;
  -webkit-mask-position: center; mask-position: center;
  background-color: #fff; opacity: .95; pointer-events: none; z-index: 0;
}
@supports not (-webkit-mask-image: url("")) {
  .usi-gradientbackground::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Logo_Wirtschaftsuniversit%C3%A4t_Wien.svg/251px-Logo_Wirtschaftsuniversit%C3%A4t_Wien.svg.png");
    background-repeat: no-repeat; background-size: contain; background-position: center;
    filter: brightness(0) invert(1);
  }
}
@media (max-width: 1200px){
  .usi-gradientbackground{ padding-right: clamp(110px, 10vw, 180px) !important; }
  .usi-gradientbackground::after{ right: clamp(20px, 3vw, 40px); height: clamp(48px, 6.5vw, 84px); }
}
@media (max-width: 600px){ .usi-gradientbackground::after{ display:none; } }

/* ============================================================================ */
/* ===== Desktop/Tablet: Zeit-Labels im Grid ersetzen ======================== */
/* ============================================================================ */
.chadmo-gridsView .header-columns .header-column .mergedHeaderContent{font-size:0!important;}
.chadmo-gridsView .header-columns .header-column .mergedHeaderContent::before{font-size:16px!important;line-height:1;display:inline-block;}
.chadmo-gridsView .header-columns .header-column:nth-of-type(2)  .mergedHeaderContent::before{content:"08:00";}
.chadmo-gridsView .header-columns .header-column:nth-of-type(3)  .mergedHeaderContent::before{content:"09:00";}
.chadmo-gridsView .header-columns .header-column:nth-of-type(4)  .mergedHeaderContent::before{content:"10:00";}
.chadmo-gridsView .header-columns .header-column:nth-of-type(5)  .mergedHeaderContent::before{content:"11:00";}
.chadmo-gridsView .header-columns .header-column:nth-of-type(6)  .mergedHeaderContent::before{content:"12:00";}
.chadmo-gridsView .header-columns .header-column:nth-of-type(7)  .mergedHeaderContent::before{content:"13:00";}
.chadmo-gridsView .header-columns .header-column:nth-of-type(8)  .mergedHeaderContent::before{content:"14:00";}
.chadmo-gridsView .header-columns .header-column:nth-of-type(9)  .mergedHeaderContent::before{content:"15:00";}
.chadmo-gridsView .header-columns .header-column:nth-of-type(10) .mergedHeaderContent::before{content:"16:00";}
.chadmo-gridsView .header-columns .header-column:nth-of-type(11) .mergedHeaderContent::before{content:"17:00";}
.chadmo-gridsView .header-columns .header-column:nth-of-type(12) .mergedHeaderContent::before{content:"18:00";}
.chadmo-gridsView .header-columns .header-column:nth-of-type(13) .mergedHeaderContent::before{content:"19:00";}
.chadmo-gridsView .header-columns .header-column:nth-of-type(14) .mergedHeaderContent::before{content:"20:00";}
.chadmo-gridsView .header-columns .header-column:nth-of-type(15) .mergedHeaderContent::before{content:"21:00";}

/* ============================================================================ */
/* ===== Mobile: ✓ vor jeder vorhandenen Zeitzeile =========================== */
/* ============================================================================ */
@media screen and (max-width: 768px), (hover:none) and (pointer:coarse){
  .usi-calendarHeader::before{
    content:"✓ Verfügbar = Raum ist im angegebenen Zeitfenster frei.";
    display:block; margin:12px 0 10px; padding:6px 10px;
    font-size:13px; font-weight:600; color:#1b5e20;
    background:#e8f5e9; border:1px solid #b7e1c0; border-radius:6px;
  }
  app-calendar-mobile-view
  .usi-calendarDisplayMobile_description ~ .ng-star-inserted:not(.usi-calendarDisplayMobile_container):not(:empty){
    display:flex; align-items:center; gap:6px;
  }
  app-calendar-mobile-view
  .usi-calendarDisplayMobile_description ~ .ng-star-inserted:not(.usi-calendarDisplayMobile_container):not(:empty)::before{
    content:"✓"; color:#2e7d32; font-weight:800; display:inline-block; min-width:1em;
  }
  app-calendar-mobile-view
  .usi-calendarDisplayMobile_container .ng-star-inserted:not(:empty){
    display:flex; align-items:center; gap:6px;
  }
  app-calendar-mobile-view
  .usi-calendarDisplayMobile_container .ng-star-inserted:not(:empty)::before{
    content:"✓"; color:#2e7d32; font-weight:800; display:inline-block; min-width:1em;
  }
}
  `;

  function injectStyle() {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }
  }

  function renameSpaceOnce() {
    const gridHeader =
      document.querySelector(".chadmo-gridsView .header") ||
      document.querySelector(".chadmo-gridsView");
    if (!gridHeader) return;

    const walker = document.createTreeWalker(gridHeader, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const raw = node.nodeValue;
      if (!raw) continue;
      const trimmed = raw.replace(/\s+/g, " ").trim();
      if (/^space$/i.test(trimmed)) {
        node.nodeValue = raw.replace(/space/i, "Verfügbarkeiten");
        break;
      }
    }
  }

  function showBadge() {
    if (document.getElementById(BADGE_ID)) return;
    const b = document.createElement("div");
    b.id = BADGE_ID;
    b.textContent = "✅ Space2 SCRIPT AKTIV – " + new Date().toLocaleTimeString();
    Object.assign(b.style, {
      position: "fixed", top: "12px", right: "12px", zIndex: 999999,
      padding: "8px 10px",
      font: "14px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      background: "#1b5e20", color: "#fff", borderRadius: "6px",
      boxShadow: "0 2px 8px rgba(0,0,0,.15)"
    });
    document.documentElement.appendChild(b);
    setTimeout(() => b.remove(), 6000);
  }

  function applyAll() {
    injectStyle();
    renameSpaceOnce();
    showBadge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyAll);
  } else {
    applyAll();
  }

  new MutationObserver(() => renameSpaceOnce())
    .observe(document.documentElement, {subtree:true, childList:true});
})();

/* ===========================================================================
   WU – Klick auf graue Kästchen -> schönes Popover "nicht verfügbar"
   Keine Abhängigkeiten, arbeitet heuristisch (Farberkennung, Spalten-Snapping)
   =========================================================================== */
(function () {
  const STYLE_ID = "wu-unavailable-popover-style";
  const POPOVER_ID = "wu-unavailable-popover";
  const RIPPLE_ID  = "wu-unavailable-ripple";
  const TIMES = [
    "08:00","09:00","10:00","11:00","12:00","13:00","14:00",
    "15:00","16:00","17:00","18:00","19:00","20:00","21:00"
  ];

  const CSS = `
#${POPOVER_ID}-backdrop{
  position: fixed; inset: 0; background: rgba(10,14,19,.25);
  backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
  opacity: 0; pointer-events: none; transition: opacity .18s ease;
  z-index: 999998;
}
#${POPOVER_ID}-backdrop.is-open{ opacity: 1; pointer-events: auto; }

#${POPOVER_ID}{
  position: fixed; min-width: 320px; max-width: min(92vw, 520px);
  color: #0b1a11; z-index: 999999; transform-origin: var(--ox, center) var(--oy, center);
  transform: scale(.96) translateY(-2px); opacity: 0; pointer-events: none;
  transition: transform .18s cubic-bezier(.2,.7,.2,1), opacity .18s ease;
}
#${POPOVER_ID}.is-open{ opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }

#${POPOVER_ID} .card{
  background: linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.82));
  border: 1px solid rgba(26,54,35,.12);
  border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,.18);
  overflow: hidden;
}
#${POPOVER_ID} .header{
  display:flex; gap:10px; align-items:center; padding:14px 16px 6px 16px;
}
#${POPOVER_ID} .dot{
  width:22px; height:22px; border-radius:50%;
  background: conic-gradient(from 180deg, #e53935, #ef5350);
  box-shadow: 0 0 0 3px #fff inset, 0 0 0 1px rgba(0,0,0,.06);
  display:inline-grid; place-items:center; color:#fff; font-weight:800;
}
#${POPOVER_ID} .title{ font: 600 16px/1.2 system-ui, -apple-system, "Segoe UI", Roboto, Arial; }
#${POPOVER_ID} .body{ padding: 6px 16px 14px 16px; font: 14px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, Arial; }
#${POPOVER_ID} .line{ display:flex; gap:8px; align-items:flex-start; margin-top:6px; }
#${POPOVER_ID} .label{ min-width:74px; color:#33543f; font-weight:600; }
#${POPOVER_ID} .muted{ color:#33543fa8; }
#${POPOVER_ID} .footer{ display:flex; justify-content:flex-end; gap:10px; padding:10px 12px 12px; background: rgba(27,94,32,.06); }
#${POPOVER_ID} button{
  appearance:none; border:1px solid rgba(27,94,32,.24); background:#fff;
  padding:8px 12px; border-radius:8px; font: 600 13px/1 system-ui; cursor:pointer;
}
#${POPOVER_ID} button.primary{ background:#1b5e20; color:#fff; border-color:#1b5e20; }
#${POPOVER_ID} .arrow{ position:absolute; width:14px; height:14px; transform: rotate(45deg); background: inherit; border: inherit; }

@keyframes wuRipple {
  from { transform: scale(0); opacity: .28; }
  to   { transform: scale(1); opacity: 0; }
}
.${RIPPLE_ID}{ /* Ripple Kreis */
  position:absolute; pointer-events:none; border-radius:999px;
  width:42px; height:42px; margin:-21px 0 0 -21px;
  background: radial-gradient(circle at center, rgba(0,0,0,.18), rgba(0,0,0,0) 60%);
  animation: wuRipple .5s ease-out forwards;
}
  `;

  function ensureStyle() {
    if (!document.getElementById(STYLE_ID)) {
      const s = document.createElement('style');
      s.id = STYLE_ID; s.textContent = CSS; document.head.appendChild(s);
    }
  }

  const $ = (sel, root=document) => root.querySelector(sel);

  function getDateLabel() {
    const cand = Array.from(document.querySelectorAll("*"))
      .find(n => n.textContent && /[0-9]{4}|Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember/i.test(n.textContent) && n.tagName!=="SCRIPT" && n.tagName!=="STYLE");
    return cand ? cand.textContent.trim().replace(/\s+/g," ") : "";
  }

  function rgbToGreyScore(rgbString){
    const m = rgbString && rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return [false, 0];
    const r = +m[1], g = +m[2], b = +m[3];
    const dif = Math.max(Math.abs(r-g), Math.abs(g-b), Math.abs(b-r));
    const light = (r+g+b)/3;
    const isGreyish = dif < 16 && light > 150 && light < 235;
    return [isGreyish, light];
  }

  function isGreyBox(el){
    if (!el || !(el instanceof Element)) return false;
    const cs = getComputedStyle(el);
    if (cs.display === "inline" || cs.visibility === "hidden" || cs.opacity === "0") return false;
    const [isGrey] = rgbToGreyScore(cs.backgroundColor);
    if (isGrey) return true;
    const parent = el.parentElement;
    if (parent) {
      const [pGrey] = rgbToGreyScore(getComputedStyle(parent).backgroundColor);
      if (pGrey) return true;
    }
    return false;
  }

  function getGridHeaderRect(){
    const header = document.querySelector(".chadmo-gridsView .header-columns") ||
                   document.querySelector(".chadmo-gridsView .header") ||
                   document.querySelector(".chadmo-gridsView");
    return header ? header.getBoundingClientRect() : null;
  }

  function snapToTimeRange(x){
    const rect = getGridHeaderRect();
    if (!rect) return ["", ""];
    const rel = Math.min(Math.max(x - rect.left, 0), rect.width - 1);
    const idx = Math.max(0, Math.min(TIMES.length - 1, Math.floor(rel / (rect.width / TIMES.length))));
    const from = TIMES[idx] || "";
    const to   = TIMES[idx+1] || "";
    return [from, to];
  }

  function findRoomNameByPeekingLeft(clientX, clientY){
    const steps = [90, 140, 200, 260];
    for (const dx of steps){
      const el = document.elementFromPoint(Math.max(0, clientX - dx), clientY);
      if (!el) continue;
      const txt = (el.closest('[class*="resource"], [class*="room"], [role="row"], [class*="row"]') || el)
                    .textContent || "";
      const cleaned = txt.replace(/\s+/g," ").trim();
      if (cleaned && cleaned.length <= 80 && /[A-ZÄÖÜ0-9]/i.test(cleaned)) return cleaned;
    }
    return "Dieser Raum";
  }

  let $backdrop, $popover;

  function ensurePopover(){
    if (!$backdrop){
      $backdrop = document.createElement('div');
      $backdrop.id = POPOVER_ID + "-backdrop";
      document.body.appendChild($backdrop);
      $backdrop.addEventListener('click', closePopover, {passive:true});
    }
    if (!$popover){
      $popover = document.createElement('div');
      $popover.id = POPOVER_ID;
      $popover.innerHTML = `
        <div class="card">
          <div class="header">
            <div class="dot">!</div>
            <div class="title">Nicht verfügbar</div>
          </div>
          <div class="body">
            <div class="line"><div class="label">Raum</div><div class="value room"></div></div>
            <div class="line"><div class="label">Zeit</div><div class="value time"></div></div>
            <div class="line"><div class="label">Datum</div><div class="value date muted"></div></div>
            <div class="line muted" style="margin-top:10px">
              Dieser Raum ist im gewählten Zeitfenster bereits belegt.
            </div>
          </div>
          <div class="footer">
            <button class="closeBtn">Schließen</button>
            <button class="primary okBtn">Ok</button>
          </div>
        </div>
        <div class="arrow"></div>
      `;
      document.body.appendChild($popover);
      $popover.querySelector('.closeBtn').addEventListener('click', closePopover);
      $popover.querySelector('.okBtn').addEventListener('click', closePopover);
      window.addEventListener('keydown', (e)=>{ if(e.key==="Escape") closePopover(); });
    }
  }

  function openPopover({x, y, room, from, to}){
    ensureStyle(); ensurePopover();

    const dateLabel = getDateLabel();
    $popover.querySelector('.room').textContent = room || "Dieser Raum";
    $popover.querySelector('.time').textContent = (from && to) ? `${from} – ${to}` : "–";
    $popover.querySelector('.date').textContent = dateLabel || "";

    const card = $popover.querySelector('.card');
    $popover.style.visibility = "hidden";
    $popover.classList.add('is-open');
    $backdrop.classList.add('is-open');
    requestAnimationFrame(() => {
      const popRect = card.getBoundingClientRect();
      let left = x + 14, top = y + 14;
      const margin = 8;
      if (left + popRect.width + margin > window.innerWidth) left = Math.max(margin, window.innerWidth - popRect.width - margin);
      if (top + popRect.height + margin > window.innerHeight) top = Math.max(margin, y - popRect.height - 16);
      $popover.style.left = left + "px";
      $popover.style.top  = top + "px";
      $popover.style.setProperty('--ox', (x - left) + "px");
      $popover.style.setProperty('--oy', (y - top) + "px");

      const arrow = $popover.querySelector('.arrow');
      const aSize = 14;
      arrow.style.left = (x - left - aSize/2) + "px";
      arrow.style.top  = (y >= top ? -aSize/2 : popRect.height - aSize/2) + "px";
      $popover.style.visibility = "visible";
    });
  }

  function closePopover(){
    if ($popover) $popover.classList.remove('is-open');
    if ($backdrop) $backdrop.classList.remove('is-open');
  }

  function rippleAt(x,y){
    const r = document.createElement('div');
    r.className = RIPPLE_ID;  // <-- Fix: echte Klasse statt Literal
    r.style.left = x + "px";
    r.style.top  = y + "px";
    document.body.appendChild(r);
    setTimeout(()=> r.remove(), 520);
  }

  ensureStyle();

  document.addEventListener('click', function(ev){
    const grid = ev.target.closest('.chadmo-gridsView, app-calendar-grid, app-calendar-week, app-calendar-day') || document.querySelector('.chadmo-gridsView');
    if (!grid) return;

    let el = ev.target;
    let hitGrey = null;
    for (let i=0; i<6 && el && el !== grid; i++, el = el.parentElement){
      if (isGreyBox(el)) { hitGrey = el; break; }
    }
    if (!hitGrey) return;

    rippleAt(ev.clientX, ev.clientY);

    const [from, to] = snapToTimeRange(ev.clientX);
    const room = findRoomNameByPeekingLeft(ev.clientX, ev.clientY);

    openPopover({ x: ev.clientX, y: ev.clientY, room, from, to });
  }, true);
})();
