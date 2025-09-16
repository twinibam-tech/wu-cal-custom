/* wu-cal-loader.js – DEV-Loader mit sichtbarem Badge & Cache-Bust */
(function () {
  // === Konfiguration ===
  const CORE_URL = "https://cdn.jsdelivr.net/gh/twinibam-tech/wu-cal-custom@main/wu-cal-custom.js";
  const BADGE_ID = "wu-dev-badge";
  const BTN_ID = "wu-dev-reload-btn";

  // === Badge einfügen (sichtbar auf der Seite) ===
  const style = document.createElement("style");
  style.textContent = `
    #${BADGE_ID}{
      position:fixed; right:12px; bottom:12px; z-index:999999;
      font:12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      background:#111; color:#fff; border-radius:8px; padding:10px 12px; box-shadow:0 4px 16px rgba(0,0,0,.3);
      max-width:280px
    }
    #${BADGE_ID} b{font-weight:600}
    #${BADGE_ID} code{font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace}
    #${BTN_ID}{
      display:inline-block; margin-top:8px; padding:6px 10px; border-radius:6px;
      background:#2d7ef7; color:#fff; border:none; cursor:pointer
    }
  `;
  document.head.appendChild(style);

  const badge = document.createElement("div");
  badge.id = BADGE_ID;
  badge.innerHTML = `
    <div><b>WU Custom JS (DEV)</b></div>
    <div>Quelle: <code id="wu-core-src">-</code></div>
    <div>Geladen: <span id="wu-loaded-at">-</span></div>
    <button id="${BTN_ID}" type="button">Core neu laden</button>
  `;
  document.documentElement.appendChild(badge);

  const srcEl = badge.querySelector("#wu-core-src");
  const tsEl  = badge.querySelector("#wu-loaded-at");
  const btn   = badge.querySelector("#" + BTN_ID);

  function format(ts){ return new Date(ts).toLocaleString(); }

  function loadCore(bust) {
    const v = bust || Date.now();               // Cache-Bust
    const url = CORE_URL + (CORE_URL.includes("?") ? "&" : "?") + "v=" + v;

    // Anzeige aktualisieren
    srcEl.textContent = url;
    tsEl.textContent = format(Date.now());

    // Script injizieren (synchron, damit dein Core sofort läuft)
    const s = document.createElement("script");
    s.src = url;
    s.async = false;
    document.head.appendChild(s);
  }

  btn.addEventListener("click", () => loadCore(Date.now()));

  // Beim ersten Laden direkt frische Core holen
  loadCore(Date.now());

  // Optional: Hook für deinen Core, um eigene Infos zurückzumelden
  window.WU_DEV_LOADER = {
    setInfo(text){ tsEl.textContent = text; }
  };
})();
