"use strict";

var _dbSetup = require("../db/db-setup.js");

var _dbSetup2 = _interopRequireDefault(_dbSetup);

var _sqlFilters = require("../utils/sql-filters.js");

var _sqlFilters2 = _interopRequireDefault(_sqlFilters);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function executeSQLQuery(inputManager, samplingRate, socket) {
   var extractSubset = function extractSubset(rows, prefix) {
      if (prefix === "departure") {
         var tripTime = "departed_at";
         var tripType = 0;
         var lngCoord = "departure_lng";
         var latCoord = "departure_lat";
      } else {
         // type === 'arrival'
         var tripTime = "arrived_at";
         var tripType = 1;
         var lngCoord = "arrival_lng";
         var latCoord = "arrival_lat";
      }
      return rows.map(function (row) {
         return {
            vin: row.vin,
            t: tripType,
            tm: row[tripTime],
            hr: row.hr,
            d: row.dow,
            lng: row[lngCoord],
            lat: row[latCoord],
            td: row.trip_distance_km,
            tt: row.trip_time
         };
      });
   };
   var sqlTemplate = "\n\t\tSELECT vin,\n\t\t\t   arrived_at,\n\t\t\t   departed_at,\n\t\t\t   hr,\n\t\t\t   dow,\n\t\t\t   arrival_lat,\n\t\t\t   arrival_lng,\n\t\t\t   departure_lat,\n\t\t\t   departure_lng,\n\t\t\t   trip_distance_km,\n\t\t\t   trip_time\n\t\t\tFROM query_view TABLESAMPLE SYSTEM(" + samplingRate + ")\n\t\t\tWHERE " + inputManager.whereClauses + "\n\t\t\tLIMIT 50000;\n\t";
   var start = (0, _moment2.default)();
   _dbSetup2.default.query(sqlTemplate, inputManager.inputs, function (err) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$rows = _ref.rows,
          coordinates = _ref$rows === undefined ? [] : _ref$rows,
          _ref$rowCount = _ref.rowCount,
          rowCount = _ref$rowCount === undefined ? 0 : _ref$rowCount;

      if (err) console.error(err);
      var dbLatency = (0, _moment2.default)().diff(start);
      socket.emit("departure data", {
         coordinates: extractSubset(coordinates, "departure"),
         info: {
            startTime: start,
            dbLatency: dbLatency,
            latency: (0, _moment2.default)().diff(start) - dbLatency, // ms
            speculation: false,
            rows: rowCount
         }
      });
      socket.emit("arrival data", {
         coordinates: extractSubset(coordinates, "arrival"),
         info: {
            startTime: start,
            dbLatency: dbLatency,
            latency: (0, _moment2.default)().diff(start) - dbLatency, // ms
            speculation: false,
            rows: rowCount
         }
      });
   });
} // custom modules


function sqlBuilder(socket, data) {
   var inputManager = new _sqlFilters2.default(data);
   executeSQLQuery(inputManager, data.advancedSettings.samplingRate, socket);
}

module.exports = function (socket) {
   socket.on("heatmap", function (data) {
      getHeatMap(socket, data);
   });

   socket.on("heatmap range", function (data) {
      getHeatMapRange(socket, data);
   });

   socket.on("heatmap grid", function (data) {
      getHeatMapGrid(socket, data);
   });

   socket.on("vehicle heatmap", function (data) {
      getVehicleLocations(socket, data);
   });

   socket.on("geofence inbound", function (data) {
      getGeofenceInboundTraffic(socket, data);
   });

   socket.on("geofence outbound", function (data) {
      getGeofenceOutboundTraffic(socket, data);
   });

   socket.on("geofence between", function (data) {
      getBetweenGeofences(socket, data);
   });

   socket.on("test sql", function (data) {
      testSQL(socket, data);
   });

   socket.on("data changed", function (data) {
      sqlBuilder(socket, data);
   });
};