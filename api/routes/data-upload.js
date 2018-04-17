// external modules
import fs from "fs";
import path from "path";

function uploadSQLiteData(req, res) {
   // NOTE: this should actually be going to a bucket or something, and should
   // also probably only have one db file per user, and just overwrite that each
   // time. For now, the filename is hardcoded as sql.db
   const filePath = path.resolve(__dirname, "..", "data-uploads", "sql.db");

   fs.writeFile(
      filePath,
      new Buffer(Object.keys(req.body.data).map(key => req.body.data[key])),
      (err, result) => {
         if (err) res.status("500").json({ success: false, error: err });
         else res.json({ success: true });
      }
   );
}

function retrieveSQLiteData(req, res) {
   const filePath = path.resolve(__dirname, "..", "data-uploads", "sql.db");

   if (fs.existsSync(filePath))
      fs.readFile(filePath, (err, result) => {
         if (err) res.status("500").json({ success: false, error: err });
         else res.json({ success: true, db: result });
      });
   else res.status("204").json({ success: true, db: "" });
}

export default function(app) {
   app.post("/api/data-upload/upload-sqlite", uploadSQLiteData);
   app.get("/api/data-upload/retrieve-sqlite", retrieveSQLiteData);
}
