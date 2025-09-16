/* wu-cal-custom.js – stabil & reversibel
   - "SPACE" -> "Raumverfügbarkeiten" (nicht destruktiv)
   - Zeitlabels nur im Tab "Tag" (werden in Woche/Monat zurückgerollt)
   - Popup bei Klick auf belegte (graue) Slots
*/
(function () {
  const GRID_SEL     = ".chadmo-gridsView";
  const HEADER_COLS  = ".header-columns .header-column";
  const HEADER_LABEL = ".mergedHeaderContent";
  const TAB_SEL      = '[role="tab"], button, a';
  const CLASS_TIME   = "wu-time-relabel";
  const CLASS_BADGE  = "wu-badge-once";
  const STYLE_ID     = "wu-style";
  const OCCUPIED_SEL = [
    ".occupied", ".booked", ".busy", ".blocked", ".unavailable",
    ".not-available", ".disabled", ".reservation",
    ".reservation-blocked", ".grid-cell-disabled"
  ].join(",");

  // --- Style (einmalig) ---
  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = `
      /* eigene Zeitlabels sichtbar, Original unauffällig */
      ${HEADER_LABEL}.${CLASS_TIME}{ font-size:0 !important; }
      ${HEADER_LABEL}.${CLASS_TIME} > .wu-time-label{
        font-size:16px !important; line-height:1; display:inline-block;
      }
      /* kleines einmaliges Badge */
      .${CLASS_BADGE}{
        position:fixed; top:12px; right:12px; z-index:999999;
        background:#1b5e20; color:#fff; padding:8px 10px; border-radius:6px;
        box-shadow:0 2px 8px rgba(0,0,0,.15);
        font:14px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif
      }
    `;
    document.head.appendChild(s);
  }

  function isDayViewActive() {
    const activeTab =
      document.querySelector(`${TAB_SEL}[aria-selected="true"]`) ||
      document.querySelector(`${TAB_SEL}.active`);
    return !!activeTab && /(^|[\s|])tag([\s|]|$)/i.test(activeTab.textContent.trim());
  }

  // --- 1) SPACE -> Raumverfügbarkeiten (nicht destruktiv) ---
  function relabelSpaceHeader(grid) {
    const firstHeader =
      grid.querySelector(`${HEADER_COLS}:first-of-type ${HEADER_LABEL}`) ||
      grid.querySelector(`${HEADER_COLS}:first-of-type`);
    if (!firstHeader) return;

    const txt = (firstHeader.textContent || "").trim();
    if (/^space$/i.test(txt)) {
      // Nur Text-Node ändern, andere Kinder (Icons etc.) unberührt lassen
      // Strategie: prependen wir ein <span> mit gewünschtem Text und verstecken nur den reinen Textknoten
      firstHeader.childNodes.forEach(n=>{
        if (n.nodeType === Node.TEXT_NODE) n.textContent = ""; // nur blank machen
      });
      if (!firstHeader.querySelector(".wu-space-label")) {
        const span = document.createElement("span");
        span.className = "wu-space-label";
        span.textContent = "Raumverfügbarkeiten";
        firstHeader.insertBefore(span, firstHeader.firstChild);
      }
    }
  }

  // --- 2) Zeitlabels nur im "Tag"-Tab ---
  const START_HOUR = 8, NUM_HOURS = 14; // 08..21 inkl.

  function applyDayTimeLabels(grid) {
    if (!isDayViewActive()) { restoreOriginalTimeLabels(grid); return; }

    for (let i = 0; i < NUM_HOURS; i++) {
      const colIndex = 2 + i; // 1 = Räume
      const cell = grid.querySelector(
        `${HEADER_COLS}:nth-of-type(${colIndex}) ${HEADER_LABEL}`
      ) || grid.querySelector(`${HEADER_COLS}:nth-of-type(${colIndex})`);
      if (!cell) continue;

      // nur 1x präparieren
      if (!cell.classList.contains(CLASS_TIME)) {
        cell.classList.add(CLASS_TIME);
        // eigenes Label hinzufügen (Original bleibt, ist nur ausgeblendet via font-size:0)
        const span = document.createElement("span");
        span.className = "wu-time-label";
        cell.appendChild(span);
      }
      const hour = String(START_HOUR + i).padStart(2, "0");
      const span = cell.querySelector(".wu-time-label");
      if (span) span.textContent = `${hour}:00`;
    }
  }

  function restoreOriginalTimeLabels(grid) {
    // Entfernt unsere Klasse + Spans, damit Woche/Monat unverändert bleiben
    grid.querySelectorAll(`${HEADER_LABEL}.${CLASS_TIME}`).forEach(cell=>{
      cell.classList.remove(CLASS_TIME);
      cell.querySelectorAll(".wu-time-label").forEach(e=>e.remove());
    });
  }

  // --- 3) Popup bei Klick auf belegte Slots ---
  const POP_ID = "wu-occupied-popup";
  function showPopup(x, y, text) {
    let el = document.getElementById(POP_ID);
    if (!el) {
      el = document.createElement("div");
      el.id = POP_ID;
      Object.assign(el.style, {
        position:"fixed", zIndex:999999, background:"#263238", color:"#fff",
        padding:"8px 10px", borderRadius:"6px", boxShadow:"0 4px 14px rgba(0,0,0,.25)",
        font:"13px/1.3 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        maxWidth:"260px", pointerEvents:"none", opacity:"0", transition:"opacity .15s"
      });
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.style.left = Math.max(8, x + 12) + "px";
    el.style.top  = Math.max(8, y + 12) + "px";
    requestAnimationFrame(()=> el.style.opacity = "1");
    clearTimeout(el._t);
    el._t = setTimeout(()=> el.style.opacity = "0", 1600);
  }

  function isGreyish(el) {
    const cs = getComputedStyle(el);
    const m = (cs.backgroundColor || "").match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return false;
    const [r,g,b] = [m[1],m[2],m[3]].map(Number);
    const near = Math.abs(r-g)<12 && Math.abs(g-b)<12 && Math.abs(r-b)<12;
    return near && (r+g+b)/3 < 245;
  }

  function attachOccupiedClicks(grid) {
    if (grid.__wuClicksAttached) return;
    grid.__wuClicksAttached = true;

    grid.addEventListener("click", (ev) => {
      let cell = ev.target && ev.target.closest(OCCUPIED_SEL);
      if (!cell) cell = ev.target && ev.target.closest('[aria-disabled="true"], .disabled, .is-disabled');
      if (!cell) {
        const maybe = ev.target && ev.target.closest(`${GRID_SEL} *`);
        if (maybe && isGreyish(maybe)) cell = maybe;
      }
      if (cell) showPopup(ev.clientX, ev.clientY, "Hier ist bereits belegt.");
    }, {passive:true});
  }

  // --- Badge einmalig ---
  function showOnceBadge() {
    if (document.querySelector("."+CLASS_BADGE)) return;
    const b = document.createElement("div");
    b.className = CLASS_BADGE;
    b.textContent = "✅ Script aktiv – " + new Date().toLocaleTimeString();
    document.documentElement.appendChild(b);
    setTimeout(()=> b.remove(), 5000);
  }

  // --- Apply / Re-apply ---
  function apply() {
    ensureStyle();
    const grid = document.querySelector(GRID_SEL);
    if (!grid) return;
    relabelSpaceHeader(grid);
    applyDayTimeLabels(grid);
    attachOccupiedClicks(grid);
  }

  function reapplyOnDomChanges() {
    const mo = new MutationObserver(() => {
      const grid = document.querySelector(GRID_SEL);
      if (!grid) return;
      relabelSpaceHeader(grid);
      // je nach aktivem Tab Label setzen oder zurückrollen
      if (isDayViewActive()) applyDayTimeLabels(grid);
      else restoreOriginalTimeLabels(grid);
    });
    mo.observe(document.documentElement, {subtree:true, childList:true});
  }

  // --- Start ---
  const start = () => { showOnceBadge(); apply(); reapplyOnDomChanges(); };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
