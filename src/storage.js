(function () {
  var LS_KEY = (window.App && window.App.Config && window.App.Config.LS_KEY) || "demo_sqlite_db_v1";

  function saveDBBytes(u8) {
    var s = "";
    for (var i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
    localStorage.setItem(LS_KEY, btoa(s));
  }

  function loadDBBytes() {
    var b64 = localStorage.getItem(LS_KEY);
    if (!b64) return null;
    var bin = atob(b64);
    var arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }

  window.App = window.App || {};
  window.App.Storage = { saveDBBytes: saveDBBytes, loadDBBytes: loadDBBytes };
})();
