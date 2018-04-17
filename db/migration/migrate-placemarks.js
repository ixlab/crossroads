var pool = require("../db-setup.js");
var utils = require("../utils.js");

/**
 * Adds the postGIS Geometry column to table placemarks
 */
function addCoordinatesColumn(callback) {
   pool.query(
      `
		DO $$
			BEGIN
				DECLARE
    				result text;
				BEGIN
					SELECT AddGeometryColumn('public', 'placemarks', 'coordinates', 4326, 'POINT', 2) INTO result;
				EXCEPTION
					WHEN duplicate_column THEN RAISE NOTICE 'column coordinates already exists in placemarks.';
				END;
			END;
		$$
	`,
      function(err, res) {
         if (err)
            console.log(
               "An error occurred when adding the location column: " + err
            );
      }
   );
}

/**
 * Creates the placemarks table
 */
function createPlacemarksTable(callback) {
   pool.query(
      `
		CREATE TABLE IF NOT EXISTS placemarks(
			placemark_id SERIAL PRIMARY KEY,
			created_at BIGINT NOT NULL,
			vin VARCHAR(155) NOT NULL,
			UNIQUE(vin, created_at)
		)
	`,
      function(err, res) {
         if (err) console.log("error creating placemarks table:", err);
         else addCoordinatesColumn(callback);
      }
   );
}

module.exports = createPlacemarksTable;
