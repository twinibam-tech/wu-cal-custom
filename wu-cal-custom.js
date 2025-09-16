/* wu-cal-custom.js – WU customizations
   - "SPACE" -> "Raumverfügbarkeiten"
   - Zeitlabels nur in Tag-Ansicht
   - Popup bei Klick auf belegte (graue) Slots
   - Idempotent + robust via MutationObserver
*/
(function () {
  // ===== Konfiguration / Selektoren (ggf. anpassen) =====
  const GRID_SEL      = ".chadmo-gridsView";
  const HEADER_COLS   = ".header-columns .header-column";
  const HEADER_LABEL  = ".mergedHeaderContent";
  const TAB_SEL       = '[role="tab"], button, a';

  // Mögliche Klassen/Marker für belegte Slots (grau)
  const OCCUPIED_SEL =
    [
      // häufige Namen in Buchungs-UI
      ".occupied", ".booked", ".busy", ".blocked", ".unavailable", ".not-available", ".disabled",
      // generisch in Momentus-Grids
      ".reservation", ".reservation-blocked", ".grid-cell-disabled",
    ].join(",");

  // ===== Utils =====
  function isDayViewActive() {
    // Suche nach einem aktiven Tab mit Text "Tag"
    const activeTab =
      document.querySelector(`${TAB_SEL}[aria-selected="true"]`) ||
      document.querySelector(`${TAB_SEL}.active`);
    return !!activeTab && /(^|[\s|])tag([\s|]|$)/i.test(activeTab.textContent.trim());
  }

  function relabelSpaceHeader(grid) {
    // Erste Spalte ist die Räume-Spalte
    const firstHeader = grid.querySelector(`${HEADER_COLS}:first-of-type ${HEADER_LABEL}`) ||
                        grid.querySelector(`${HEADER_COLS}:first-of-type`);
    if (firstHeader && firstHeader.textContent.trim() !== "Raumverfügbarkeiten") {
      firstHeader.textContent = "Raumverfügbarkeiten";
    }
  }

  function relabelTimeHeadersIfDay(grid) {
    if (!isDayViewActive()) return; // nur im "Tag"-Tab

    const headers = grid.querySelectorAll(HEADER_COLS);
    if (!headers || headers.length === 0) return;

    // In deinem Setup: ab Spalte 2 = 08:00 bis Spalte 15 = 21:00
    const START_HOUR = 8;
    const NUM_HOURS  = 14; // 08..21 inkl.
    for (let i = 0; i < NUM_HOURS; i++) {
      const hour = START_HOUR + i;
      const colIndex = 2 + i; // 1 = Räume, ab 2 beginnen Stunden
      const cell = grid.querySelector(
        `${HEADER_COLS}:nth-of-type(${colIndex}) ${HEADER_LABEL}`
      ) || grid.querySelector(`${HEADER_COLS}:nth-of-type(${colIndex})`);
      if (cell) cell.textContent = `${String(hour).padStart(2, "0")}:00`;
    }
  }

  // Kleines Popup rechts/oben der Klickposition
  const POP_ID = "wu-occupied-popup";
  function showOccupiedPopup(x, y, text) {
    let el = document.getElementById(POP_ID);
    if (!el) {
      el = document.createElement("div");
      el.id = POP_ID;
      Object.assign(el.style, {
        position: "fixed",
        zIndex: 999999,
        background: "#263238",
        color: "#fff",
        padding: "8px 10px",
        borderRadius: "6px",
        boxShadow: "0 4px 14px rgba(0,0,0,.25)",
        font: "13px/1.3 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        maxWidth: "260px",
        pointerEvents: "none",
        opacity: "0",
        transition: "opacity .15s ease"
      });
      document.body.appendChild(el);
    }
    el.textContent = text;
    // Position mit kleinem Offset
    el.style.left = Math.max(8, x + 12) + "px";
    el.style.top  = Math.max(8, y + 12) + "px";
    // ein-/ausblenden
    requestAnimationFrame(() => (el.style.opacity = "1"));
    clearTimeout(el._t);
    el._t = setTimeout(() => {
      el.style.opacity = "0";
      // nach dem Faden lassen wir’s stehen (kann wiederverwendet werden)
    }, 1600);
  }

  // Fallback-Check: ist ein Element „grau“? (nur als letztes Mittel)
  function isGreyish(el) {
    const cs = getComputedStyle(el);
    const bg = cs.backgroundColor || "";
    // sehr einfache Heuristik: grau hat r≈g≈b und nicht transparent/weiß
    const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return false;
    const [r, g, b] = [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
    const diffRG = Math.abs(r - g);
    const diffGB = Math.abs(g - b);
    const diffRB = Math.abs(r - b);
    const isNearEqual = diffRG < 12 && diffGB < 12 && diffRB < 12;
    const isNotWhite = (r + g + b) / 3 < 245;
    return isNearEqual && isNotWhite;
  }

  function handleOccupiedClicks(grid) {
    // Delegation: wir reagieren nur auf belegte Slots
    grid.addEventListener("click", (ev) => {
      const t = ev.target;
      if (!t) return;

      // 1) offensichtliche Klassen/Marker
      let cell = t.closest(OCCUPIED_SEL);
      // 2) häufiges Pattern: deaktivierte/blocked Zellen
      if (!cell) cell = t.closest('[aria-disabled="true"], .disabled, .is-disabled');
      // 3) Heuristik: graue Zellen im Raster
      if (!cell) {
        const maybe = t.closest(`${GRID_SEL} *`);
        if (maybe && isGreyish(maybe)) cell = maybe;
      }

      if (cell) {
        showOccupiedPopup(ev.clientX, ev.clientY, "Hier ist bereits belegt.");
      }
    }, { passive: true });
  }

  // Sichtbares Badge, um zu erkennen, dass diese Version aktiv ist
  function showOnceBadge() {
    if (document.getElementById("wu-badge")) return;
    const b = document.createElement("div");
    b.id = "wu-badge";
    b.textContent = "✅ Script aktiv – " + new Date().toLocaleTimeString();
    Object.assign(b.style, {
      position: "fixed", top: "12px", right: "12px", zIndex: 999999,
      background: "#1b5e20", color: "#fff", padding: "8px 10px",
      borderRadius: "6px", boxShadow: "0 2px 8px rgba(0,0,0,.15)",
      font: "14px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    });
    document.documentElement.appendChild(b);
    setTimeout(() => b.remove(), 5000);
  }

  // Haupt-Anwendung
  function applyAll() {
    const grid = document.querySelector(GRID_SEL);
    if (!grid) return;

    relabelSpaceHeader(grid);          // immer
    relabelTimeHeadersIfDay(grid);     // nur im Tag-Tab
    handleOccupiedClicks(grid);        // einmal Listener setzen
  }

  // Initial laden
  const run = () => { showOnceBadge(); applyAll(); };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  // SPA/DOM-Änderungen beobachten und sanft re-applien
  const mo = new MutationObserver(() => {
    const grid = document.querySelector(GRID_SEL);
    if (!grid) return;
    // nur schnelle Re-Applies, idempotent
    relabelSpaceHeader(grid);
    relabelTimeHeadersIfDay(grid);
  });
  mo.observe(document.documentElement, { subtree: true, childList: true });

})();
