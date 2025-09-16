/* wu-cal-custom.js – Day header relabel + widths + month off (robust) */
(function () {
  // Start + Re-Apply bei DOM-Änderungen
  console.log("✅ Externes JS geladen.");
  applyAll();
  window.addEventListener('load', applyAll);
  const mo = new MutationObserver(applyAll);
  mo.observe(document.documentElement, {subtree:true, childList:true, attributes:true});
})();
