// external modules
import axios from "axios";
import moment from "moment";

// custom modules
import { toSnakeCase } from "./general-utils";
import { TM_UNITS } from "utils/constants";

// doesn't include `id`, `table_name`, or `other_columns`
const COLUMNS = [
   "polyline_column",
   "polygon_column",
   "time_column",
   "time_units",
   "latitude_column",
   "longitude_column"
];

// doesn't include `id`, `table_name`, or `other_columns`
const COLUMN_INDEX = {
   POLYLINE: 2,
   POLYGON: 3,
   TIME: 4,
   TIME_UNITS: 5,
   LAT: 6,
   LNG: 7,
   OTHER_COLUMNS: 8
};

/**
 * Get the names of the locally loaded sql tables
 * @return {array} the names of the tables
 */
function getTableNames() {
   const res = window.db.exec(`
		SELECT name
			FROM sqlite_master
			WHERE type = 'table' AND
			      name != 'table_info'
		UNION ALL
		SELECT name
			FROM sqlite_temp_master
			WHERE type='table' AND
			      name != 'table_info';
	`);

   if (res.length) {
      const [{ values = [] }] = res;
      return values.map(([value]) => value);
   } else {
      return [];
   }
}

/**
 * Gets information for a given table.
 * @param  {string} tableName - the name of the table to retrieve info for
 * @return {array} the info for a given table
 */
function getInfoForTable(tableName) {
   const [{ columns = {}, values: [values] = [] } = {}] = window.db.exec(`
		SELECT *
			FROM table_info
			WHERE table_name = '${tableName}';
	`);

   return { columns, values };
}

/**
 * Gets the validity of all tables.
 * @return {object} the results of the query
 */
function getValidityOfAllTables() {
   const [res] = window.db.exec(`
		SELECT table_name,
		       (time_column IS NOT NULL AND time_units IS NOT NULL) OR
		 	     (polyline_column IS NOT NULL) OR
			     (polygon_column IS NOT NULL)
			FROM table_info;
	`);

   return res;
}

/**
 * Checks the validity of a particular table.
 * @param  {string} tableName - the name of the table to check the validity of.
 * @return {boolean} represents the validity of the table.
 */
function getValidityOfTable(tableName) {
   const [{ values: [[valid]] }] = window.db.exec(`
		SELECT (time_column IS NOT NULL AND time_units IS NOT NULL) OR
		 	     (polyline_column IS NOT NULL) OR
			     (polygon_column IS NOT NULL) valid
			FROM table_info
			WHERE table_name = '${tableName}';
	`);

   return !!valid;
}

/**
 * Initializes the local database.
 * @return {promise} resolves when the db has finished initializing
 */
function initializeDB() {
   const promise = new Promise((resolve, reject) => {
      window.db = new SQL.Database();
      createTableInfoTable()
         .then(res => {
            resolve(res);
         })
         .catch(err => {
            reject(err);
         });
   });

   return promise;
}

/**
 * Creates the `table_info` table in the local database
 * @return {promise} a boolean representing whether the table was created successfully
 */
function createTableInfoTable() {
   const promise = new Promise((resolve, reject) => {
      const [res] = window.db.exec(`
			CREATE TABLE IF NOT EXISTS table_info (
				id INTEGER PRIMARY KEY,
				table_name VARCHAR UNIQUE NOT NULL,
				polyline_column VARCHAR,
				polygon_column VARCHAR,
				time_column VARCHAR,
				time_units VARCHAR,
				latitude_column VARCHAR,
				longitude_column VARCHAR,
				-- SQLITE does not support array fields, so this is a comma separated string
				other_columns VARCHAR
			);
		`);
      resolve(true);
   });

   return promise;
}

/**
 * Inserts a new row into the `table_info` table
 * @param  {object} info - contains column names as keys and their values as values
 * @param {array} allCols - all the columns for the given data set
 * @return {promise} resolves into the result of the insert
 */
function insertTableInfo(info, allCols) {
   const promise = new Promise((resolve, reject) => {
      const cols = Object.keys(info).map(col => toSnakeCase(col));
      let vals = Object.values(info);
      const leftovers = allCols
         .filter(col => vals.indexOf(col) === -1)
         .join(",");
      vals = vals.map(val => `'${val}'`);

      if (leftovers) {
         cols.push("other_columns");
         vals.push(`'${leftovers}'`);
      }

      createTableInfoTable()
         .then(_ => {
            const [res] = window.db.exec(`
					INSERT INTO table_info (
						${cols.join(",")}
					) VALUES (
						${vals.join(",")}
					);
				`);
            resolve(res);
         })
         .catch(err => {
            reject(err);
         });
   });

   return promise;
}

/**
 * Updates a column value for a specific table in table_info.
 * @param  {string} tableName - the table to update
 * @param  {string} column - the column to update
 * @param  {string} value - the new value of the column
 * @return {object} the result of the query
 */
function updateTableInfo(tableName, column, value) {
   console.log(`
		UPDATE table_info
			SET ${column} = ${value ? `'${value}'` : "NULL"}
			WHERE table_name = '${tableName}';
	`);
   const [res] = window.db.exec(`
		UPDATE table_info
			SET ${column} = ${value ? `'${value}'` : "NULL"}
			WHERE table_name = '${tableName}';
	`);

   return res;
}

/**
 * Makes a request to update the remote copy of the database.
 * @return {promise} the request's promise
 */
function updateRemote() {
   // NOTE: this is horribly inefficient workaround
   return axios.post("/api/data-upload/upload-sqlite", {
      // TODO: update this based on the user
      filename: "sql.db",
      data: window.db.export()
   });
}

/**
 * Drops a data set table and updates table_info accordingly.
 * @param  {string} tableName -
 * @return {promise} resolves once the operations have completed
 */
function dropTable(tableName) {
   const promise = new Promise((resolve, reject) => {
      window.db.run(`DROP TABLE ${tableName}`);
      window.db.run(`
			DELETE FROM table_info
				WHERE table_name = '${tableName}'
		`);
      resolve(true);
   });

   return promise;
}

/**
 * Guesses the datatype of a given value prior to uploading to the db
 * @param  {any} raw - any raw value
 * @return {any}     the processed value cast to the guessed datatype
 */
function guessDataType(raw) {
   switch (typeof raw) {
      case "number":
         return raw;
      case "string":
         const val = parseFloat(raw);
         if (val && val !== Infinity) return val;
         else return `'${raw}'`;
      case "object":
      default:
         return `'${JSON.stringify(raw)}'`;
   }
}

module.exports = {
   // NOTE: `getTableNames`. Use `tableInfo.all.names` instead
   guessDataType,
   getTableNames,
   initializeDB,
   tableInfo: {
      all: {
         names: getTableNames,
         validity: getValidityOfAllTables
      },
      create: createTableInfoTable,
      insert: insertTableInfo,
      update: updateTableInfo,
      validity: getValidityOfTable,
      info: getInfoForTable,
      drop: dropTable,
      updateRemote,
      COLUMNS,
      COLUMN_INDEX
   }
};
