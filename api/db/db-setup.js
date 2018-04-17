// external modules
import { Pool } from "pg";

// config
import dbConfig from "../../config/db-config.json";

// create pool
const pool = new Pool(dbConfig);

// watch for errors
pool.on("error", (err, client) => {
   console.error("idle client error", err.message, err.stack);
});

// module methods
/**
 * Executes a sql query by injecting values as specified
 * @param {string} text - sql query to be executed
 * @param {array} values - values to be injected into the sql query
 * @param {function} callback - callback to be executed on completion of the query
 */
function query(text, values, callback) {
   return pool.query(text, values, callback);
}

/**
 * Connect to the database
 * @param {function} callback - callback to be executed on connection success/failure
 */
function connect(callback) {
   return pool.connect(callback);
}

module.exports = {
   query: query,
   connect: connect
};
