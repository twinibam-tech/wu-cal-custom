<script>
(() => {
  // Konfiguration
  const START_HOUR = 8;
  const NUM_HOURS  = 14; // 08:00..21:00 (inkl.)

  // Selektoren (ggf. anpassen, aber so passt es zum Screenshot/CSS)
  const GRID_SEL    = '.chadmo-gridsView';
  const HEADER_SEL  = '.header-columns .header-column .mergedHeaderContent';
  const TAB_SEL     = '[role="tab"], button, a';

  // Hilfsfunktionen
  const isDayViewActive = () => {
    // robust: schaue nach einem aktiven Tab, dessen Text "Tag" enthält
    const activeTab = document.querySelector(`${TAB_SEL}[aria-selected="true"]`)
                    || document.querySelector(`${TAB_SEL}.active`);
    return !!activeTab && /(^|\s)tag(\s|$)/i.test(activeTab.textContent.trim());
  };

  const labelForIndex = (i /* 1-based für Stunden-Spalten */) => {
    const hour = START_HOUR + (i - 1);
    return `${String(hour).padStart(2, '0')}:00`;
  };

  const relabelHeaders = () => {
    const grid = document.querySelector(GRID_SEL);
    if (!grid) return;

    const headers = grid.querySelectorAll(HEADER_SEL);
    if (!headers.length) return;

    // Spalte 1 ist "SPACE" -> unangetastet lassen
    if (isDayViewActive()) {
      for (let i = 1; i <= NUM_HOURS && i < headers.length; i++) {
        const el = headers[i]; // 0 = SPACE, 1.. = Stunden
        if (!el.dataset.originalText) {
          el.dataset.originalText = el.textContent.trim();
        }
        el.textContent = labelForIndex(i);
        el.dataset.jsLabeled = '1';
      }
    } else {
      // Alte Labels wiederherstellen, wenn wir nicht in der Tag-Ansicht sind
      headers.forEach((el, idx) => {
        if (idx === 0) return;
        if (el.dataset.jsLabeled && el.dataset.originalText) {
          el.textContent = el.dataset.originalText;
        }
        delete el.dataset.jsLabeled;
      });
    }
  };

  // Observer, um auf DOM-Änderungen zu reagieren (Navigation, Filter, Datum)
  let mo = null;
  const ensureObserver = () => {
    const grid = document.querySelector(GRID_SEL);
    if (!grid || mo) return;
    mo = new MutationObserver(() => relabelHeaders());
    mo.observe(grid, { childList: true, subtree: true });
  };

  // Tabs-Klicks abfangen (Wechsel Tag/Woche/Monat)
  const wireTabClicks = () => {
    document.querySelectorAll(TAB_SEL).forEach(btn => {
      if (btn.dataset.jsWired) return;
      btn.dataset.jsWired = '1';
      btn.addEventListener('click', () => {
        // kleine Verzögerung, bis der View gewechselt hat
        setTimeout(relabelHeaders, 0);
      });
    });
  };

  // Initial
  const boot = () => {
    ensureObserver();
    wireTabClicks();
    relabelHeaders();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Optional: bei Window-Focus/Resize ebenfalls nachziehen
  window.addEventListener('focus', relabelHeaders);
  window.addEventListener('resize', relabelHeaders);
})();
</script>
