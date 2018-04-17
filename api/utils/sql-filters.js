import { getPostGISPolygon } from "../../db/utils.js";
import moment from "moment";
import assert from "assert";
import { tripInformationSliderConfig } from "../../config/query-config.json";

const pipeline = [
   "getDayOfWeekFilter",
   "getDepartureGeofencesFilter",
   "getArrivalGeofencesFilter",
   "getDateFilter",
   "getVinFilter",
   "getTripTimeFilter",
   "getTripDistanceFilter"
];

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
export default class SQLInputManager {
   /**
    * Initializes offset, runs through the pipeline to construct the approate sql
    * clauses and input array to match
    */
   constructor(filters = {}, offset = 0) {
      this.currentTag = offset + 1;
      this.inputs = [];
      this.clauses = [];

      pipeline.forEach(fname => {
         this[fname](filters);
      });
   }

   /**
    * Getter method for a sql template string combining all where clauses
    */
   get whereClauses() {
      return this.clauses.join(" AND ") || "true";
   }

   /**
    * Adds the val to the this.inputs array, and returns the next sequential $ tag
    * @param val - a simple variable to be templated into a sql filter
    */
   getTag(val) {
      this.currentTag += 1;
      this.inputs.push(val);
      return `\$${this.currentTag - 1}`;
   }

   /**
    * Adds the vals to the this.inputs array, and returns a pg formatted array of $ tags
    * @param vals - a list of simple variables to be templated into a sql filter
    */
   getTags(vals) {
      var tags = [];
      if (!vals) {
         return;
      }
      for (let i = 0; i < vals.length; i++) {
         tags.push(this.getTag(vals[i]));
      }
      return `(${tags.join(", ")})`;
   }

   /**
    * Adds a templated sql where clause to the this.clauses
    * @param clause - templated sql string
    */
   addClause(clause) {
      if (!clause) {
         return;
      }
      this.clauses.push(clause);
   }

   /**
    * Constructs a template string to filter by day of the week
    * @param dayOfWeek - a string representation of the desired day(s)
    */
   getDayOfWeekFilter({ dayOfWeek }) {
      // days of the week are expressed a an int in SQL, Sunday(0)-Saturday(6)
      if (typeof dayOfWeek == "undefined" || dayOfWeek[0] == undefined) {
         return;
      } else {
         // using column of pre-extracted dow instead of extracting on the fly
         // this.addClause(`EXTRACT(DOW FROM departure_local_time) IN ${this.getTags(dayOfWeek)}`);
         this.addClause(`dow IN ${this.getTags(dayOfWeek)}`);
      }
   }

   /**
    * Constructs a template string to filter by geofencing where the car departed from
    * @param departureGeofences - list of list of lat/lng objects, represeting bounding polygons
    *							   for possible locations to depart from
    */
   getDepartureGeofencesFilter({
      geofences: {
         departedFrom: departureGeofences,
         arrivedAt: arrivalGeofences
      } = {}
   }) {
      if (
         typeof departureGeofences == "undefined" ||
         departureGeofences.length === 0
      ) {
         return;
      }
      var geofenceOrQueries = [];
      for (let i = 0; i < departureGeofences.length; i++) {
         geofenceOrQueries.push(
            `ST_CONTAINS(ST_GEOMFROMTEXT(${this.getTag(
               getPostGISPolygon(departureGeofences[i])
            )}), departure_coordinates)`
         );
      }
      this.addClause(`(${geofenceOrQueries.join(" OR ")})`);
   }

   /**
    * Constructs a template string to filter by geofencing where the car arrived at
    * @param arrivalGeofences - list of list of lat/lng objects, represeting bounding polygons
    *							 for possible locations to arrive
    */
   getArrivalGeofencesFilter({
      geofences: { arrivedAt: arrivalGeofences } = {}
   }) {
      if (
         typeof arrivalGeofences == "undefined" ||
         arrivalGeofences.length === 0
      ) {
         return;
      }
      var geofenceOrQueries = [];
      for (let i = 0; i < arrivalGeofences.length; i++) {
         geofenceOrQueries.push(
            `ST_CONTAINS(ST_GEOMFROMTEXT(${this.getTag(
               getPostGISPolygon(arrivalGeofences[i])
            )}), arrival_coordinates)`
         );
      }
      this.addClause(`(${geofenceOrQueries.join(" OR ")})`);
   }

   /**
    * Constructs a template string to filter by a departure date
    * @param dateRange - two moment object array [lowerBound, upperBound]
    */
   getDateFilter({ dateRange: { start, end } = {} }) {
      (start = moment(start)), (end = moment(end));
      if (start.isValid()) {
         this.addClause(`arrived_at > ${this.getTag(start.unix())}`);
      } else {
         this.addClause(`arrived_at > 1262304000`); // 2010
      }
      if (end.isValid()) {
         this.addClause(`arrived_at < ${this.getTag(end.unix())}`);
      } else {
         this.addClause(`arrived_at < 1577836800`); // 2020
      }
   }

   /**
    * Constructs a template string to filter by select vins
    * @param vins - list of string vins
    */
   getVinFilter({ vins }) {
      if (typeof vins == "undefined" || vins.length == 0) {
         return;
      }
      this.addClause(`vin IN ${this.getTags(vins)}`);
   }

   /**
    * Constructs a template string to filter by trip distance
    * @param tripDistance - two item array with min and max valus for trip distance in meters
    */
   getTripDistanceFilter({ tripDistance: [min, max] = [] }) {
      if (parseInt(min) != NaN && parseInt(max) != NaN) {
         if (min > 0) {
            this.addClause(`trip_distance_km >= ${this.getTag(min)}`);
         }
         if (max < tripInformationSliderConfig.maxDistance) {
            this.addClause(`trip_distance_km <= ${this.getTag(max)}`);
         }
      }
   }

   /**
    * Constructs a template string to filter by trip time
    * @param tripDistance - two item array with min and max valus for trip time in minutes
    */
   getTripTimeFilter({ tripTime: [min, max] = [] }) {
      if (parseInt(min) != NaN && parseInt(max) != NaN) {
         if (min > 0) {
            this.addClause(`trip_time >=  ${this.getTag(min)}`);
         }
         if (max < tripInformationSliderConfig.maxTime) {
            this.addClause(`trip_time <= ${this.getTag(max)}`);
         }
      }
   }
}

pipeline.forEach(function(fname) {
   assert(SQLInputManager.prototype[fname]);
});
