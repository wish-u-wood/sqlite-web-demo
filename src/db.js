(function () {
  var SQL_JS_CDN = (window.App && window.App.Config && window.App.Config.SQL_JS_CDN) ||
                   "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2";
  var SQL = null, db = null;

  function persist() {
    var data = db.export();
    window.App.Storage.saveDBBytes(data);
  }

  function getDefaultQuery() {
    return "SELECT * FROM notes ORDER BY id DESC;";
  }

  function exec(sql, params) {
    return db.exec(sql, params || []);
  }

  function insertNote(title, content) {
    db.run("INSERT INTO notes (title, content) VALUES (?, ?);", [title, content]);
    persist();
  }

  function reset() {
    db.run("DROP TABLE IF EXISTS notes;");
    db.run("CREATE TABLE notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')));");
    db.run("INSERT INTO notes (title, content) VALUES ('Hello', 'Fresh db');");
    persist();
  }

  function exportBytes() {
    return db.export();
  }

  function init(callback) {
    if (!window.initSqlJs) { callback(new Error("sql.js failed to load")); return; }

    window.initSqlJs({ locateFile: function (file) { return SQL_JS_CDN + "/" + file; } })
      .then(function (SQLModule) {
        SQL = SQLModule;
        var bytes = window.App.Storage.loadDBBytes();
        db = bytes ? new SQL.Database(bytes) : new SQL.Database();

        if (!bytes) {
          // Load schema and seed data from external file
          fetch("./src/schema.sql")
            .then(function (r){ return r.text(); })
            .then(function (sqlText){
              db.run(sqlText);
              persist();
              callback(null, api);
            })
            .catch(function (err){ callback(err); });
        } else {
          callback(null, api);
        }
      })
      .catch(function (err) { callback(err); });
  }
  var api = {
    init: init,
    exec: exec,
    insertNote: insertNote,
    reset: reset,
    exportBytes: exportBytes,
    getDefaultQuery: getDefaultQuery
  };

  window.App = window.App || {};
  window.App.DB = api;
})();
