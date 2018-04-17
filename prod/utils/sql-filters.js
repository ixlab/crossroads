"use strict";

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require("../../db/utils.js");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _queryConfig = require("../../config/query-config.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pipeline = ["getDayOfWeekFilter", "getDepartureGeofencesFilter", "getArrivalGeofencesFilter", "getDateFilter", "getVinFilter", "getTripTimeFilter", "getTripDistanceFilter"];

/**
 * Utility class to store inputs and get template string literals that match up
 * with the stored inputs. Filter structure is...
 *	{
 *		geofences: {
 *			inbound: [],
 *			outbound: [],
 *		},
 *		dateRange: {
 *			start: moment,
 *			end: moment,
 *		},
 *		dayOfWeek: [int, ...],
 *		timeOfDay: {
 *			arrival: [moment, moment],
 *			departure: [moment, moment],
 *		},
 *		vins: [str, ...],
 *		tripDistance: [min(int), max(int)],
 *		tripDistance: [min(int), max(int)]
 *	}
 */

var SQLInputManager = function () {
   /**
    * Initializes offset, runs through the pipeline to construct the approate sql
    * clauses and input array to match
    */
   function SQLInputManager() {
      var _this = this;

      var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      _classCallCheck(this, SQLInputManager);

      this.currentTag = offset + 1;
      this.inputs = [];
      this.clauses = [];

      pipeline.forEach(function (fname) {
         _this[fname](filters);
      });
   }

   /**
    * Getter method for a sql template string combining all where clauses
    */


   _createClass(SQLInputManager, [{
      key: "getTag",


      /**
       * Adds the val to the this.inputs array, and returns the next sequential $ tag
       * @param val - a simple variable to be templated into a sql filter
       */
      value: function getTag(val) {
         this.currentTag += 1;
         this.inputs.push(val);
         return "$" + (this.currentTag - 1);
      }

      /**
       * Adds the vals to the this.inputs array, and returns a pg formatted array of $ tags
       * @param vals - a list of simple variables to be templated into a sql filter
       */

   }, {
      key: "getTags",
      value: function getTags(vals) {
         var tags = [];
         if (!vals) {
            return;
         }
         for (var i = 0; i < vals.length; i++) {
            tags.push(this.getTag(vals[i]));
         }
         return "(" + tags.join(", ") + ")";
      }

      /**
       * Adds a templated sql where clause to the this.clauses
       * @param clause - templated sql string
       */

   }, {
      key: "addClause",
      value: function addClause(clause) {
         if (!clause) {
            return;
         }
         this.clauses.push(clause);
      }

      /**
       * Constructs a template string to filter by day of the week
       * @param dayOfWeek - a string representation of the desired day(s)
       */

   }, {
      key: "getDayOfWeekFilter",
      value: function getDayOfWeekFilter(_ref) {
         var dayOfWeek = _ref.dayOfWeek;

         // days of the week are expressed a an int in SQL, Sunday(0)-Saturday(6)
         if (typeof dayOfWeek == "undefined" || dayOfWeek[0] == undefined) {
            return;
         } else {
            // using column of pre-extracted dow instead of extracting on the fly
            // this.addClause(`EXTRACT(DOW FROM departure_local_time) IN ${this.getTags(dayOfWeek)}`);
            this.addClause("dow IN " + this.getTags(dayOfWeek));
         }
      }

      /**
       * Constructs a template string to filter by geofencing where the car departed from
       * @param departureGeofences - list of list of lat/lng objects, represeting bounding polygons
       *							   for possible locations to depart from
       */

   }, {
      key: "getDepartureGeofencesFilter",
      value: function getDepartureGeofencesFilter(_ref2) {
         var _ref2$geofences = _ref2.geofences;
         _ref2$geofences = _ref2$geofences === undefined ? {} : _ref2$geofences;
         var departureGeofences = _ref2$geofences.departedFrom,
             arrivalGeofences = _ref2$geofences.arrivedAt;

         if (typeof departureGeofences == "undefined" || departureGeofences.length === 0) {
            return;
         }
         var geofenceOrQueries = [];
         for (var i = 0; i < departureGeofences.length; i++) {
            geofenceOrQueries.push("ST_CONTAINS(ST_GEOMFROMTEXT(" + this.getTag((0, _utils.getPostGISPolygon)(departureGeofences[i])) + "), departure_coordinates)");
         }
         this.addClause("(" + geofenceOrQueries.join(" OR ") + ")");
      }

      /**
       * Constructs a template string to filter by geofencing where the car arrived at
       * @param arrivalGeofences - list of list of lat/lng objects, represeting bounding polygons
       *							 for possible locations to arrive
       */

   }, {
      key: "getArrivalGeofencesFilter",
      value: function getArrivalGeofencesFilter(_ref3) {
         var _ref3$geofences = _ref3.geofences;
         _ref3$geofences = _ref3$geofences === undefined ? {} : _ref3$geofences;
         var arrivalGeofences = _ref3$geofences.arrivedAt;

         if (typeof arrivalGeofences == "undefined" || arrivalGeofences.length === 0) {
            return;
         }
         var geofenceOrQueries = [];
         for (var i = 0; i < arrivalGeofences.length; i++) {
            geofenceOrQueries.push("ST_CONTAINS(ST_GEOMFROMTEXT(" + this.getTag((0, _utils.getPostGISPolygon)(arrivalGeofences[i])) + "), arrival_coordinates)");
         }
         this.addClause("(" + geofenceOrQueries.join(" OR ") + ")");
      }

      /**
       * Constructs a template string to filter by a departure date
       * @param dateRange - two moment object array [lowerBound, upperBound]
       */

   }, {
      key: "getDateFilter",
      value: function getDateFilter(_ref4) {
         var _ref4$dateRange = _ref4.dateRange;
         _ref4$dateRange = _ref4$dateRange === undefined ? {} : _ref4$dateRange;
         var start = _ref4$dateRange.start,
             end = _ref4$dateRange.end;

         start = (0, _moment2.default)(start), end = (0, _moment2.default)(end);
         if (start.isValid()) {
            this.addClause("arrived_at > " + this.getTag(start.unix()));
         } else {
            this.addClause("arrived_at > 1262304000"); // 2010
         }
         if (end.isValid()) {
            this.addClause("arrived_at < " + this.getTag(end.unix()));
         } else {
            this.addClause("arrived_at < 1577836800"); // 2020
         }
      }

      /**
       * Constructs a template string to filter by select vins
       * @param vins - list of string vins
       */

   }, {
      key: "getVinFilter",
      value: function getVinFilter(_ref5) {
         var vins = _ref5.vins;

         if (typeof vins == "undefined" || vins.length == 0) {
            return;
         }
         this.addClause("vin IN " + this.getTags(vins));
      }

      /**
       * Constructs a template string to filter by trip distance
       * @param tripDistance - two item array with min and max valus for trip distance in meters
       */

   }, {
      key: "getTripDistanceFilter",
      value: function getTripDistanceFilter(_ref6) {
         var _ref6$tripDistance = _ref6.tripDistance;
         _ref6$tripDistance = _ref6$tripDistance === undefined ? [] : _ref6$tripDistance;

         var _ref6$tripDistance2 = _slicedToArray(_ref6$tripDistance, 2),
             min = _ref6$tripDistance2[0],
             max = _ref6$tripDistance2[1];

         if (parseInt(min) != NaN && parseInt(max) != NaN) {
            if (min > 0) {
               this.addClause("trip_distance_km >= " + this.getTag(min));
            }
            if (max < _queryConfig.tripInformationSliderConfig.maxDistance) {
               this.addClause("trip_distance_km <= " + this.getTag(max));
            }
         }
      }

      /**
       * Constructs a template string to filter by trip time
       * @param tripDistance - two item array with min and max valus for trip time in minutes
       */

   }, {
      key: "getTripTimeFilter",
      value: function getTripTimeFilter(_ref7) {
         var _ref7$tripTime = _ref7.tripTime;
         _ref7$tripTime = _ref7$tripTime === undefined ? [] : _ref7$tripTime;

         var _ref7$tripTime2 = _slicedToArray(_ref7$tripTime, 2),
             min = _ref7$tripTime2[0],
             max = _ref7$tripTime2[1];

         if (parseInt(min) != NaN && parseInt(max) != NaN) {
            if (min > 0) {
               this.addClause("trip_time >=  " + this.getTag(min));
            }
            if (max < _queryConfig.tripInformationSliderConfig.maxTime) {
               this.addClause("trip_time <= " + this.getTag(max));
            }
         }
      }
   }, {
      key: "whereClauses",
      get: function get() {
         return this.clauses.join(" AND ") || "true";
      }
   }]);

   return SQLInputManager;
}();

exports.default = SQLInputManager;


pipeline.forEach(function (fname) {
   (0, _assert2.default)(SQLInputManager.prototype[fname]);
});