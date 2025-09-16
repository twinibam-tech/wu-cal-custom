(function(){
  const box = document.createElement("div");
  box.textContent = "✅ NEUES SCRIPT GELADEN " + new Date().toLocaleTimeString();
  box.style.cssText = `
    position:fixed; top:60px; right:20px; z-index:99999;
    background:#e91e63; color:white; padding:10px 14px; 
    font:bold 14px/1.4 sans-serif; border-radius:6px;
    box-shadow:0 2px 8px rgba(0,0,0,.3);
  `;
  document.body.appendChild(box);
})();
