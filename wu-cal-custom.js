/* wu-cal-custom.js – WU Calendar tweaks (Tag/Woche) */
(function () {
  // ===== CONFIG =====
  const ROOM_COL_W = 240;     // px – Breite Raumspalte
  const TIME_COL_W = 80;      // px – Breite je Zeitspalte
  const DAY_TIMES   = [
    "08:00","09:00","10:00","11:00","12:00","13:00",
    "14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"
  ];
  const ENABLE_WEEK_LABELS = false; // auf true, wenn du auch in Woche Labels setzen willst

  // ===== helpers =====
  const styleId = "wu-cal-custom-css";
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  function ensureStyle() {
    if (document.getElementById(styleId)) return;
    const css = `
      .chadmo-gridsView{ --roomColW:${ROOM_COL_W}px; --timeColW:${TIME_COL_W}px; }

      /* Raumspalte wirklich breiter machen – Header + Body */
      .chadmo-gridsView .grid-canvas .chadmo-row > .headerCell.rowHeadLeftCss1,
      .chadmo-gridsView .header .rowHeadLeftCss2.originCell,
      .chadmo-gridsView .header .header-columns .header-column[id="0"],
      .chadmo-gridsView .header .header-columns .header-column:first-child{
        width:var(--roomColW)!important; min-width:var(--roomColW)!important; max-width:var(--roomColW)!important;
      }
      /* erste Datenspalte rechts neben die Raumspalte schieben */
      .chadmo-gridsView .grid-canvas .chadmo-row > .chadmo-cell.left0,
      .chadmo-gridsView .grid-canvas .chadmo-row > .chadmo-cell.cellCol0,
      .chadmo-gridsView .grid-canvas .chadmo-row > .chadmo-cell:nth-of-type(2){
        left: var(--roomColW)!important;
      }
      /* Breite der 1. Zeitspalte (08:00) angleichen */
      .chadmo-gridsView .header .header-columns .header-column:nth-of-type(2),
      .chadmo-gridsView .grid-canvas .chadmo-row > .chadmo-cell.cellCol0,
      .chadmo-gridsView .grid-canvas .chadmo-cell.left0{
        width: var(--timeColW)!important; min-width: var(--timeColW)!important; max-width: var(--timeColW)!important;
      }

      /* Header-Hintergrund angleichen (gegen „weißes Loch“) */
      .chadmo-gridsView .header,
      .chadmo-gridsView .header .rowHeadLeftCss2.originCell,
      .chadmo-gridsView .header .header-columns,
      .chadmo-gridsView .header .header-columns .header-column,
      .chadmo-gridsView .header .header-columns .header-column .mergedHeaderContent{
        background:#f3f3f3!important;
      }
      .chadmo-gridsView .header::before, .chadmo-gridsView .header::after{ background:none!important; box-shadow:none!important; }
      .chadmo-gridsView .header .header-columns .header-column{ border-right-color:#ddd!important; }
      .chadmo-gridsView .grid-canvas .chadmo-row > .headerCell.rowHeadLeftCss1{ background:#fff; border-right:1px solid #ddd; }

      /* optisch: linkes Header-Label „Verfügbarkeiten“ */
      .chadmo-gridsView .header .originCell .originCellContent{ font-size:0 !important; }
      .chadmo-gridsView .header .originCell .originCellContent::after{
        content:"Verfügbarkeiten"; font-size:14px !important; line-height:1.3; font-weight:600;
        display:block; max-width:180px; white-space:normal; overflow:hidden; text-overflow:ellipsis;
      }

      /* Monatsansicht hart deaktivieren (falls die Route doch erreicht wird) */
      [data-view="month"] .chadmo-gridsView{ display:none!important; }
    `;
    const s = document.createElement("style");
    s.id = styleId;
    s.textContent = css;
    document.head.appendChild(s);
  }

  function currentViewToAttr() {
    const root = document.documentElement;
    const activeTab = $$('[role="tab"], .mat-tab-label, .usi-tab')
      .find(el => el.getAttribute('aria-selected') === 'true' || el.classList.contains('active'));
    if (!activeTab) return;
    const t = (activeTab.textContent || '').toLowerCase();
    if (t.includes('tag'))   root.setAttribute('data-view','day');
    else if (t.includes('woche')) root.setAttribute('data-view','week');
    else if (t.includes('monat')) root.setAttribute('data-view','month');
  }

  function disableMonthTab() {
    const tabs = $$('[role="tab"], .mat-tab-label, .usi-tab');
    const month = tabs.find(el => /monat/i.test(el.textContent||''));
    if (month) {
      month.style.pointerEvents = 'none';
      month.style.opacity = '0.35';
      month.setAttribute('aria-disabled','true');
      month.title = 'Monatsansicht ist deaktiviert';
    }
    // falls URL/Router doch auf Monat steht → zurück auf „Tag“ oder „Woche“
    if (/month/i.test(location.href)) {
      const back = tabs.find(el => /tag|woche/i.test(el.textContent||'')); 
      if (back) back.click();
    }
  }

  // Zeitlabels im Tag-Header robust setzen (keine nth-of-type nötig)
  function setDayHeaderTimes() {
    const rootView = document.documentElement.getAttribute('data-view');
    if (rootView !== 'day') return;

    const headerCols = $$('.chadmo-gridsView .header .header-columns .header-column');
    if (!headerCols.length) return;

    // erste Spalte ist der Dummy/Raum – wir starten ab Index 1
    const timeCols = headerCols.slice(1);

    // alte Inhalte ausblenden & unsere Zeitlabels einlegen
    timeCols.forEach((col, i) => {
      const mc = $('.mergedHeaderContent', col);
      if (!mc) return;
      mc.style.fontSize = '0';     // Originaltext unsichtbar
      mc.style.position = 'relative';
      // eigenes Label
      let lab = mc.querySelector('.wu-time-label');
      if (!lab) {
        lab = document.createElement('span');
        lab.className = 'wu-time-label';
        lab.style.position = 'absolute';
        lab.style.top = '50%';
        lab.style.left = '50%';
        lab.style.transform = 'translate(-50%,-50%)';
        lab.style.fontSize = '16px';
        lab.style.lineHeight = '1';
        lab.style.width = '100%';
        lab.style.textAlign = 'center';
        mc.appendChild(lab);
      }
      lab.textContent = DAY_TIMES[i] || '';
      // Breite der Spalten angleichen
      col.style.width = TIME_COL_W + 'px';
      col.style.minWidth = TIME_COL_W + 'px';
      col.style.maxWidth = TIME_COL_W + 'px';
    });
  }

  function setWeekHeaderTimesIfWanted() {
    if (!ENABLE_WEEK_LABELS) return;
    const rootView = document.documentElement.getAttribute('data-view');
    if (rootView !== 'week') return;
    // Falls du später Zeiten im Wochenheader beschriften willst, kannst du hier ähnlich wie oben rangehen.
  }

  function applyAll() {
    ensureStyle();
    currentViewToAttr();
    disableMonthTab();
    setDayHeaderTimes();
    setWeekHeaderTimesIfWanted();
  }

  // initial + bei Änderungen re-anwenden
  applyAll();
  window.addEventListener('load', applyAll);
  const mo = new MutationObserver(applyAll);
  mo.observe(document.documentElement, { subtree:true, childList:true, attributes:true });
})();
