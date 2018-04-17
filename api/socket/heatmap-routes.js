// custom modules
import pool from "../db/db-setup.js";
import SQLInputManager from "../utils/sql-filters.js";
import moment from "moment";

function executeSQLQuery(inputManager, samplingRate, socket) {
   const extractSubset = function(rows, prefix) {
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
      return rows.map(row => {
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
   var sqlTemplate = `
		SELECT vin,
			   arrived_at,
			   departed_at,
			   hr,
			   dow,
			   arrival_lat,
			   arrival_lng,
			   departure_lat,
			   departure_lng,
			   trip_distance_km,
			   trip_time
			FROM query_view TABLESAMPLE SYSTEM(${samplingRate})
			WHERE ${inputManager.whereClauses}
			LIMIT 50000;
	`;
   const start = moment();
   pool.query(
      sqlTemplate,
      inputManager.inputs,
      (err, { rows: coordinates = [], rowCount = 0 } = {}) => {
         if (err) console.error(err);
         var dbLatency = moment().diff(start);
         socket.emit("departure data", {
            coordinates: extractSubset(coordinates, "departure"),
            info: {
               startTime: start,
               dbLatency: dbLatency,
               latency: moment().diff(start) - dbLatency, // ms
               speculation: false,
               rows: rowCount
            }
         });
         socket.emit("arrival data", {
            coordinates: extractSubset(coordinates, "arrival"),
            info: {
               startTime: start,
               dbLatency: dbLatency,
               latency: moment().diff(start) - dbLatency, // ms
               speculation: false,
               rows: rowCount
            }
         });
      }
   );
}

function sqlBuilder(socket, data) {
   const inputManager = new SQLInputManager(data);
   executeSQLQuery(inputManager, data.advancedSettings.samplingRate, socket);
}

module.exports = function(socket) {
   socket.on("heatmap", function(data) {
      getHeatMap(socket, data);
   });

   socket.on("heatmap range", function(data) {
      getHeatMapRange(socket, data);
   });

   socket.on("heatmap grid", function(data) {
      getHeatMapGrid(socket, data);
   });

   socket.on("vehicle heatmap", function(data) {
      getVehicleLocations(socket, data);
   });

   socket.on("geofence inbound", function(data) {
      getGeofenceInboundTraffic(socket, data);
   });

   socket.on("geofence outbound", function(data) {
      getGeofenceOutboundTraffic(socket, data);
   });

   socket.on("geofence between", function(data) {
      getBetweenGeofences(socket, data);
   });

   socket.on("test sql", function(data) {
      testSQL(socket, data);
   });

   socket.on("data changed", function(data) {
      sqlBuilder(socket, data);
   });
};
