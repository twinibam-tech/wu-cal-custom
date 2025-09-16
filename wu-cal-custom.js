(function () {
  console.log("✅ Externes JS geladen.");
  var b = document.createElement("div");
  b.textContent = "✅ externes JS aktiv";
  Object.assign(b.style, {
    position:"fixed", top:"12px", right:"12px", zIndex:"999999",
    padding:"8px 10px", font:"14px/1.2 system-ui, sans-serif",
    background:"#1b5e20", color:"#fff", borderRadius:"6px",
    boxShadow:"0 2px 8px rgba(0,0,0,.15)"
  });
  document.documentElement.appendChild(b);
  setTimeout(()=>b.remove(), 6000);
})();
