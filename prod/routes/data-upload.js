"use strict";

Object.defineProperty(exports, "__esModule", {
   value: true
});

exports.default = function (app) {
   app.post("/api/data-upload/upload-sqlite", uploadSQLiteData);
   app.get("/api/data-upload/retrieve-sqlite", retrieveSQLiteData);
};

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// external modules
function uploadSQLiteData(req, res) {
   // NOTE: this should actually be going to a bucket or something, and should
   // also probably only have one db file per user, and just overwrite that each
   // time. For now, the filename is hardcoded as sql.db
   var filePath = _path2.default.resolve(__dirname, "..", "data-uploads", "sql.db");

   _fs2.default.writeFile(filePath, new Buffer(Object.keys(req.body.data).map(function (key) {
      return req.body.data[key];
   })), function (err, result) {
      if (err) res.status("500").json({ success: false, error: err });else res.json({ success: true });
   });
}

function retrieveSQLiteData(req, res) {
   var filePath = _path2.default.resolve(__dirname, "..", "data-uploads", "sql.db");

   if (_fs2.default.existsSync(filePath)) _fs2.default.readFile(filePath, function (err, result) {
      if (err) res.status("500").json({ success: false, error: err });else res.json({ success: true, db: result });
   });else res.status("204").json({ success: true, db: "" });
}