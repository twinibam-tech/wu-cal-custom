
/* wu-cal-custom.js – CSS-Injection + "SPACE" -> "Räume" (ohne Badge) */
(function () {
  const STYLE_ID = "wu-inline-css";

  const CSS = `
  /* Einheitliche Schriftgrößen & vertikale Ausrichtung für alle Eingabefelder oben */
.mat-mdc-form-field-infix input,
.mat-mdc-select-value-text,
.mat-mdc-form-field-infix .mat-mdc-select-value,
.mat-mdc-form-field-infix .mat-mdc-form-field-label,
.mat-mdc-form-field-infix {
  font-size: 15px !important;
  font-weight: 500 !important;
  line-height: 1.4 !important;
  vertical-align: middle !important;
}

/* Label konsistent */
.mat-mdc-form-field-label {
  font-size: 14px !important;
  font-weight: 500 !important;
  opacity: 0.9 !important;
}

/* Dropdown-Pfeile und Kalender-Icons anpassen */
.mat-mdc-select-arrow,
.mat-datepicker-toggle-default-icon {
  transform: scale(1.05);
  opacity: 0.8;
}

/* Abstand innerhalb der Felder angleichen */
.mat-mdc-form-field-infix {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}

/* Header-Logo leicht nach innen & responsive */
.usi-gradientbackground{ position:relative; padding-right:clamp(120px,12vw,220px)!important; }
.usi-gradientbackground::after{
  content:""; position:absolute; right:clamp(28px,4vw,56px); top:50%; transform:translateY(-48%);
  height:clamp(56px,7.5vw,96px); aspect-ratio:16/9;
  -webkit-mask-image:url("https://www.wu.ac.at/typo3temp/assets/_processed_/0/a/csm_news_fallback_lg_692ea2c9f7.png");
  mask-image:url("https://www.wu.ac.at/typo3temp/assets/_processed_/0/a/csm_news_fallback_lg_692ea2c9f7.png");
  -webkit-mask-repeat:no-repeat; mask-repeat:no-repeat;
  -webkit-mask-size:contain; mask-size:contain;
  -webkit-mask-position:center; mask-position:center;
  background-color:#fff; opacity:.95; pointer-events:none; z-index:0;
}
@supports not (-webkit-mask-image: url("")){
  .usi-gradientbackground::after{
    background-image:url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Logo_Wirtschaftsuniversit%C3%A4t_Wien.svg/251px-Logo_Wirtschaftsuniversit%C3%A4t_Wien.svg.png");
    background-repeat:no-repeat; background-size:contain; background-position:center;
    filter:brightness(0) invert(1);
  }
}
@media (max-width:1200px){ .usi-gradientbackground{padding-right:clamp(110px,10vw,180px)!important;}
  .usi-gradientbackground::after{ right:clamp(20px,3vw,40px); height:clamp(48px,6.5vw,84px); } }
@media (max-width:600px){ .usi-gradientbackground::after{ display:none; } }

/* Desktop: Header-Zeiten überschreiben */
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

  `;

  function injectStyle(){
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }
  }

  function renameSpaceOnce(){
    const gridHeader = document.querySelector(".chadmo-gridsView .header") || document.querySelector(".chadmo-gridsView");
    if (!gridHeader) return;
    const walker = document.createTreeWalker(gridHeader, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const raw = node.nodeValue || "";
      const trimmed = raw.replace(/\s+/g," ").trim();
      if (/^space$/i.test(trimmed)) { node.nodeValue = raw.replace(/space/i,"Räume"); break; }
    }
  }

  function hideMonthTabAndSwitch(){
    const headers = document.querySelectorAll('mat-tab-header, .mat-mdc-tab-header, [role="tablist"]');
    headers.forEach(header => {
      const tabs = Array.from(header.querySelectorAll('div[role="tab"]'));
      if (!tabs.length) return;

      const norm = el => (el.textContent || "").replace(/\s+/g," ").trim().toLowerCase();
      const isActive = el =>
        el?.getAttribute("aria-selected") === "true" ||
        /\b(active|selected|mdc-tab--active|mat-mdc-tab-label-active)\b/i.test(el?.className || "");

      const monthTabs = tabs.filter(t => /(^|[\s])monat([\s]|$)/.test(norm(t)));
      const weekTab   = tabs.find(t => /woche|week/.test(norm(t)));
      const dayTab    = tabs.find(t => /\btag\b|day/.test(norm(t)));

      let monthWasActive = false;
      monthTabs.forEach(mt => {
        if (isActive(mt)) monthWasActive = true;
        const wrapper = mt.closest('.mat-mdc-tab, .mdc-tab, [role="tab"]') || mt;
        wrapper.style.display = "none";
        wrapper.setAttribute("aria-hidden","true");
      });

      if (monthWasActive) {
        const target = weekTab || dayTab || tabs.find(t => !monthTabs.includes(t));
        if (target && typeof target.click === "function") target.click();
      }
    });
  }

  function applyAll(){
    injectStyle();
    renameSpaceOnce();
    hideMonthTabAndSwitch();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyAll);
  } else {
    applyAll();
  }

  new MutationObserver(() => {
    renameSpaceOnce();
    hideMonthTabAndSwitch();
  }).observe(document.documentElement, {subtree:true, childList:true});
})(); 


/* ============================================================================
   WU – Klick auf graue Kästchen -> Popover "Nicht verfügbar"
   V7: exakte Zeit inkl. rechter Rand (21–22), robustes X-Clamping
   ============================================================================ */
(function () {
  const STYLE_ID = "wu-unavail-v7-style";
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
#${POPOVER_ID} .dot{ width:22px; height:22px; border-radius:50%; background:conic-gradient(from 180deg,#e53935,#ef5350);
  box-shadow:0 0 0 3px #fff inset, 0 0 0 1px rgba(0,0,0,.06); display:inline-grid; place-items:center; color:#fff; font-weight:800; }
#${POPOVER_ID} .title{ font:600 16px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial; }
#${POPOVER_ID} .body{ padding:6px 16px 14px; font:14px/1.5 system-ui,-apple-system,Segoe UI,Roboto,Arial; }
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
    if (!document.getElementById(STYLE_ID)) {
      const s = document.createElement("style");
      s.id = STYLE_ID;
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  }

  function dateLabel(){
    const RE = /\b(?:Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag),?\s+(?:Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\s+\d{1,2},?\s+\d{4}\b/;
    const nodes = document.querySelectorAll(".usi-calendarHeader, .chadmo-gridsView .header, .usi-calendarHeader *, .chadmo-gridsView .header *, h1, h2");
    for (const n of nodes){
      const t = (n.textContent || "").replace(/\s+/g," ").trim();
      const m = RE.exec(t); if (m) return m[0];
    }
    const m = RE.exec(document.body.innerText || ""); return m ? m[0] : "";
  }

  function getRoomLabel(cell, x, y){
    const row = cell.closest(".chadmo-row") || cell.parentElement;
    if (row){
      const leftCell = row.querySelector('div[id="0"]') || row.querySelector('.left0') || row.firstElementChild;
      if (leftCell){
        const t = (leftCell.textContent || "").replace(/\s+/g," ").trim(); if (t) return t;
      }
    }
    for (const dx of [60,100,160,220,300,380]){
      const el = document.elementFromPoint(Math.max(0, x - dx), y);
      if (row && el && el.closest(".chadmo-row") !== row) continue;
      const t = (el && el.textContent || "").replace(/\s+/g," ").trim();
      if (t && t.length < 80) return t;
    }
    return "Dieser Raum";
  }

  function measureRow(row){
    const cells = Array.from(row.querySelectorAll('div[id]')).filter(d => /^\d+$/.test(d.id));
    if (!cells.length) return null;
    let startCell = cells.find(c => c.id === "0") || cells.slice().sort((a,b)=>a.getBoundingClientRect().left - b.getBoundingClientRect().left)[0];
    const left0 = startCell.getBoundingClientRect().left;
    const widths = cells.slice(0, Math.min(10, cells.length)).map(c => c.getBoundingClientRect().width).filter(w=>w>5).sort((a,b)=>a-b);
    const width = widths[Math.floor(widths.length/2)] || 60;
    const maxId = Math.max.apply(null, cells.map(c => parseInt(c.id,10)));
    const colCount = maxId + 1;
    return {left0, width, colCount};
  }
  function timeBoundaries(colCount){
    const startHour = 8; const len = colCount + 1;
    return Array.from({length: len}, (_,i) => String(startHour+i).padStart(2,"0")+":00");
  }
  function timeFromClick(cell, clientX){
    const row = cell.closest(".chadmo-row") || cell.parentElement;
    const m = measureRow(row); if (!m) return ["",""];
    const bounds = timeBoundaries(m.colCount);
    const minX = m.left0, maxX = m.left0 + m.width * m.colCount - 0.001;
    const clampedX = Math.min(Math.max(clientX, minX), maxX);
    let idx = Math.floor((clampedX - m.left0) / m.width);
    idx = Math.max(0, Math.min(idx, m.colCount - 1));
    return [bounds[idx], bounds[idx+1]];
  }

  function near216Grey(c){ const m = c && c.match(/\d+/g); if(!m) return false;
    const [r,g,b] = m.map(Number), tol = 14;
    return Math.abs(r-216)<=tol && Math.abs(g-217)<=tol && Math.abs(b-218)<=tol; }
  function isBookedCell(el){
    if(!el || el.nodeType !== 1) return false;
    if(el.classList.contains("chadmo-cell") && el.classList.contains("month-cell") && el.classList.contains("last-merge-overlay-cell")) return true;
    if(el.classList.contains("chadmo-cell")){
      const cs = getComputedStyle(el);
      if(near216Grey(cs.backgroundColor) || /\brgb\(\s*216\s*,\s*217\s*,\s*218\s*\)/.test(el.getAttribute("style")||"")) return true;
    }
    return false;
  }
  function bookedCellFromTarget(t){
    let n = t; for (let i=0; i<6 && n; i++){ if(isBookedCell(n)) return n; n = n.parentElement; } return null;
  }

  let backdrop, pop;
  function ensurePopover(){
    if(!backdrop){ backdrop=document.createElement("div"); backdrop.id=POPOVER_ID+"-backdrop";
      backdrop.addEventListener("click", closePopover, {passive:true}); document.body.appendChild(backdrop); }
    if(!pop){ pop=document.createElement("div"); pop.id=POPOVER_ID;
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
      pop.querySelector(".closeBtn").onclick = closePopover;
      pop.querySelector(".okBtn").onclick = closePopover;
      window.addEventListener("keydown", e => { if (e.key === "Escape") closePopover(); });
    }
  }
  function openPopover({x,y,room,from,to}){
    ensureStyle(); ensurePopover();
    pop.querySelector(".room").textContent = room;
    pop.querySelector(".time").textContent = (from&&to)? `${from} – ${to}` : "–";
    pop.querySelector(".date").textContent = dateLabel();

    pop.style.visibility="hidden";
    pop.classList.add("is-open");
    document.getElementById(POPOVER_ID+"-backdrop").classList.add("is-open");
    requestAnimationFrame(() => {
      const card = pop.querySelector(".card");
      const r = card.getBoundingClientRect();
      let left = x + 14, top = y + 14, m = 8;
      if (left + r.width + m > innerWidth)  left = Math.max(m, innerWidth - r.width - m);
      if (top  + r.height + m > innerHeight) top = Math.max(m, y - r.height - 16);
      pop.style.left = left + "px"; pop.style.top = top + "px";
      pop.style.setProperty("--ox", (x-left) + "px"); pop.style.setProperty("--oy", (y-top) + "px");
      const a = pop.querySelector(".arrow"), s = 14;
      a.style.left = (x-left-s/2) + "px"; a.style.top = (y >= top ? -s/2 : r.height - s/2) + "px";
      pop.style.visibility="visible";
    });
  }
  function closePopover(){
    const bd = document.getElementById(POPOVER_ID+"-backdrop");
    if (pop) pop.classList.remove("is-open");
    if (bd)  bd.classList.remove("is-open");
  }

  ensureStyle();
  document.addEventListener("click", ev => {
    const cell = bookedCellFromTarget(ev.target) || document.elementFromPoint(ev.clientX, ev.clientY);
    if (!cell || !isBookedCell(cell)) return;
    const [from,to] = timeFromClick(cell, ev.clientX);
    const room = getRoomLabel(cell, ev.clientX, ev.clientY);
    openPopover({x:ev.clientX, y:ev.clientY, room, from, to});
  }, true);
})(); // IIFE 2

/* ============================================================================
   WU – Hinweis-Popup (Modal) + fixer "Hilfe & Infos"-Button – türkis – v5.2
   ============================================================================ */
(function () {
  const CFG = {
    enabled: true,
    title: "Wichtige Info",
    html: `
      <div class="wu-callout">
        <div class="wu-callout-icon" aria-hidden="true">ℹ️</div>
        <div class="wu-callout-content">           
            <p><strong>Für vollständige und aktuelle Informationen nutzen Sie bitte folgende Tools:</strong></p>
        </div>
      </div>

      <div class="wu-cta-row">
        <a class="wu-btn wu-btn-primary" href="https://www.wu.ac.at/universitaet/organisation/dienstleistungseinrichtungen/campusmanagement/veranstaltungsmanagement/raeume-1" target="_blank" rel="noopener" aria-label="Rauminfo-Tool öffnen">
          <span class="wu-btn-icon">⌂</span><span class="wu-btn-label">Rauminfo-Tool öffnen</span>
        </a>
        <a class="wu-btn" href="https://www.wu.ac.at/universitaet/organisation/dienstleistungseinrichtungen/campusmanagement/veranstaltungsmanagement/raeume-1" target="_blank" rel="noopener" aria-label="Leitfaden bald Verfügbar">
          <span class="wu-btn-icon">📄</span><span class="wu-btn-label">Leitfaden bald Verfügbar</span>
        </a>
      </div>

      <p class="wu-contact">Fragen? Wir helfen gerne weiter: <a href="mailto:events@wu.ac.at">events@wu.ac.at</a></p>
    `,
    delayMs: 900,
    showOncePerDay: true,
    storageKey: "wu-info-modal-lastSeen"
  };
  if (!CFG.enabled) return;

  const THEME = {
    primary: "#0f6e85",
    primaryDark: "#0d5f73",
    surface: "#ffffff",
    surfaceAlt: "#f5f9f9",
    text: "#0a171a",
    textMuted: "#41616a",
    link: "#0f6e85",
    radiusLg: "14px",
    radiusSm: "10px",
    shadow: "0 14px 40px rgba(0,0,0,.18)",
    blur: "4px"
  };

  const MODAL_ID = "wu-info-modal";
  const STYLE_ID = "wu-info-modal-style-v52";
  const HELP_BTN_ID = "wu-help-button";
  const HELP_POPOVER_ID = "wu-help-popover";

  const CSS = `
/* --- Backdrop ------------------------------------------------------------ */
#${MODAL_ID}-backdrop{
  position:fixed; inset:0; background:rgba(8,28,33,.36);
  -webkit-backdrop-filter:blur(${THEME.blur}); backdrop-filter:blur(${THEME.blur});
  opacity:0; pointer-events:none; transition:opacity .18s ease; z-index:2147483645;
}
#${MODAL_ID}-backdrop.is-open{ opacity:1; pointer-events:auto; }

/* --- Container & Dialog -------------------------------------------------- */
#${MODAL_ID}{ position:fixed; inset:0; display:grid; place-items:center;
  z-index:2147483646; opacity:0; pointer-events:none; transition:opacity .18s ease; }
#${MODAL_ID}.is-open{ opacity:1; pointer-events:auto; }

#${MODAL_ID} .dialog{
  width:min(660px,92vw); background:${THEME.surface}; color:${THEME.text};
  border:1px solid rgba(0,0,0,.06); border-radius:${THEME.radiusLg};
  box-shadow:${THEME.shadow}; overflow:hidden;
  transform:translateY(6px) scale(.98); transition:transform .22s cubic-bezier(.2,.7,.2,1);
}
#${MODAL_ID}.is-open .dialog{ transform:translateY(0) scale(1); }

#${MODAL_ID} .accent{ height:6px; background:linear-gradient(90deg, ${THEME.primary}, ${THEME.primaryDark}); }

#${MODAL_ID} .header{ display:flex; align-items:center; gap:10px; padding:14px 18px 6px; }
/* Icon ohne farbige Kachel */
#${MODAL_ID} .icon{
  width:auto; height:auto; border-radius:0; background:transparent; padding:0;
  color:${THEME.primary}; font:700 18px/1 system-ui;
}
#${MODAL_ID} .title{ font:600 18px/1.25 system-ui,-apple-system,Segoe UI,Roboto,Arial; }

#${MODAL_ID} .body{ padding:8px 18px 8px; font:15px/1.6 system-ui,-apple-system,Segoe UI,Roboto,Arial; }
#${MODAL_ID} .body a{ color:${THEME.link}; text-underline-offset:2px; }
#${MODAL_ID} .body p{ margin:0 0 10px; }
#${MODAL_ID} .body .wu-contact{ color:${THEME.textMuted}; margin-top:12px; }

/* Callout-Stil */
#${MODAL_ID} .wu-callout{ display:flex; gap:12px; padding:12px; background:${THEME.surfaceAlt};
  border:1px solid rgba(0,0,0,.06); border-radius:${THEME.radiusSm}; margin:2px 0 12px; }
/* Callout-Icon ohne Kachel */
#${MODAL_ID} .wu-callout-icon{
  width:auto; height:auto; border-radius:0; background:transparent; padding:0;
  color:${THEME.primary}; font:700 18px/1 system-ui; flex:0 0 auto;
}
#${MODAL_ID} .wu-callout-title{ font-weight:700; margin-bottom:6px; }

/* CTA-Reihe */
#${MODAL_ID} .wu-cta-row{ display:flex; flex-wrap:wrap; gap:10px; margin:8px 0 6px; }
#${MODAL_ID} .wu-btn{
  display:inline-flex; align-items:center; gap:8px;
  padding:10px 14px; border:1px solid rgba(0,0,0,.12);
  border-radius:${THEME.radiusSm}; background:#fff; color:${THEME.text} !important;
  font:600 14px/1 system-ui; text-decoration:none !important; cursor:pointer;
  transition:background .15s ease,border-color .15s ease,transform .02s ease;
}
#${MODAL_ID} .wu-btn:hover{ background:#eef6f7; }
#${MODAL_ID} .wu-btn:active{ transform:translateY(1px); }
#${MODAL_ID} .wu-btn-icon{ font-size:16px; line-height:1; }
#${MODAL_ID} .wu-btn-primary{ background:${THEME.primary}; border-color:${THEME.primary}; color:#fff !important; }
#${MODAL_ID} .wu-btn-primary:hover{ background:${THEME.primaryDark}; }

/* Footer */
#${MODAL_ID} .footer{
  display:flex; align-items:center; gap:10px; padding:12px 18px;
  background:${THEME.surfaceAlt}; border-top:1px solid rgba(0,0,0,.05);
  border-bottom-left-radius:${THEME.radiusLg}; border-bottom-right-radius:${THEME.radiusLg};
}
#${MODAL_ID} .left{ margin-right:auto; display:inline-flex; align-items:center; gap:8px;
  color:${THEME.textMuted}; font:13px/1.1 system-ui; }
#${MODAL_ID} input[type="checkbox"]{ transform:translateY(1px); }

#${MODAL_ID} button{
  appearance:none; border:1px solid rgba(0,0,0,.12); background:#fff; color:${THEME.text};
  padding:9px 14px; border-radius:${THEME.radiusSm}; font:600 14px/1 system-ui; cursor:pointer;
  transition:background .15s ease, border-color .15s ease, transform .02s ease;
}
#${MODAL_ID} button.primary{ background:${THEME.primary}; border-color:${THEME.primary}; color:#fff; }
#${MODAL_ID} button.primary:hover{ background:${THEME.primaryDark}; }

/* --- Fixer "Hilfe & Infos"-Button unten rechts (fixed) ------------------- */
#${HELP_BTN_ID}{
  position:fixed; bottom:14px; right:14px; z-index:2147483647;
  padding:8px 12px; border-radius:999px; background:${THEME.primary}; color:#fff;
  font:600 13px/1 system-ui; border:1px solid ${THEME.primaryDark};
  box-shadow:0 6px 16px rgba(0,0,0,.18); cursor:pointer; user-select:none;
}
#${HELP_BTN_ID}:hover{ background:${THEME.primaryDark}; }
/* Vorsorglicher Header-Override ausschalten (immer fixed) */
.usi-gradientbackground #${HELP_BTN_ID}{ position:fixed; bottom:14px; right:14px; }

/* Popover: oberhalb des Buttons, rechtsbündig ausrichten */
#${HELP_POPOVER_ID}{
  position:fixed; bottom:56px; right:14px; z-index:2147483647;
  min-width:260px; background:#fff; border:1px solid rgba(0,0,0,.08);
  border-radius:${THEME.radiusSm}; box-shadow:${THEME.shadow}; padding:8px; display:none;
}
#${HELP_POPOVER_ID}.open{ display:block; }
#${HELP_POPOVER_ID} a{
  display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:8px;
  color:${THEME.text}; text-decoration:none;
}
#${HELP_POPOVER_ID} a:hover{ background:${THEME.surfaceAlt}; }
#${HELP_POPOVER_ID} .accent{
  display:inline-grid; place-items:center; width:22px; height:22px; border-radius:6px;
  background:${THEME.primary}; color:#fff; font-weight:700;
}
#${HELP_POPOVER_ID} .sep{ height:1px; background:rgba(0,0,0,.06); margin:6px 0; }

@media (prefers-reduced-motion: reduce) {
  #${MODAL_ID}-backdrop, #${MODAL_ID}, #${MODAL_ID} .dialog { transition:none !important; }
}
`;

  function todayKey(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }
  function alreadySeenToday(){
    if (!CFG.showOncePerDay) return false;
    try { return localStorage.getItem(CFG.storageKey) === todayKey(); } catch { return false; }
  }
  function markSeenToday(){
    if (!CFG.showOncePerDay) return;
    try { localStorage.setItem(CFG.storageKey, todayKey()); } catch {}
  }

  function ensureStyle(){
    if (!document.getElementById(STYLE_ID)) {
      const s = document.createElement("style"); s.id = STYLE_ID; s.textContent = CSS; document.head.appendChild(s);
    }
  }

  // ----------------------------- Modal -------------------------------------
  function buildModal(){
    if (document.getElementById(MODAL_ID)) return;

    const backdrop = document.createElement("div");
    backdrop.id = MODAL_ID + "-backdrop";

    const modal = document.createElement("div");
    modal.id = MODAL_ID; modal.setAttribute("role","dialog"); modal.setAttribute("aria-modal","true");
    modal.innerHTML = `
      <div class="dialog" role="document">
        <div class="accent"></div>
        <div class="header">
          <div class="icon" aria-hidden="true">i</div>
          <div class="title">${CFG.title}</div>
        </div>
        <div class="body">${CFG.html}</div>
        <div class="footer">
          <label class="left"><input type="checkbox" id="${MODAL_ID}-mute"> Heute nicht mehr zeigen</label>
          <button class="primary" id="${MODAL_ID}-close">Schließen</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    function close(){
      modal.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      const mute = document.getElementById(`${MODAL_ID}-mute`);
      if (mute && mute.checked) markSeenToday();
    }

    // Schließen: Button, ESC, Backdrop-Klick & Klick außerhalb
    modal.querySelector(`#${MODAL_ID}-close`).addEventListener("click", close);
    backdrop.addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (!e.target.closest(".dialog")) close(); });
    window.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }

  function openModal(){
    ensureStyle(); buildModal();
    document.getElementById(MODAL_ID + "-backdrop").classList.add("is-open");
    document.getElementById(MODAL_ID).classList.add("is-open");
    setTimeout(()=> document.querySelector(`#${MODAL_ID} button.primary`)?.focus?.(), 40);
  }

  // --------------------- fixer Hilfe-&-Infos-Button ------------------------
  function ensureHelpButton(){
    if (!document.getElementById(HELP_BTN_ID)) {
      const btn = document.createElement("button");
      btn.id = HELP_BTN_ID;
      btn.type = "button";
      btn.textContent = "Hilfe & Infos";
      btn.addEventListener("click", toggleHelpPopover);
      // fixed unten-rechts
      document.body.appendChild(btn);
    }
    if (!document.getElementById(HELP_POPOVER_ID)) {
      const pop = document.createElement("div");
      pop.id = HELP_POPOVER_ID;
      pop.innerHTML = `
        <a href="https://www.wu.ac.at/universitaet/organisation/dienstleistungseinrichtungen/campusmanagement/veranstaltungsmanagement/raeume-1" target="_blank" rel="noopener">
          <span class="accent">⌂</span><span>Rauminfo-Tool öffnen</span>
        </a>
        <a href="https://swa.wu.ac.at/Serviceeinrichtungen/evd/Documents/VM/Step-by-Step_Stand%2006.11.2024.pdf" target="_blank" rel="noopener">
          <span class="accent">📄</span><span>Handbuch (PDF)</span>
        </a>
        <div class="sep"></div>
        <a href="javascript:void(0)" id="${HELP_POPOVER_ID}-openmodal">
          <span class="accent">i</span><span>Hinweis erneut anzeigen</span>
        </a>
      `;
      document.body.appendChild(pop);
      pop.querySelector(`#${HELP_POPOVER_ID}-openmodal`).addEventListener("click", () => {
        closeHelpPopover(); openModal();
      });
      // global schließen bei Außenklick
      document.addEventListener("click", (e)=>{
        const t = e.target;
        if (!t.closest(`#${HELP_POPOVER_ID}`) && !t.closest(`#${HELP_BTN_ID}`)) closeHelpPopover();
      }, true);
    }
    syncPopoverPosition();
  }
  function toggleHelpPopover(){
    const pop = document.getElementById(HELP_POPOVER_ID);
    pop.classList.toggle("open");
    syncPopoverPosition();
  }
  function closeHelpPopover(){
    const pop = document.getElementById(HELP_POPOVER_ID);
    if (pop) pop.classList.remove("open");
  }

  // Positionierung: Popover oberhalb des (fixen) Buttons, rechtsbündig
  function syncPopoverPosition(){
    const btn = document.getElementById(HELP_BTN_ID);
    const pop = document.getElementById(HELP_POPOVER_ID);
    if (!btn || !pop) return;
    const r = btn.getBoundingClientRect();
    pop.style.top = "auto";
    pop.style.right = Math.max(14, window.innerWidth - r.right) + "px";
    // Unterkante des Popovers 56px über der Viewport-Unterkante (sicher über Button)
    pop.style.bottom = Math.max(56, window.innerHeight - r.top + 8) + "px";
  }

  // öffentlich: Modal manuell öffnen
  window.WU_ShowInfoModal = () => openModal();

  // Init
  ensureStyle();
  ensureHelpButton();

  // SPA/Redraw-Resilienz
  new MutationObserver(() => ensureHelpButton())
    .observe(document.documentElement, {childList:true, subtree:true});

  window.addEventListener("resize", syncPopoverPosition);
  window.addEventListener("scroll", syncPopoverPosition, {passive:true});

  // Auto-Öffnen (einmal pro Tag)
  if (!alreadySeenToday()) {
    const start = () => setTimeout(() => openModal(), CFG.delayMs);
    (document.readyState === "loading") ? document.addEventListener("DOMContentLoaded", start) : start();
  }
  })();
/* ============================================================================
   WU – WU-Logo als Home-Button: klickt den besten Header-Link (z. B. "Raumanfrage")
   statt auf eine fixe URL zu navigieren. Fallbacks enthalten.
   ============================================================================ */
(function () {
  // 1) Kandidaten für das Logo (bei euch .usi-companyLogo > img)
  const LOGO_SELECTORS = [
    '.usi-headerModuleWrapper .usi-companyLogo img',
    '.usi-headerModuleWrapper .usi-companyLogo',
    '.usi-companyLogo img',
    '.usi-companyLogo',
    'img[alt*="WU" i]'
  ];

  // 2) So suchen wir den "Home"-Link im Header/Nav
  const LINK_SELECTORS = [
    '.usi-headerModuleWrapper a[href]',
    'header a[href]',
    'nav a[href]'
  ];
  const TEXT_PREFER = /(raumanfrage|raumsuche|räume|rooms|home|start)/i;
  const TEXT_DEPRIORITIZE = /(logout|abmelden|handbuch|pdf|hilfe|kontakt)/i;

  function pickHomeLink(){
    // sammle alle Links aus den Header-Bereichen
    const links = [];
    for (const sel of LINK_SELECTORS) {
      document.querySelectorAll(sel).forEach(a => links.push(a));
    }
    // filtern: nur sichtbare, klickbare, http/relative, gleiche Origin falls absolut
    const clean = links.filter(a => {
      if (!a || a.offsetParent === null) return false;
      const href = (a.getAttribute('href') || '').trim();
      if (!href) return false;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
      if (/^https?:\/\//i.test(href) && new URL(href, location.href).origin !== location.origin) return false;
      return true;
    });

    if (!clean.length) return null;

    // scoren: Bevorzugt passende Bezeichnungen, kürzere Pfade, keine Depriorisierten
    function score(a){
      const text = (a.textContent || a.getAttribute('title') || '').trim();
      const href = a.getAttribute('href') || '';
      let s = 0;
      if (TEXT_PREFER.test(text) || TEXT_PREFER.test(href)) s += 5;
      if (TEXT_DEPRIORITIZE.test(text) || TEXT_DEPRIORITIZE.test(href)) s -= 5;
      // kurze, „zentrale“ Ziele bevorzugen
      try {
        const u = new URL(href, location.href);
        const pathLen = (u.pathname || '/').split('/').filter(Boolean).length;
        if (pathLen <= 2) s += 2;
        if (/(^\/?$|^\/prod\/?$|^\/#\/?$)/i.test(u.pathname + u.hash)) s += 1;
      } catch {}
      return s;
    }

    clean.sort((a,b) => score(b) - score(a));
    return clean[0] || null;
  }

  function goHome(ev){
    // Klick oder Enter/Space
    if (ev.type === 'keydown' && ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();

    const best = pickHomeLink();
    if (best) {
      // Simuliere einen echten Klick, damit die SPA/Router-Logik greift
      best.click();
      return;
    }

    // Fallbacks falls kein Link gefunden:
    // 1) Versuche die aktuelle Basis (z. B. '/prod')
    const base = location.pathname.split('/').filter(Boolean);
    const rootPath = base.length ? '/' + base[0] + '/' : '/';
    try { location.replace(rootPath); return; } catch {}

    // 2) letzter Notnagel: origin/
    location.replace(location.origin + '/');
  }

  function bind(node){
    const target = node.closest('.usi-companyLogo') || node;
    if (!target || target.__wuHomeBound) return;
    target.__wuHomeBound = true;
    target.style.cursor = 'pointer';
    target.setAttribute('role', 'link');
    target.setAttribute('tabindex', '0');
    target.setAttribute('title', 'Zur Startseite');
    target.addEventListener('click', goHome, true);
    target.addEventListener('keydown', goHome, true);
  }

  function attach(){
    for (const sel of LOGO_SELECTORS){
      const el = document.querySelector(sel);
      if (el){ bind(el); return; }
    }
  }

  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', attach)
    : attach();

  new MutationObserver(attach).observe(document.documentElement, {childList:true, subtree:true});
})();

/* ============================================================================
   WU – Viewer: robustes Outside-Click ohne Extra-X (v7.5)
   ============================================================================ */
(function () {
  const BACKDROPS = [
    '.cdk-overlay-backdrop', '.mdc-dialog__scrim', '.modal-backdrop.show',
    '.usi-op-imageViewerBackdrop', '.usi-op-imageViewer-backdrop'
  ];
  const CONTAINERS = [
    '.cdk-overlay-pane .mat-mdc-dialog-container',
    '.mdc-dialog .mdc-dialog__container',
    '.modal.show',
    '.usi-op-imageViewerContainer', '.usi-op-imageViewer'
  ];
  const SURFACES = [
    'img', 'video', 'picture',
    '.mdc-dialog__surface', '.mat-mdc-dialog-surface',
    '.usi-op-imageViewer img', '.usi-op-imageViewer video'
  ];

  const SEL_BACKDROP  = BACKDROPS.join(',');
  const SEL_CONTAINER = CONTAINERS.join(',');
  const SEL_SURFACE   = SURFACES.join(',');

  const isEl = (n) => n instanceof Element;
  const $    = (sel, root=document) => root.querySelector(sel);
  const $$   = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function isVisible(el){
    if (!isEl(el)) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function anyOpenOverlay(){
    const backs = $$(SEL_BACKDROP).some(isVisible);
    const conts = $$(SEL_CONTAINER).some(isVisible);
    const bs    = $$('.modal.show').some(isVisible);
    return backs || conts || bs;
  }

  function findTopContainer(){
    const all = $$(SEL_CONTAINER).filter(isVisible);
    return all.length ? all[all.length - 1] : null;
  }

  function pressEsc(){
    window.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape', bubbles:true}));
  }
  function clickFirstBackdrop(){
    const bd = $$(SEL_BACKDROP).find(isVisible);
    if (bd && typeof bd.click === 'function') bd.click();
  }
  function tryNativeClose(root){
    const btn = (
      root && isEl(root) ? root : document
    ).querySelector('[aria-label*="schließ" i], [aria-label*="close" i], button[mat-dialog-close], button.close, .mdc-icon-button');
    if (btn && typeof btn.click === 'function') { btn.click(); return true; }
    return false;
  }

  function largestMediaRect(root){
    if (!isEl(root)) return null;
    const medias = $$(SEL_SURFACE, root).filter(isVisible);
    if (!medias.length) return null;
    let best = null, area = -1;
    for (const m of medias){
      const r = m.getBoundingClientRect();
      const a = r.width * r.height;
      if (a > area) { area = a; best = r; }
    }
    return best;
  }

  function pointInRect(x,y,r,margin=0){
    if (!r) return false;
    return x >= r.left - margin && x <= r.right + margin &&
           y >= r.top  - margin && y <= r.bottom + margin;
  }

  function safeClose(){
    const root = findTopContainer() || document.body;
    if (tryNativeClose(root)) return; // 1) nativer Close
    clickFirstBackdrop();             // 2) Backdrop-Klick
    pressEsc();                       // 3) ESC
    // 4) Bootstrap-Fallback
    const bs = isEl(root) ? root.closest?.('.modal.show') : null;
    const anyBs = bs || $('.modal.show');
    if (anyBs) anyBs.classList.remove('show');
  }

  // NEU: schließt auch, wenn außerhalb des Overlay-Containers geklickt wird
  function onPointerDown(e){
    if (!anyOpenOverlay()) return;

    const tgt = e.target;

    // 1) direkter Backdrop-Klick
    if (isEl(tgt) && tgt.matches?.(SEL_BACKDROP)) {
      safeClose();
      return;
    }

    const topContainer = findTopContainer();
    if (!topContainer) return;

    const contRect  = topContainer.getBoundingClientRect();
    const mediaRect = largestMediaRect(topContainer);
    const x = e.clientX, y = e.clientY;

    // 2) Klick liegt GESAMT außerhalb des Containers → schließen (dein roter Bereich)
    if (!pointInRect(x, y, contRect, 0)) {
      safeClose();
      return;
    }

    // 3) Event-Pfad prüfen: Klick auf Medienfläche? → nicht schließen
    const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
    const onSurface = path.some(n => isEl(n) && n.matches?.(SEL_SURFACE));
    if (onSurface) return;

    // 4) innerhalb des Containers, aber außerhalb der größten Medienfläche → schließen
    //    Margin erhöhen, wenn „nah am Bildrand“ noch als „drin“ zählen soll (z. B. 8)
    if (!pointInRect(x, y, mediaRect, 2)) {
      safeClose();
    }
  }

  // früh dran sein: pointerdown + Capture, damit Viewer-Libs nicht blocken
  document.addEventListener('pointerdown', onPointerDown, {capture:true});
  window.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') safeClose(); });
})();

// Sortieren-nach (formcontrolname="sortBy") vollständig ausblenden
(function () {
  function hideSortBox(){
    // 1) das eigentliche Select finden
    const sel = document.querySelector('mat-select[formcontrolname="sortBy"]');
    if (!sel) return;

    // 2) das umgebende Form-Field ausblenden
    const field = sel.closest('mat-form-field, .mat-mdc-form-field');
    if (field) field.style.display = 'none';

    // 3) evtl. Überschrift "Sortieren nach" neben/oberhalb auch verstecken
    const labelCandidates = [
      field?.previousElementSibling,
      field?.parentElement?.querySelector('label, .mat-mdc-form-field-label'),
      field?.parentElement?.firstElementChild
    ].filter(Boolean);

    for (const el of labelCandidates) {
      if (/(^|\s)sortieren\s*nach(\s|$)/i.test((el.textContent||'').trim())) {
        el.style.display = 'none';
        break;
      }
    }
  }

  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', hideSortBox)
    : hideSortBox();

  // SPA-Resilienz: bei DOM-Änderungen erneut anwenden
  new MutationObserver(hideSortBox).observe(document.documentElement, { childList:true, subtree:true });
})();
/* ============================================================================
   WU – "WU Rauminformationstool" im Raumausstattung-Block verlinken
   - Ersetzt ggf. den reinen Text durch <a>
   - Falls der Ausdruck nicht vorkommt, wird ein separater Link ergänzt
   ========================================================================== */
(function () {
  const URL = "https://www.wu.ac.at/universitaet/organisation/dienstleistungseinrichtungen/campusmanagement/veranstaltungsmanagement/raeume-1";
  const RX  = /WU\s+Rauminformationstool/i;

  function linkifyFeatures() {
    const sections = document.querySelectorAll('.usi-spaceFeatures');
    if (!sections.length) return;

    sections.forEach(sec => {
      if (sec.__wuLinked) return;
      sec.__wuLinked = true;

      // 1) Wenn der Ausdruck im HTML/Text vorkommt → per innerHTML ersetzen
      const html = sec.innerHTML;
      if (RX.test(html)) {
        sec.innerHTML = html.replace(RX, `<a href="${URL}" target="_blank" rel="noopener" style="text-decoration:underline; font-weight:600;">WU Rauminformationstool</a>`);
        return;
      }

      // 2) Falls er nicht vorkommt → Extra-Link anhängen
      if (!sec.querySelector('#wu-roominfo-extra-link')) {
        const p = document.createElement('p');
        p.id = 'wu-roominfo-extra-link';
        p.innerHTML = `<a href="${URL}" target="_blank" rel="noopener" style="text-decoration:underline; font-weight:600;">WU Rauminformationstool</a>`;
        sec.appendChild(p);
      }
    });
  }

  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', linkifyFeatures)
    : linkifyFeatures();

  // SPA-Resilienz
  new MutationObserver(linkifyFeatures).observe(document.documentElement, { childList:true, subtree:true });
})();
