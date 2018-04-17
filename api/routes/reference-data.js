import pool from "../db/db-setup";

/**
 * Gets all the unique timestamps for which a heatmap
 * can be generated
 * @param {request} req - request object
 * @param {response} res - response object
 */
function getTimestamps(req, res) {
   pool.query(
      `
		SELECT DISTINCT arrived_at tm
			FROM trips
		ORDER BY tm ASC
	`,
      [],
      (err, { rows: timestamps = [] } = {}) => {
         console.error(err);
         res.json({ timestamps });
      }
   );
}

/**
 * Gets all the unique vehicle ids
 * @param {request} req - request object
 * @param {response} res - response object
 */
function getVehicles(req, res) {
   pool.query(
      `
		SELECT DISTINCT vin
			FROM trips
	`,
      [],
      (err, { rows: vehicles = [] } = {}) => {
         console.error(err);
         res.json({ vehicles });
      }
   );
}

module.exports = function(app) {
   app.get("/api/reference-data/vehicles", getVehicles);
   app.get("/api/reference-data/timestamps", getTimestamps);
};
