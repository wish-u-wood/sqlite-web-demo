<script>
(function () {
  function bind(dbApi) {
    var out = document.getElementById("out");
    var sqlInput = document.getElementById("sql");
    var addForm = document.getElementById("add-form");

    function renderQuery(sql) {
      try {
        var res = dbApi.exec(sql);
        if (!res.length) { out.innerHTML = "<em>(no rows)</em>"; return; }
        var columns = res[0].columns, values = res[0].values;
        var header = "<tr>" + columns.map(function (c){ return "<th>"+c+"</th>"; }).join("") + "</tr>";
        var rows = values.map(function (row) {
          return "<tr>" + row.map(function (v){ return "<td>"+(v == null ? "" : v)+"</td>"; }).join("") + "</tr>";
        }).join("");
        out.innerHTML = "<table>" + header + rows + "</table>";
      } catch (e) {
        out.innerHTML = '<pre style="color:red">' + e.message + "</pre>";
      }
    }

    // initial
    sqlInput.value = dbApi.getDefaultQuery();
    renderQuery(sqlInput.value);

    // add note
    addForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var title = document.getElementById("title").value.trim();
      var content = document.getElementById("content").value.trim();
      if (!title || !content) return;
      dbApi.insertNote(title, content);
      renderQuery(sqlInput.value);
      addForm.reset();
    });

    document.getElementById("run").onclick = function () { renderQuery(sqlInput.value); };
    sqlInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); renderQuery(sqlInput.value); }
    });

    document.getElementById("reset").onclick = function () {
      dbApi.reset();
      renderQuery(dbApi.getDefaultQuery());
    };

    document.getElementById("export").onclick = function () {
      var data = dbApi.exportBytes();
      var blob = new Blob([data], { type: "application/octet-stream" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "demo.sqlite";
      a.click();
      URL.revokeObjectURL(a.href);
    };
  }

  window.App = window.App || {};
  window.App.UI = { bind: bind };
})();
</script>
