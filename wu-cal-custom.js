/* ===========================================================================
   WU – V6.1 (2025-09-23)
   - Monat-Tab ausblenden (Angular Material) + falls aktiv → auf Woche/Tag umschalten
   - Badge-Text aktualisiert ("V6.1 – HIDE MONTH MATERIAL TAB")
   - Bestehende CSS-/UI-Anpassungen beibehalten
   =========================================================================== */

/* wu-cal-custom.js – CSS-Injection + sichtbarer Badge + "SPACE" -> "Räume" */
(function () {
  const STYLE_ID = "wu-inline-css";
  const BADGE_ID = "wu-inline-badge";

  // === Dein bestehendes CSS (unverändert) ==================================
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
        node.nodeValue = raw.replace(/space/i, "Räume");
        break;
      }
    }
  }

  // NEU (V6.1): Monat-Tab in Angular Material ausblenden + ggf. umschalten
  function hideMonthTabAndSwitch() {
    const header = document.querySelector('mat-tab-header, .mat-mdc-tab-header, [role="tablist"]');
    if (!header) return;

    const tabs = Array.from(header.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    const norm = el => (el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();

    let monthTab = tabs.find(t => /monat/.test(norm(t)));
    const weekTab = tabs.find(t => /woche|week/.test(norm(t)));
    const dayTab  = tabs.find(t => /\btag\b|day/.test(norm(t)));

    const isActive = el =>
      el?.getAttribute('aria-selected') === 'true' ||
      /\b(active|selected|mdc-tab--active|mat-mdc-tab-label-active)\b/i.test(el?.className || '');

    if (monthTab) {
      const wrapper = monthTab.closest('.mat-mdc-tab, .mdc-tab, [role="tab"]') || monthTab;
      wrapper.style.display = 'none';
      wrapper.setAttribute('aria-hidden', 'true');
    }

    if (monthTab && isActive(monthTab)) {
      const target = weekTab || dayTab || tabs.find(t => t !== monthTab);
      if (target && typeof target.click === 'function') target.click();
    }
  }

  function showBadge() {
    const now  = new Date().toLocaleTimeString();
    const text = `✅ V6.1 SCRIPT AKTIV – HIDE MONTH MATERIAL TAB – ${now}`;
    let b = document.getElementById(BADGE_ID);
    if (!b) {
      b = document.createElement("div");
      b.id = BADGE_ID;
      Object.assign(b.style, {
        position: "fixed", top: "12px", right: "12px", zIndex: 999999,
        padding: "8px 10px",
        font: "14px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        background: "#1b5e20", color: "#fff", borderRadius: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,.15)"
      });
      document.documentElement.appendChild(b);
    }
    b.textContent = text;
    setTimeout(() => b.remove(), 6000);
  }

  function applyAll() {
    injectStyle();
    renameSpaceOnce();
    hideMonthTabAndSwitch();
    showBadge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyAll);
  } else {
    applyAll();
  }

  new MutationObserver(() => {
    renameSpaceOnce();
    hideMonthTabAndSwitch();
  }).observe(document.documentElement, { subtree: true, childList: true });

})(); 

/* ===========================================================================
   WU – Klick auf graue Kästchen -> Popover "Nicht verfügbar"
   V7: exakte Zeit inkl. rechter Rand (21–22), robustes X-Clamping
   =========================================================================== */
(function () {
  const STYLE_ID   = "wu-unavail-v7-style";
  const POPOVER_ID = "wu-unavail-popover";

  const CSS = `
#${POPOVER_ID}-backdrop{ position:fixed; inset:0; background:rgba(10,14,19,.25);
  -webkit-backdrop-filter:blur(3px); backdrop-filter:blur(3px);
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
#${POPOVER_ID} .value{ flex:1 1 auto; max-width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
#${POPOVER_ID} .muted{ color:#33543fa8; }
#${POPOVER_ID} .footer{ display:flex; justify-content:flex-end; gap:10px; padding:10px 12px 12px; background:rgba(27,94,32,.06); }
#${POPOVER_ID} button{ appearance:none; border:1px solid rgba(27,94,32,.24); background:#fff;
  padding:8px 12px; border-radius:8px; font:600 13px/1 system-ui; cursor:pointer; }
#${POPOVER_ID} button.primary{ background:#1b5e20; color:#fff; border-color:#1b5e20; }
#${POPOVER_ID} .arrow{ position:absolute; width:14px; height:14px; transform:rotate(45deg); background:inherit; border:inherit; }
`;

  function ensureStyle(){
    if(!document.getElementById(STYLE_ID)){
      const s=document.createElement("style"); s.id=STYLE_ID; s.textContent=CSS; document.head.appendChild(s);
    }
  }

  function dateLabel(){
    const RE = /\b(?:Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag),?\s+(?:Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\s+\d{1,2},?\s+\d{4}\b/;
    const nodes = document.querySelectorAll(".usi-calendarHeader, .chadmo-gridsView .header, .usi-calendarHeader * , .chadmo-gridsView .header * , h1, h2");
    for(const n of nodes){
      const t=(n.textContent||"").replace(/\s+/g," ").trim(); const m=RE.exec(t); if(m) return m[0];
    }
    const m = RE.exec(document.body.innerText||""); return m?m[0]:"";
  }

  function getRoomLabel(cell, x, y){
    const row = cell.closest(".chadmo-row") || cell.parentElement;
    if(row){
      const leftCell = row.querySelector('div[id="0"]') || row.querySelector('.left0') || row.firstElementChild;
      if(leftCell){
        const t=(leftCell.textContent||"").replace(/\s+/g," ").trim(); if(t) return t;
      }
    }
    for(const dx of [60,100,160,220,300,380]){
      const el = document.elementFromPoint(Math.max(0,x-dx), y);
      if(row && el && el.closest(".chadmo-row")!==row) continue;
      const t=(el&&el.textContent||"").replace(/\s+/g," ").trim();
      if(t && t.length<80) return t;
    }
    return "Dieser Raum";
  }

  function measureRow(row){
    const cells = Array.from(row.querySelectorAll('div[id]')).filter(d => /^\d+$/.test(d.id));
    if(!cells.length) return null;
    let startCell = cells.find(c => c.id === "0") || cells.slice().sort((a,b)=>a.getBoundingClientRect().left - b.getBoundingClientRect().left)[0];
    const left0 = startCell.getBoundingClientRect().left;
    const widths = cells.slice(0, Math.min(10, cells.length)).map(c => c.getBoundingClientRect().width).filter(w=>w>5).sort((a,b)=>a-b);
    const width = widths[Math.floor(widths.length/2)] || 60;
    const maxId = Math.max.apply(null, cells.map(c => parseInt(c.id,10)));
    const colCount = maxId + 1;
    return {left0, width, colCount};
  }
  function timeBoundaries(colCount){
    const startHour = 8;
    const len = colCount + 1;
    return Array.from({length: len}, (_,i)=> String(startHour+i).padStart(2,"0")+":00");
  }
  function timeFromClick(cell, clientX){
    const row = cell.closest(".chadmo-row") || cell.parentElement;
    const m = measureRow(row);
    if(!m) return ["",""];

    const bounds = timeBoundaries(m.colCount);
    const minX = m.left0;
    const maxX = m.left0 + m.width * m.colCount - 0.001;
    const clampedX = Math.min(Math.max(clientX, minX), maxX);

    let idx = Math.floor((clampedX - m.left0) / m.width);
    idx = Math.max(0, Math.min(idx, m.colCount - 1));

    return [bounds[idx], bounds[idx+1]];
  }

  function near216Grey(c){ const m=c&&c.match(/\d+/g); if(!m) return false;
    const [r,g,b]=m.map(Number), tol=14; return Math.abs(r-216)<=tol && Math.abs(g-217)<=tol && Math.abs(b-218)<=tol; }
  function isBookedCell(el){
    if(!el || el.nodeType!==1) return false;
    if(el.classList.contains("chadmo-cell") && el.classList.contains("month-cell") && el.classList.contains("last-merge-overlay-cell")) return true;
    if(el.classList.contains("chadmo-cell")){
      const cs=getComputedStyle(el);
      if(near216Grey(cs.backgroundColor) || /\brgb\(\s*216\s*,\s*217\s*,\s*218\s*\)/.test(el.getAttribute("style")||"")) return true;
    }
    return false;
  }
  function bookedCellFromTarget(t){
    let n=t; for(let i=0;i<6 && n;i++){ if(isBookedCell(n)) return n; n=n.parentElement; } return null;
  }

  let backdrop, pop;
  function ensureStyle(){
    if(!document.getElementById(STYLE_ID)){
      const s=document.createElement("style"); s.id=STYLE_ID; s.textContent=CSS; document.head.appendChild(s);
    }
  }
  function ensurePopover(){
    if(!backdrop){ backdrop=document.createElement("div"); backdrop.id=POPOVER_ID+"-backdrop";
      backdrop.addEventListener("click", closePopover, {passive:true}); document.body.appendChild(backdrop); }
    if(!pop){ pop=document.createElement("div"); pop.id=POPOVER_ID;
      pop.innerHTML=`
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
      pop.querySelector(".closeBtn").onclick=closePopover;
      pop.querySelector(".okBtn").onclick=closePopover;
      window.addEventListener("keydown", e=>{ if(e.key==="Escape") closePopover(); });
    }
  }
  function openPopover({x,y,room,from,to}){
    ensureStyle(); ensurePopover();
    pop.querySelector(".room").textContent = room;
    pop.querySelector(".time").textContent = (from&&to)? `${from} – ${to}`:"–";
    pop.querySelector(".date").textContent = dateLabel();

    pop.style.visibility="hidden";
    pop.classList.add("is-open");
    document.getElementById(POPOVER_ID+"-backdrop").classList.add("is-open");
    requestAnimationFrame(()=>{
      const card = pop.querySelector(".card");
      const r = card.getBoundingClientRect();
      let left=x+14, top=y+14, m=8;
      if(left+r.width+m>innerWidth) left=Math.max(m, innerWidth-r.width-m);
      if(top+r.height+m>innerHeight) top=Math.max(m, y-r.height-16);
      pop.style.left=left+"px"; pop.style.top=top+"px";
      pop.style.setProperty("--ox",(x-left)+"px"); pop.style.setProperty("--oy",(y-top)+"px");
      const a=pop.querySelector(".arrow"), s=14;
      a.style.left=(x-left-s/2)+"px"; a.style.top=(y>=top?-s/2:r.height-s/2)+"px";
      pop.style.visibility="visible";
    });
  }
  function closePopover(){ const bd=document.getElementById(POPOVER_ID+"-backdrop");
    if(pop) pop.classList.remove("is-open"); if(bd) bd.classList.remove("is-open"); }

  ensureStyle();
  document.addEventListener("click", (ev)=>{
    const cell = bookedCellFromTarget(ev.target) || document.elementFromPoint(ev.clientX, ev.clientY);
    if(!cell || !isBookedCell(cell)) return;

    const [from,to] = timeFromClick(cell, ev.clientX);
    const room = getRoomLabel(cell, ev.clientX, ev.clientY);
    openPopover({x:ev.clientX, y:ev.clientY, room, from, to});
  }, true);
})();
