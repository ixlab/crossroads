var pool = require("../db-setup.js");
var utils = require("../utils.js");

/**
 * Adds the postGIS Geometry column to table states
 */
function addGeofenceColumn(callback) {
   pool.query(
      `
		DO $$
			BEGIN
				DECLARE
    				result text;
				BEGIN
					SELECT AddGeometryColumn('public', 'states', 'geofence', 4326, 'POLYGON', 2) INTO result;
				EXCEPTION
					WHEN duplicate_column THEN RAISE NOTICE 'column geofence already exists in states.';
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
 * Creates the states table if it does not exist in the current db
 */
function createStatesTable(callback) {
   pool.query(
      `
		CREATE TABLE IF NOT EXISTS states (
			id SERIAL PRIMARY KEY,
			name VARCHAR(155) NOT NULL UNIQUE
		);
	`,
      function(err, res) {
         if (err)
            console.log("An error occurred when creating the table: " + err);
         else addGeofenceColumn(callback);
      }
   );
}

/**
 * Creates and updates the database to include all state geofences based on data
 * stored in ../data/states.json
 */
function migrateStates() {
   createStatesTable(function() {
      var states = require("../data/states.json");
      for (var i = 0; i < states.length; i++) {
         var state = states[i];
         pool.query(
            `
				INSERT INTO states (name, geofence)
				VALUES ($1, $2);
			`,
            [state["name"], utils.getPostGISPolygon(state["points"])],
            function(err, res) {
               if (err && err["routine"] != "_bt_check_unique")
                  console.log("An error occurred:", err);
            }
         );
      }
      console.log("Uploading state geofences.");
   });
}

module.exports = migrateStates;
