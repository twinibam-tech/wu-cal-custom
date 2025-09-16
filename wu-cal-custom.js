// wu-cal-custom.js (Test)
(function () {
  // 1) Konsolen-Check
  console.log("✅ Externes JS geladen (GitHub/CDN).");

  // 2) Sichtbares Badge oben rechts
  var badge = document.createElement("div");
  badge.textContent = "✅ externes JS aktiv";
  badge.style.position = "fixed";
  badge.style.top = "12px";
  badge.style.right = "12px";
  badge.style.zIndex = "999999";
  badge.style.padding = "8px 10px";
  badge.style.font = "14px/1.2 system-ui, sans-serif";
  badge.style.background = "#1b5e20";
  badge.style.color = "#fff";
  badge.style.borderRadius = "6px";
  badge.style.boxShadow = "0 2px 8px rgba(0,0,0,.15)";
  document.documentElement.appendChild(badge);

  // 3) Nach 6s wieder ausblenden
  setTimeout(function(){ badge.remove(); }, 6000);
})();
