<script>
(function () {
  function start() {
    window.App.DB.init(function (err, dbApi) {
      var out = document.getElementById("out");
      if (err) {
        out.innerHTML = '<pre style="color:red">' + err.message + "</pre>";
        console.error(err);
        return;
      }
      window.App.UI.bind(dbApi);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
</script>
