const pg = require("pg");
const Pool = pg.Pool;

const config = require("../config/db-config.json");
const pool = new Pool(config);

pool.on("error", function(err, client) {
   console.error("idle client error", err.message, err.stack);
});

module.exports = pool;
