var pool = require("../db-setup.js");
var utils = require("../utils.js");

/**
 * Adds the postGIS Geometry column to table service_regions
 */
function addGeofenceColumn(callback) {
   pool.query(
      `
		DO $$
			BEGIN
				DECLARE
    				result text;
				BEGIN
					SELECT AddGeometryColumn('public', 'service_regions', 'geofence', 4326, 'POLYGON', 2) INTO result;
				EXCEPTION
					WHEN duplicate_column THEN RAISE NOTICE 'column geofence already exists in service_regions.';
				END;
			END;
		$$
	`,
      function(err, res) {
         if (err)
            console.log(
               "An error occurred when adding the geometry column: " + err
            );
         else callback();
      }
   );
}

/**
 * Creates the car2go service regions table if it does not exist in the current db
 */
function createServiceRegionsTable(callback) {
   pool.query(
      `
		CREATE TABLE IF NOT EXISTS service_regions (
			id SERIAL PRIMARY KEY,
			name VARCHAR(155) NOT NULL UNIQUE,
			zonetype VARCHAR(155) NOT NULL
		);
	`,
      function(err, res) {
         if (err)
            console.log("An error occurred when creating the table:" + err);
         else addGeofenceColumn(callback);
      }
   );
}

/**
 * Creates and updates the table service_regions in the database to include all regions
 * specified in ../data/service-regions.json
 */
function migrateServiceRegions() {
   createServiceRegionsTable(function() {
      var regions = require("../data/service-regions.json");
      for (var i = 0; i < regions.length; i++) {
         var region = regions[i];
         pool.query(
            `
				INSERT INTO service_regions (name, zonetype, geofence)
				VALUES ($1, $2, $3);
			`,
            [
               region["name"],
               region["zoneType"],
               utils.getPostGISPolygon(region["coordinates"], 0, 1)
            ],
            function(err, res) {
               if (err && err["routine"] != "_bt_check_unique")
                  console.log("An error occurred:", err);
            }
         );
      }
      console.log("Uploading service region geofences.");
   });
}

module.exports = migrateServiceRegions;
