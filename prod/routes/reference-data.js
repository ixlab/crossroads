"use strict";

var _dbSetup = require("../db/db-setup");

var _dbSetup2 = _interopRequireDefault(_dbSetup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets all the unique timestamps for which a heatmap
 * can be generated
 * @param {request} req - request object
 * @param {response} res - response object
 */
function getTimestamps(req, res) {
   _dbSetup2.default.query("\n\t\tSELECT DISTINCT arrived_at tm\n\t\t\tFROM trips\n\t\tORDER BY tm ASC\n\t", [], function (err) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$rows = _ref.rows,
          timestamps = _ref$rows === undefined ? [] : _ref$rows;

      console.error(err);
      res.json({ timestamps: timestamps });
   });
}

/**
 * Gets all the unique vehicle ids
 * @param {request} req - request object
 * @param {response} res - response object
 */
function getVehicles(req, res) {
   _dbSetup2.default.query("\n\t\tSELECT DISTINCT vin\n\t\t\tFROM trips\n\t", [], function (err) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$rows = _ref2.rows,
          vehicles = _ref2$rows === undefined ? [] : _ref2$rows;

      console.error(err);
      res.json({ vehicles: vehicles });
   });
}

module.exports = function (app) {
   app.get("/api/reference-data/vehicles", getVehicles);
   app.get("/api/reference-data/timestamps", getTimestamps);
};