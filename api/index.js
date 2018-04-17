// external modules
import fs from "fs";
import express from "express";
import path from "path";
import socket from "socket.io";
import morgan from "morgan";
import bodyParser from "body-parser";

// custom modules
import routes from "./routes";
import pool from "./db/db-setup.js";
import socketRoutes from "./socket";

// create and configure the application
const app = express();
app.set("views", "./api/views");
app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "../public")));

// NOTE: this is temporary, once the files are being uploaded
// to a bucket this will not be necessary.
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/public", express.static(path.join(__dirname, "../public")));

// logging
const accessLogStream = fs.createWriteStream(
   path.join(__dirname, "access.log"),
   { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

// load routes
routes.referenceData(app);
routes.dataUpload(app);
routes.serveApp(app);

// start the server of the provided port
const port = process.env.PORT || 8080;
var server = app.listen(port, () => {
   console.log(`Server started on: ${port}`);
});

// setup the socket connection
var io = socket(server);
io.on("connection", function(socket) {
   console.log("Initialized socket connection");
   socketRoutes.heatmapRoutes(socket);
});
