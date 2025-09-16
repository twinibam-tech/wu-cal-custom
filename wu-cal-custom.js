/* wu-cal-custom.js – Day header relabel + widths + month off (robust) */
(function () {
  // ===== CONFIG =====
  const ROOM_COL_W = 240;                     // px
  const TIME_COL_W = 80;                      // px
  const DAY_TIMES = [
    "08:00","09:00","10:00","11:00","12:00","13:00",
    "14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"
  ];

  const styleId = "wu-cal-custom-css";
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  function ensureStyle() {
    if (document.getElementById(styleId)) return;
    const css = `
      .chadmo-gridsView{ --roomColW:${ROOM_COL_W}px; --timeColW:${TIME_COL_W}px; }

      /* Raumspalte breiter – Header + Body */
      .chadmo-gridsView .grid-canvas .chadmo-row > .headerCell.rowHeadLeftCss1,
      .chadmo-gridsView .header .rowHeadLeftCss2.originCell,
      .chadmo-gridsView .header .header-columns .header-column[id="0"],
      .chadmo-gridsView .header .header-columns .header-column:first-child{
        width:var(--roomColW)!important; min-width:var(--roomColW)!important; max-width:var(--roomColW)!important;
      }
      /* erste Datenspalte neben die Raumspalte schieben */
      .chadmo-gridsView .grid-canvas .chadmo-row > .chadmo-cell.left0,
      .chadmo-gridsView .grid-canvas .chadmo-row > .chadmo-cell.cellCol0,
      .chadmo-gridsView .grid-canvas .chadmo-row > .chadmo-cell:nth-of-type(2){
        left: var(--roomColW)!important;
      }
      /* Breite der Zeitspalten angleichen */
      .chadmo-gridsView .header .header-columns .header-column:nth-of-type(n+2){
        width: var(--timeColW)!important; min-width: var(--timeColW)!important; max-width: var(--timeColW)!important;
        position: relative;
      }

      /* Fallback-Overlay für Tag-Ansicht: Zeitlabels mittig */
      html[data-view="day"] .chadmo-gridsView .header .header-columns .header-column:nth-of-type(n+2) .mergedHeaderContent{
        font-size:0 !important; position:relative;
      }
      html[data-view="day"] .chadmo-gridsView .header .header-columns .header-column:nth-of-type(n+2) .mergedHeaderContent::before{
        content: attr(data-wu-time); position:absolute; top:50%; left:50%;
        transform:translate(-50%,-50%); font-size:16px; line-height:1; width:100%; text-align:center;
      }

      /* Monatsansicht sicher verbergen */
      html[data-view="month"] .chadmo-gridsView{ display:none!important; }
    `;
    const s = document.createElement("style");
    s.id = styleId; s.textContent = css;
    document.head.appendChild(s);
  }

  function markView() {
    const root = document.documentElement;
    const tabs = $$('[role="tab"], .mat-tab-label, .usi-tab');
    const active = tabs.find(el => el.getAttribute('aria-selected')==='true' || el.classList.contains('active'));
    const t = (active?.textContent || '').toLowerCase();
    if (/tag/.test(t)) root.setAttribute('data-view','day');
    else if (/woche/.test(t)) root.setAttribute('data-view','week');
    else if (/monat/.test(t)) root.setAttribute('data-view','month');
  }

  function disableMonth() {
    const tabs = $$('[role="tab"], .mat-tab-label, .usi-tab');
    const m = tabs.find(el => /monat/i.test(el.textContent||''));
    if (m) {
      m.style.pointerEvents='none'; m.style.opacity='.35'; m.setAttribute('aria-disabled','true');
      m.title='Monatsansicht ist deaktiviert';
    }
    if (/month/i.test(location.href)) {
      const back = tabs.find(el => /tag|woche/i.test(el.textContent||'')); if (back) back.click();
    }
  }

  // JS-Variante: Text in den Spalten direkt setzen (wenn DOM passt)
  function relabelDayHeaderJS() {
    if (document.documentElement.getAttribute('data-view') !== 'day') return;
    const cols = $$('.chadmo-gridsView .header .header-columns .header-column');
    if (cols.length < 2) return;
    // ab 1 sind Zeitspalten
    for (let i = 1; i < cols.length && i <= DAY_TIMES.length; i++) {
      const col = cols[i];
      // Breite sicherstellen
      col.style.width = TIME_COL_W+'px';
      col.style.minWidth = TIME_COL_W+'px';
      col.style.maxWidth = TIME_COL_W+'px';

      // 1) Versuche, echten Textcontainer zu finden
      const mc = col.querySelector('.mergedHeaderContent') || col.querySelector('*') || col;
      // für CSS-Fallback: Zeit als data-Attribut setzen
      if (mc.classList) mc.setAttribute('data-wu-time', DAY_TIMES[i-1]);

      // 2) Versuche: vorhandenen Text überschreiben
      // (ohne Struktur zu zerstören)
      let label = mc.querySelector('.wu-time-label');
      if (!label) {
        label = document.createElement('span');
        label.className = 'wu-time-label';
        label.style.position='absolute';
        label.style.top='50%'; label.style.left='50%';
        label.style.transform='translate(-50%,-50%)';
        label.style.fontSize='16px'; label.style.lineHeight='1';
        label.style.width='100%'; label.style.textAlign='center';
        label.style.pointerEvents='none';
        mc.style.position = 'relative';
        mc.appendChild(label);
      }
      label.textContent = DAY_TIMES[i-1];

      // Originaltext optisch ausblenden (falls sichtbar)
      Array.from(mc.childNodes).forEach(n=>{
        if (n!==label && n.nodeType===1 && !n.classList.contains('wu-time-label')) {
          n.style.opacity='0'; n.style.fontSize='0';
        }
      });
    }
  }

  function applyAll() {
    ensureStyle();
    markView();
    disableMonth();
    // minimal delay, damit das Grid sicher gerendert ist
    setTimeout(relabelDayHeaderJS, 0);
  }

  // Start + Re-Apply bei DOM-Änderungen
  console.log("✅ Externes JS geladen.");
  applyAll();
  window.addEventListener('load', applyAll);
  const mo = new MutationObserver(applyAll);
  mo.observe(document.documentElement, {subtree:true, childList:true, attributes:true});
})();
