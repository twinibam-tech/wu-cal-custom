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
   WU – Klick auf graue Kästchen (chadmo-cell.month-cell…) -> Popover
   V3: selektiert echte DOM-Klassen + arbeitet mit MutationObserver
   =========================================================================== */
(function () {
  const STYLE_ID = "wu-unavail-v3-style";
  const POPOVER_ID = "wu-unavail-popover";
  const TARGET_CLASS = "wu-unavail-cell";
  const HILITE_CLASS = "wu-unavail-hilite";

  const TIMES = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"];

  const CSS = `
.${TARGET_CLASS}{ cursor:pointer; }
.${TARGET_CLASS}.${HILITE_CLASS}{ outline:2px solid rgba(27,94,32,.65); outline-offset:-2px; }

#${POPOVER_ID}-backdrop{ position:fixed; inset:0; background:rgba(10,14,19,.25);
  backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px);
  opacity:0; pointer-events:none; transition:opacity .18s ease; z-index:999998; }
#${POPOVER_ID}-backdrop.is-open{ opacity:1; pointer-events:auto; }

#${POPOVER_ID}{ position:fixed; min-width:320px; max-width:min(92vw,520px);
  color:#0b1a11; z-index:999999; transform-origin:var(--ox,center) var(--oy,center);
  transform:scale(.96) translateY(-2px); opacity:0; pointer-events:none;
  transition:transform .18s cubic-bezier(.2,.7,.2,1), opacity .18s ease; }
#${POPOVER_ID}.is-open{ opacity:1; transform:scale(1) translateY(0); pointer-events:auto; }

#${POPOVER_ID} .card{ background:linear-gradient(180deg,rgba(255,255,255,.9),rgba(255,255,255,.82));
  border:1px solid rgba(26,54,35,.12); border-radius:14px; box-shadow:0 10px 30px rgba(0,0,0,.18); overflow:hidden; }
#${POPOVER_ID} .header{ display:flex; gap:10px; align-items:center; padding:14px 16px 6px; }
#${POPOVER_ID} .dot{ width:22px; height:22px; border-radius:50%;
  background:conic-gradient(from 180deg,#e53935,#ef5350);
  box-shadow:0 0 0 3px #fff inset, 0 0 0 1px rgba(0,0,0,.06);
  display:inline-grid; place-items:center; color:#fff; font-weight:800; }
#${POPOVER_ID} .title{ font:600 16px/1.2 system-ui, -apple-system,"Segoe UI",Roboto,Arial; }
#${POPOVER_ID} .body{ padding:6px 16px 14px; font:14px/1.5 system-ui, -apple-system,"Segoe UI",Roboto,Arial; }
#${POPOVER_ID} .line{ display:flex; gap:8px; align-items:flex-start; margin-top:6px; }
#${POPOVER_ID} .label{ min-width:74px; color:#33543f; font-weight:600; }
#${POPOVER_ID} .muted{ color:#33543fa8; }
#${POPOVER_ID} .footer{ display:flex; justify-content:flex-end; gap:10px; padding:10px 12px 12px; background:rgba(27,94,32,.06); }
#${POPOVER_ID} button{ appearance:none; border:1px solid rgba(27,94,32,.24); background:#fff;
  padding:8px 12px; border-radius:8px; font:600 13px/1 system-ui; cursor:pointer; }
#${POPOVER_ID} button.primary{ background:#1b5e20; color:#fff; border-color:#1b5e20; }
#${POPOVER_ID} .arrow{ position:absolute; width:14px; height:14px; transform:rotate(45deg); background:inherit; border:inherit; }
`;

  /* --- helpers ----------------------------------------------------------- */
  function ensureStyle() {
    if (!document.getElementById(STYLE_ID)) {
      const s = document.createElement('style'); s.id = STYLE_ID; s.textContent = CSS; document.head.appendChild(s);
    }
  }
  function getDateLabel(){
    const el = Array.from(document.querySelectorAll(".usi-calendarHeader, .header, [class*='calendar']"))
      .find(n => /Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember|\d{4}/i.test(n.textContent||""));
    return el ? el.textContent.trim().replace(/\s+/g," ") : "";
  }
  function headerRect(){
    const h = document.querySelector(".chadmo-gridsView .header-columns") ||
              document.querySelector(".chadmo-gridsView .header") ||
              document.querySelector(".chadmo-gridsView");
    return h ? h.getBoundingClientRect() : null;
  }
  function snapTime(x){
    const r = headerRect(); if(!r) return ["",""];
    const rel = Math.min(Math.max(x - r.left,0), r.width-1);
    const idx = Math.max(0, Math.min(TIMES.length-1, Math.floor(rel/(r.width/TIMES.length))));
    return [TIMES[idx]||"", TIMES[idx+1]||""];
  }
  function roomByPeekingLeft(x,y){
    for(const dx of [90,140,200,260]){
      const el = document.elementFromPoint(Math.max(0,x-dx), y);
      const txt = (el && (el.closest('[class*="resource"],[class*="room"],[role="row"]')||el).textContent)||"";
      const t = txt.replace(/\s+/g," ").trim();
      if(t && t.length<80) return t;
    }
    return "Dieser Raum";
  }
  function isTheGrey(el){
    // exakt die Blöcke aus deinem Screenshot:
    if(!el || !el.classList) return false;
    if(!el.classList.contains("chadmo-cell") || !el.classList.contains("month-cell")) return false;
    if(!el.classList.contains("last-merge-overlay-cell")) return false;
    // und sicherheitshalber Farbe prüfen:
    const c = getComputedStyle(el).backgroundColor;
    return /rgb\(\s*216\s*,\s*217\s*,\s*218\s*\)/.test(c); // das Grau aus deinem DOM
  }

  /* --- Popover ----------------------------------------------------------- */
  let backdrop, pop;
  function ensurePopover(){
    if(!backdrop){
      backdrop = document.createElement('div'); backdrop.id = POPOVER_ID+"-backdrop";
      backdrop.addEventListener('click', close); document.body.appendChild(backdrop);
    }
    if(!pop){
      pop = document.createElement('div'); pop.id = POPOVER_ID;
      pop.innerHTML = `
        <div class="card">
          <div class="header"><div class="dot">!</div><div class="title">Nicht verfügbar</div></div>
          <div class="body">
            <div class="line"><div class="label">Raum</div><div class="value room"></div></div>
            <div class="line"><div class="label">Zeit</div><div class="value time"></div></div>
            <div class="line"><div class="label">Datum</div><div class="value date muted"></div></div>
            <div class="line muted" style="margin-top:10px">Dieser Raum ist im gewählten Zeitfenster bereits belegt.</div>
          </div>
          <div class="footer">
            <button class="closeBtn">Schließen</button>
            <button class="primary okBtn">Ok</button>
          </div>
        </div>
        <div class="arrow"></div>`;
      document.body.appendChild(pop);
      pop.querySelector('.closeBtn').onclick = close;
      pop.querySelector('.okBtn').onclick = close;
      window.addEventListener('keydown', e => e.key==="Escape" && close());
    }
  }
  function openAt(x,y,room,from,to){
    ensureStyle(); ensurePopover();
    pop.querySelector('.room').textContent = room;
    pop.querySelector('.time').textContent = (from&&to)? `${from} – ${to}` : "–";
    pop.querySelector('.date').textContent = getDateLabel();

    pop.style.visibility="hidden";
    pop.classList.add("is-open");
    backdrop.classList.add("is-open");
    requestAnimationFrame(()=>{
      const card = pop.querySelector('.card');
      const r = card.getBoundingClientRect();
      let left = x+14, top = y+14, m=8;
      if(left+r.width+m>innerWidth) left = Math.max(m, innerWidth-r.width-m);
      if(top+r.height+m>innerHeight) top = Math.max(m, y-r.height-16);
      pop.style.left = left+"px"; pop.style.top = top+"px";
      pop.style.setProperty('--ox', (x-left)+"px"); pop.style.setProperty('--oy', (y-top)+"px");
      const a = pop.querySelector('.arrow'); const s=14;
      a.style.left = (x-left-s/2)+"px"; a.style.top = (y>=top? -s/2 : r.height - s/2)+"px";
      pop.style.visibility="visible";
    });
  }
  function close(){ pop && pop.classList.remove("is-open"); backdrop && backdrop.classList.remove("is-open"); }

  /* --- Markieren & Events ----------------------------------------------- */
  function markGreyCells(root=document){
    root.querySelectorAll('div.chadmo-cell.month-cell.last-merge-overlay-cell').forEach(el=>{
      if(isTheGrey(el) && !el.classList.contains(TARGET_CLASS)){
        el.classList.add(TARGET_CLASS);
        el.addEventListener('mouseenter', ()=> el.classList.add(HILITE_CLASS));
        el.addEventListener('mouseleave', ()=> el.classList.remove(HILITE_CLASS));
      }
    });
  }

  // initial + bei DOM-Updates (Angular)
  ensureStyle();
  markGreyCells();
  const mo = new MutationObserver(muts=>{
    for(const m of muts){
      if(m.addedNodes && m.addedNodes.length){
        m.addedNodes.forEach(n=> n.nodeType===1 && markGreyCells(n));
      }
    }
  });
  mo.observe(document.body, {subtree:true, childList:true});

  // delegierter Click (sicherer als pro-Zelle)
  document.addEventListener('click', (ev)=>{
    const cell = ev.target.closest('.'+TARGET_CLASS) || ev.target.closest('div.chadmo-cell.month-cell.last-merge-overlay-cell');
    if(!cell || !isTheGrey(cell)) return;

    const x = ev.clientX, y = ev.clientY;
    const [from,to] = snapTime(x);
    const room = roomByPeekingLeft(x,y);
    openAt(x,y,room,from,to);
  }, true);
})();
