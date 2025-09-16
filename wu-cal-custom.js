/* wu-cal-custom.js – CSS-Injection + sichtbarer Badge */
(function () {
  const STYLE_ID = "wu-inline-css";
  const BADGE_ID = "wu-inline-badge";

  // === CSS aus deiner Vorgabe + SPACE-Umbenennung ===
  const CSS = `
/* ===== Header Logo (smaller, moved inward, responsive) ===== */
.usi-gradientbackground{
  position: relative;
  /* leave room so the H1 never collides with the logo */
  padding-right: clamp(120px, 12vw, 220px) !important;
}

/* White WU logo drawn via mask */
.usi-gradientbackground::after{
  content: "";
  position: absolute;

  /* place it a bit away from the right edge */
  right: clamp(28px, 4vw, 56px);

  /* vertically centered with a tiny optical lift */
  top: 50%;
  transform: translateY(-48%);

  /* responsive size: small on narrow screens, capped on wide */
  height: clamp(56px, 7.5vw, 96px);
  aspect-ratio: 16 / 9;

  -webkit-mask-image: url("https://www.wu.ac.at/typo3temp/assets/_processed_/0/a/csm_news_fallback_lg_692ea2c9f7.png");
  mask-image: url("https://www.wu.ac.at/typo3temp/assets/_processed_/0/a/csm_news_fallback_lg_692ea2c9f7.png");
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-position: center;
  mask-position: center;
  background-color: #fff;

  opacity: .95;
  pointer-events: none;
  z-index: 0;
}

/* Fallback if mask unsupported (keeps it white) */
@supports not (-webkit-mask-image: url("")) {
  .usi-gradientbackground::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Logo_Wirtschaftsuniversit%C3%A4t_Wien.svg/251px-Logo_Wirtschaftsuniversit%C3%A4t_Wien.svg.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    filter: brightness(0) invert(1);
  }
}

@media (max-width: 1200px){
  .usi-gradientbackground{
    padding-right: clamp(110px, 10vw, 180px) !important;
  }
  .usi-gradientbackground::after{
    right: clamp(20px, 3vw, 40px);
    height: clamp(48px, 6.5vw, 84px);
  }
}

@media (max-width: 600px){
  .usi-gradientbackground::after{ display:none; }
}

/* ===== Desktop/Tablet: Zeit-Labels im Grid ersetzen ===== */
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

/* ===== SPACE -> Verfügbarkeiten (nur 1. Spalte) ===== */
.chadmo-gridsView .header-columns .header-column:first-of-type .mergedHeaderContent::before{
  content:"Verfügbarkeiten";
  font-size:14px!important; line-height:1; display:inline-block;
}

/* ===== Mobile: ✓ vor jeder vorhandenen Zeitzeile ===== */
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

  function showBadge() {
    if (document.getElementById(BADGE_ID)) return;
    const b = document.createElement("div");
    b.id = BADGE_ID;
    b.textContent = "✅ NEUES SCRIPT AKTIV – " + new Date().toLocaleTimeString();
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

  function applyAll() { injectStyle(); showBadge(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyAll);
  } else {
    applyAll();
  }

  new MutationObserver(() => injectStyle())
    .observe(document.documentElement, {subtree:true, childList:true});
})();
