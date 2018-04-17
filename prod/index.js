"use strict";

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _socket = require("socket.io");

var _socket2 = _interopRequireDefault(_socket);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _routes = require("./routes");

var _routes2 = _interopRequireDefault(_routes);

var _dbSetup = require("./db/db-setup.js");

var _dbSetup2 = _interopRequireDefault(_dbSetup);

var _socket3 = require("./socket");

var _socket4 = _interopRequireDefault(_socket3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create and configure the application
var app = (0, _express2.default)();

// custom modules
// external modules

app.set("views", "./api/views");
app.set("view engine", "ejs");
app.use("/public", _express2.default.static(_path2.default.join(__dirname, "../public")));

// NOTE: this is temporary, once the files are being uploaded
// to a bucket this will not be necessary.
app.use(_bodyParser2.default.json({ limit: "50mb" }));
app.use("/public", _express2.default.static(_path2.default.join(__dirname, "../public")));

// logging
var accessLogStream = _fs2.default.createWriteStream(_path2.default.join(__dirname, "access.log"), { flags: "a" });
app.use((0, _morgan2.default)("combined", { stream: accessLogStream }));

// load routes
_routes2.default.referenceData(app);
_routes2.default.dataUpload(app);
_routes2.default.serveApp(app);

// start the server of the provided port
var port = process.env.PORT || 8080;
var server = app.listen(port, function () {
   console.log("Server started on: " + port);
});

// setup the socket connection
var io = (0, _socket2.default)(server);
io.on("connection", function (socket) {
   console.log("Initialized socket connection");
   _socket4.default.heatmapRoutes(socket);
});
