"use strict";

var _pg = require("pg");

var _dbConfig = require("../../config/db-config.json");

var _dbConfig2 = _interopRequireDefault(_dbConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create pool
// external modules
var pool = new _pg.Pool(_dbConfig2.default);

// watch for errors


// config
pool.on("error", function (err, client) {
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