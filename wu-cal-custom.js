/* wu-cal-custom.js – CSS-Injection + "SPACE" -> "Räume" (ohne Badge) */
(function () {
  const STYLE_ID = "wu-inline-css";

  const CSS = `
  /* Pflichtfeld-Sternchen rot einfärben */
.mat-mdc-form-field-required-marker {
  color: #d32f2f !important; /* kräftiges Rot */
  font-weight: 700 !important;
}

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
   DEAKTIVIERT
   ============================================================================ */
(function () {
  return; // DEAKTIVIERT
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
    const startHour = 8;
    const len = colCount + 2;
    return Array.from({length: len}, (_,i) => String(startHour+i).padStart(2,"0")+":00");
  }

  function timeFromClick(cell, clientX){
    const row = cell.closest(".chadmo-row") || cell.parentElement;
    const m = measureRow(row); if (!m) return ["",""];
    const bounds = timeBoundaries(m.colCount);
    const minX = m.left0;
    const maxX = m.left0 + m.width * (m.colCount + 0.5);
    const clampedX = Math.min(Math.max(clientX, minX), maxX);
    let idx = Math.floor((clampedX - m.left0) / m.width);
    idx = Math.max(0, Math.min(idx, bounds.length - 2));
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

  function openPopover({x,y,from,to}){
    ensureStyle(); ensurePopover();
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
    openPopover({x:ev.clientX, y:ev.clientY, from, to});
  }, true);
})();

/* ============================================================================
   WU – Fixer "Hilfe & Infos"-Button – eckig – v5.3
   Modal-Popup DEAKTIVIERT; nur Button + Popover mit Kontakttext aktiv
   ============================================================================ */
(function () {
  const THEME = {
    primary: "#0f6e85",
    primaryDark: "#0d5f73",
    surface: "#ffffff",
    surfaceAlt: "#f5f9f9",
    text: "#0a171a",
    textMuted: "#41616a",
    shadow: "0 14px 40px rgba(0,0,0,.18)"
  };

  const HELP_BTN_ID    = "wu-help-button";
  const HELP_POPOVER_ID = "wu-help-popover";
  const STYLE_ID        = "wu-help-button-style";

  const CSS = `
/* --- Fixer "Hilfe & Infos"-Button unten rechts (fixed, eckig) ------------ */
#${HELP_BTN_ID}{
  position:fixed; bottom:14px; right:14px; z-index:2147483647;
  padding:8px 14px; border-radius:4px; background:${THEME.primary}; color:#fff;
  font:600 13px/1 system-ui; border:1px solid ${THEME.primaryDark};
  box-shadow:0 6px 16px rgba(0,0,0,.18); cursor:pointer; user-select:none;
}
#${HELP_BTN_ID}:hover{ background:${THEME.primaryDark}; }

/* Popover: oberhalb des Buttons, rechtsbündig, eckig */
#${HELP_POPOVER_ID}{
  position:fixed; bottom:56px; right:14px; z-index:2147483647;
  min-width:280px; background:#fff; border:1px solid rgba(0,0,0,.08);
  border-radius:4px; box-shadow:${THEME.shadow}; padding:8px; display:none;
}
#${HELP_POPOVER_ID}.open{ display:block; }
#${HELP_POPOVER_ID} a{
  display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:3px;
  color:${THEME.text}; text-decoration:none;
}
#${HELP_POPOVER_ID} a:hover{ background:${THEME.surfaceAlt}; }
#${HELP_POPOVER_ID} .accent{
  display:inline-grid; place-items:center; width:22px; height:22px; border-radius:3px;
  background:${THEME.primary}; color:#fff; font-weight:700; flex:0 0 auto;
}
#${HELP_POPOVER_ID} .sep{ height:1px; background:rgba(0,0,0,.06); margin:6px 0; }
#${HELP_POPOVER_ID} .contact-text{
  padding:8px 10px; font:13px/1.5 system-ui; color:${THEME.textMuted};
}
#${HELP_POPOVER_ID} .contact-text a{
  display:inline; padding:0; color:${THEME.primary}; text-decoration:underline;
}
#${HELP_POPOVER_ID} .contact-text a:hover{ background:transparent; text-decoration:none; }
`;

  function ensureStyle(){
    if (!document.getElementById(STYLE_ID)) {
      const s = document.createElement("style"); s.id = STYLE_ID; s.textContent = CSS;
      document.head.appendChild(s);
    }
  }

  function ensureHelpButton(){
    if (!document.getElementById(HELP_BTN_ID)) {
      const btn = document.createElement("button");
      btn.id = HELP_BTN_ID;
      btn.type = "button";
      btn.textContent = "Hilfe & Infos";
      btn.addEventListener("click", toggleHelpPopover);
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
        <div class="contact-text">
          Sie haben Fragen bzw. brauchen Unterstützung?<br>
          Wir helfen gerne weiter: <a href="mailto:events@wu.ac.at">events@wu.ac.at</a>
        </div>
      `;
      document.body.appendChild(pop);

      // Außenklick schließt Popover
      document.addEventListener("click", (e) => {
        const t = e.target;
        if (!t.closest(`#${HELP_POPOVER_ID}`) && !t.closest(`#${HELP_BTN_ID}`)) closeHelpPopover();
      }, true);
    }
    syncPopoverPosition();
  }

  function toggleHelpPopover(){
    const pop = document.getElementById(HELP_POPOVER_ID);
    if (pop) pop.classList.toggle("open");
    syncPopoverPosition();
  }

  function closeHelpPopover(){
    const pop = document.getElementById(HELP_POPOVER_ID);
    if (pop) pop.classList.remove("open");
  }

  function syncPopoverPosition(){
    const btn = document.getElementById(HELP_BTN_ID);
    const pop = document.getElementById(HELP_POPOVER_ID);
    if (!btn || !pop) return;
    const r = btn.getBoundingClientRect();
    pop.style.top    = "auto";
    pop.style.right  = Math.max(14, window.innerWidth - r.right) + "px";
    pop.style.bottom = Math.max(56, window.innerHeight - r.top + 8) + "px";
  }

  // Init
  ensureStyle();
  ensureHelpButton();

  // SPA-Resilienz
  new MutationObserver(() => ensureHelpButton())
    .observe(document.documentElement, {childList:true, subtree:true});

  window.addEventListener("resize", syncPopoverPosition);
  window.addEventListener("scroll", syncPopoverPosition, {passive:true});
})();

/* ============================================================================
   WU – WU-Logo als Home-Button
   ============================================================================ */
(function () {
  const LOGO_SELECTORS = [
    '.usi-headerModuleWrapper .usi-companyLogo img',
    '.usi-headerModuleWrapper .usi-companyLogo',
    '.usi-companyLogo img',
    '.usi-companyLogo',
    'img[alt*="WU" i]'
  ];

  const LINK_SELECTORS = [
    '.usi-headerModuleWrapper a[href]',
    'header a[href]',
    'nav a[href]'
  ];
  const TEXT_PREFER = /(raumanfrage|raumsuche|räume|rooms|home|start)/i;
  const TEXT_DEPRIORITIZE = /(logout|abmelden|handbuch|pdf|hilfe|kontakt)/i;

  function pickHomeLink(){
    const links = [];
    for (const sel of LINK_SELECTORS) {
      document.querySelectorAll(sel).forEach(a => links.push(a));
    }
    const clean = links.filter(a => {
      if (!a || a.offsetParent === null) return false;
      const href = (a.getAttribute('href') || '').trim();
      if (!href) return false;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
      if (/^https?:\/\//i.test(href) && new URL(href, location.href).origin !== location.origin) return false;
      return true;
    });
    if (!clean.length) return null;

    function score(a){
      const text = (a.textContent || a.getAttribute('title') || '').trim();
      const href = a.getAttribute('href') || '';
      let s = 0;
      if (TEXT_PREFER.test(text) || TEXT_PREFER.test(href)) s += 5;
      if (TEXT_DEPRIORITIZE.test(text) || TEXT_DEPRIORITIZE.test(href)) s -= 5;
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
    if (ev.type === 'keydown' && ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();
    const best = pickHomeLink();
    if (best) { best.click(); return; }
    const base = location.pathname.split('/').filter(Boolean);
    const rootPath = base.length ? '/' + base[0] + '/' : '/';
    try { location.replace(rootPath); return; } catch {}
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
    if (tryNativeClose(root)) return;
    clickFirstBackdrop();
    pressEsc();
    const bs = isEl(root) ? root.closest?.('.modal.show') : null;
    const anyBs = bs || $('.modal.show');
    if (anyBs) anyBs.classList.remove('show');
  }

  function onPointerDown(e){
    if (!anyOpenOverlay()) return;
    const tgt = e.target;
    if (isEl(tgt) && tgt.matches?.(SEL_BACKDROP)) { safeClose(); return; }
    const topContainer = findTopContainer();
    if (!topContainer) return;
    const contRect  = topContainer.getBoundingClientRect();
    const mediaRect = largestMediaRect(topContainer);
    const x = e.clientX, y = e.clientY;
    if (!pointInRect(x, y, contRect, 0)) { safeClose(); return; }
    const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
    const onSurface = path.some(n => isEl(n) && n.matches?.(SEL_SURFACE));
    if (onSurface) return;
    if (!pointInRect(x, y, mediaRect, 2)) { safeClose(); }
  }

  document.addEventListener('pointerdown', onPointerDown, {capture:true});
  window.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') safeClose(); });
})();

/* ============================================================================
   WU – Sortieren-nach ausblenden
   ============================================================================ */
(function () {
  function hideSortBox(){
    const sel = document.querySelector('mat-select[formcontrolname="sortBy"]');
    if (!sel) return;
    const field = sel.closest('mat-form-field, .mat-mdc-form-field');
    if (field) field.style.display = 'none';
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

  new MutationObserver(hideSortBox).observe(document.documentElement, { childList:true, subtree:true });
})();

/* ============================================================================
   WU – "WU Rauminformationstool" im Raumausstattung-Block verlinken
   ============================================================================ */
(function () {
  const URL = "https://www.wu.ac.at/universitaet/organisation/dienstleistungseinrichtungen/campusmanagement/veranstaltungsmanagement/raeume-1";
  const RX  = /WU\s+Rauminformationstool/i;

  function linkifyFeatures() {
    const sections = document.querySelectorAll('.usi-spaceFeatures');
    if (!sections.length) return;
    sections.forEach(sec => {
      if (sec.__wuLinked) return;
      sec.__wuLinked = true;
      const html = sec.innerHTML;
      if (RX.test(html)) {
        sec.innerHTML = html.replace(RX, `<a href="${URL}" target="_blank" rel="noopener" style="text-decoration:underline; font-weight:600;">WU Rauminformationstool</a>`);
        return;
      }
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

  new MutationObserver(linkifyFeatures).observe(document.documentElement, { childList:true, subtree:true });
})();

/* ============================================================================
   WU – Bedingte Pflichtfelder: Teilnahmegebühren & Kooperationsveranstaltung
   v4: Bessere Button-Erkennung + Kooperationspartner-Feld Fix
   ============================================================================ */
(function () {
  const STYLE_ID = "wu-conditional-required-style";

  const CSS = `
    .wu-required-dynamic .mdc-text-field--outlined .mdc-notched-outline__leading,
    .wu-required-dynamic .mdc-text-field--outlined .mdc-notched-outline__notch,
    .wu-required-dynamic .mdc-text-field--outlined .mdc-notched-outline__trailing {
      border-color: rgba(211, 47, 47, 0.6) !important;
    }
    .wu-required-dynamic .mdc-text-field--outlined:hover .mdc-notched-outline__leading,
    .wu-required-dynamic .mdc-text-field--outlined:hover .mdc-notched-outline__notch,
    .wu-required-dynamic .mdc-text-field--outlined:hover .mdc-notched-outline__trailing {
      border-color: #d32f2f !important;
    }
    .wu-validation-error {
      color: #d32f2f;
      font-size: 12px;
      margin-top: 4px;
      padding-left: 16px;
      display: none;
    }
    .wu-required-dynamic.wu-show-error .wu-validation-error {
      display: block;
    }
    .wu-required-dynamic.wu-show-error .mdc-notched-outline__leading,
    .wu-required-dynamic.wu-show-error .mdc-notched-outline__notch,
    .wu-required-dynamic.wu-show-error .mdc-notched-outline__trailing {
      border-color: #d32f2f !important;
      border-width: 2px !important;
    }
    /* Disabled-State für Submit-Button */
    button.wu-submit-disabled {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
      pointer-events: none !important;
    }
    button.wu-submit-disabled:hover {
      background-color: inherit !important;
    }
  `;

  function ensureStyle() {
    if (!document.getElementById(STYLE_ID)) {
      const s = document.createElement("style");
      s.id = STYLE_ID;
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  }

  function findFormFieldByLabel(labelText) {
    const allFields = document.querySelectorAll("mat-form-field, .mat-mdc-form-field");
    for (const field of allFields) {
      const label = field.querySelector(".mdc-floating-label, .mat-mdc-floating-label, label");
      if (!label) continue;
      const text = (label.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      if (text.includes(labelText.toLowerCase())) return field;
    }
    return null;
  }

  function findSelectByLabel(labelText) {
    const formField = findFormFieldByLabel(labelText);
    if (formField) return formField.querySelector("mat-select");
    return null;
  }

  function isJaSelected(selectEl) {
    if (!selectEl) return false;
    const valueText = selectEl.querySelector(".mat-mdc-select-value-text, .mat-select-value-text");
    const text = (valueText?.textContent || "").trim().toLowerCase();
    // Prüft auf "ja" am Anfang ODER "ja," irgendwo (für "Ja, aber nur mit...")
    return text.startsWith("ja") || text.includes("ja,");
  }

  function hasValue(formField) {
    if (!formField) return true;
    const input = formField.querySelector("input, textarea");
    if (input) return input.value.trim().length > 0;
    return true;
  }

  // Prüft ob alle dynamischen Pflichtfelder ausgefüllt sind
  function allRequiredFieldsFilled() {
    const requiredFields = document.querySelectorAll('[data-wu-required="true"]');
    for (const field of requiredFields) {
      if (!hasValue(field)) return false;
    }
    return true;
  }

  // Findet den "Zur Übersicht gehen" Button
  function findSubmitButtons() {
    // Breiter Selektor für alle möglichen Submit-Buttons
    const allButtons = document.querySelectorAll('button');
    const submitBtns = [];
    
    allButtons.forEach(btn => {
      const text = (btn.textContent || "").trim().toLowerCase();
      // "Zur Übersicht gehen" oder andere Submit-artige Buttons
      if (
        text.includes("übersicht") ||
        text.includes("absenden") ||
        text.includes("speichern") ||
        text.includes("weiter") ||
        btn.type === "submit" ||
        btn.classList.contains("mat-primary") ||
        btn.getAttribute("color") === "primary" ||
        btn.classList.contains("mat-flat-button") ||
        btn.classList.contains("mat-mdc-unelevated-button")
      ) {
        submitBtns.push(btn);
      }
    });
    
    return submitBtns;
  }

  // Aktualisiert den Disabled-Status des Submit-Buttons
  function updateSubmitButtonState() {
    const submitButtons = findSubmitButtons();
    const allFilled = allRequiredFieldsFilled();
    
    submitButtons.forEach((btn) => {
      // Nur Buttons markieren die wir tracken
      if (!btn.dataset.wuSubmitTracked) return;
      
      if (allFilled) {
        btn.classList.remove("wu-submit-disabled");
        btn.removeAttribute("disabled");
      } else {
        btn.classList.add("wu-submit-disabled");
        btn.setAttribute("disabled", "disabled");
      }
    });
  }

  function setRequired(formField, isRequired) {
    if (!formField) return;
    const label = formField.querySelector(".mdc-floating-label, .mat-mdc-floating-label, label");
    const input = formField.querySelector("input, textarea");

    if (isRequired) {
      formField.classList.add("wu-required-dynamic");
      formField.dataset.wuRequired = "true";
      if (label) {
        const existingMarker = label.querySelector(".mat-mdc-form-field-required-marker, .wu-required-star");
        const labelText = label.textContent || "";
        if (!existingMarker && !labelText.includes("*")) {
          const star = document.createElement("span");
          star.className = "wu-required-star";
          star.textContent = " *";
          star.style.cssText = "color: #d32f2f; font-weight: 700;";
          label.appendChild(star);
        }
      }
      if (!formField.querySelector(".wu-validation-error")) {
        const errorEl = document.createElement("div");
        errorEl.className = "wu-validation-error";
        errorEl.textContent = "Dieses Feld ist erforderlich";
        formField.appendChild(errorEl);
      }
      if (input && !input.dataset.wuValidationBound) {
        input.dataset.wuValidationBound = "true";
        input.addEventListener("input", () => {
          if (hasValue(formField)) formField.classList.remove("wu-show-error");
          updateSubmitButtonState();
        });
        input.addEventListener("blur", () => {
          if (formField.dataset.wuRequired === "true" && !hasValue(formField))
            formField.classList.add("wu-show-error");
        });
      }
    } else {
      formField.classList.remove("wu-required-dynamic", "wu-show-error");
      formField.dataset.wuRequired = "false";
      const star = label?.querySelector(".wu-required-star");
      if (star) star.remove();
    }
    // Button-Status nach jeder Änderung aktualisieren
    updateSubmitButtonState();
  }

  function setupSubmitValidation() {
    const submitButtons = findSubmitButtons();
    submitButtons.forEach((btn) => {
      if (btn.dataset.wuSubmitTracked) return;
      btn.dataset.wuSubmitTracked = "true";
      
      // Initial Button-Status setzen
      updateSubmitButtonState();
      
      btn.addEventListener("click", (e) => {
        const requiredFields = document.querySelectorAll('[data-wu-required="true"]');
        let hasErrors = false;
        requiredFields.forEach((field) => {
          if (!hasValue(field)) {
            field.classList.add("wu-show-error");
            hasErrors = true;
          }
        });
        if (hasErrors) {
          e.preventDefault();
          e.stopPropagation();
          const firstError = document.querySelector(".wu-show-error");
          if (firstError) {
            firstError.scrollIntoView({ behavior: "smooth", block: "center" });
            const input = firstError.querySelector("input, textarea");
            if (input) input.focus();
          }
          return false;
        }
      }, true);
    });
  }

  function watchSelect(selectEl, targetField) {
    if (!selectEl || !targetField) return;
    setRequired(targetField, isJaSelected(selectEl));
    const observer = new MutationObserver(() => {
      setRequired(targetField, isJaSelected(selectEl));
    });
    observer.observe(selectEl, { subtree: true, childList: true, characterData: true });
    document.addEventListener("click", (e) => {
      if (e.target.closest(".mat-mdc-option, .mat-option")) {
        setTimeout(() => { setRequired(targetField, isJaSelected(selectEl)); }, 150);
      }
    });
  }

  function setupConditionalRequired() {
    // Teilnahmegebühren -> Höhe
    const teilnahmeSelect = findSelectByLabel("Erheben Sie Teilnahmegebühren");
    const hoeheField = findFormFieldByLabel("Wenn ja, in welcher Höhe");
    if (teilnahmeSelect && hoeheField) {
      watchSelect(teilnahmeSelect, hoeheField);
    }

    // Kooperationsveranstaltung -> Kooperationspartner
    // Suche nach verschiedenen möglichen Labels
    const koopSelect = findSelectByLabel("Kooperationsveranstaltung") || 
                       findSelectByLabel("Handelt es sich um eine Kooperationsveranstaltung");
    const partnerField = findFormFieldByLabel("Kooperationspartner") ||
                         findFormFieldByLabel("Wenn ja, bitte den");
    
    if (koopSelect && partnerField) {
      watchSelect(koopSelect, partnerField);
    }

    setupSubmitValidation();
  }

  ensureStyle();

  function init() {
    const checkInterval = setInterval(() => {
      const teilnahmeSelect = findSelectByLabel("Erheben Sie Teilnahmegebühren");
      if (teilnahmeSelect) {
        clearInterval(checkInterval);
        setupConditionalRequired();
      }
    }, 500);
    setTimeout(() => clearInterval(checkInterval), 30000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(init, 1000);
    }
    setupSubmitValidation();
    updateSubmitButtonState();
  }).observe(document.documentElement, { subtree: true, childList: true });
})();

/* ============================================================================
   WU – "So." (Sonntag) Button in Veranstaltungs-Serie ausblenden
   ============================================================================ */
(function () {
  function hideSonntagButton() {
    // Alle Toggle-Buttons / Wochentag-Buttons durchsuchen
    const buttons = document.querySelectorAll('button, mat-button-toggle, .mat-button-toggle');
    buttons.forEach(btn => {
      const text = (btn.textContent || "").replace(/\s+/g, "").trim();
      if (text === "So." || text === "So") {
        btn.style.display = "none";
        btn.setAttribute("aria-hidden", "true");
        // Falls in einem mat-button-toggle-group: auch das Wrapper-Element verstecken
        const wrapper = btn.closest('mat-button-toggle, .mat-button-toggle');
        if (wrapper) {
          wrapper.style.display = "none";
          wrapper.setAttribute("aria-hidden", "true");
        }
      }
    });
  }

  (document.readyState === "loading")
    ? document.addEventListener("DOMContentLoaded", hideSonntagButton)
    : hideSonntagButton();

  // SPA-Resilienz: bei Tab-Wechsel / DOM-Änderungen erneut anwenden
  new MutationObserver(hideSonntagButton)
    .observe(document.documentElement, { childList: true, subtree: true });
})();
