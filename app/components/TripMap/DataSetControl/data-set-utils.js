// custom modules
import { sqlUtils } from "utils";

const { COLUMN_INDEX } = sqlUtils.tableInfo;

/*
	NOTE: will it actually matter if the value is time variants or not?
	adding a where clause for time to a query that isnt time variant will
	end up just returning the same value. Will be slower, but can worry
	about that later.

	SOLUTION TO ABOVE: just optionally add a where clause to all local
	queries if there's a time and time unit provided. If a timestamp is
	provided and the data isn't time variant, it it'll be the same even
	with the where clause. Can optimize this from the UI perspective later

	NOTE: Can this be represented as a single SQL query instead of firing
	off a request for each table in `contraints.dataSets` (see redux)
*/

/**
 * Generates overlay data for the table provided
 * @param  {string} tableName - the name of the table
 * @return {object} the data needed to create an overlay for the table
 *
 * Example return object:
 * ----------------------
 * overlayData = {
 * 		time: {
 * 			timeColumn: 'timestamp',
 * 			timeUnits: 's'
 * 		},
 * 		points: {
 * 			latitudeColumn: 'lat',
 * 			longitudeColumn: 'lng'
 * 		}
 * }
 */
export function overlayDataForTable(tableName) {
   const { values } = sqlUtils.tableInfo.info(tableName);
   const overlayData = {};

   if (
      values[COLUMN_INDEX.TIME] &&
      values[COLUMN_INDEX.TIME_UNITS] &&
      values[COLUMN_INDEX.OTHER_COLUMNS]
   ) {
      overlayData.time = {
         timeColumn: values[COLUMN_INDEX.TIME],
         timeUnits: values[COLUMN_INDEX.TIME_UNITS],
         // `other_columns` are not attributed to anything in particular,
         // so they are assumed to be time-variant and will be displayed
         // using the `DataTextOverlay` component
         otherColumns: values[COLUMN_INDEX.OTHER_COLUMNS]
            ? values[COLUMN_INDEX.OTHER_COLUMNS].split(",")
            : []
      };
   }

   if (values[COLUMN_INDEX.LAT] && values[COLUMN_INDEX.LNG]) {
      overlayData.points = {
         latitudeColumn: values[COLUMN_INDEX.LAT],
         longitudeColumn: values[COLUMN_INDEX.LNG],
         timeColumn: values[COLUMN_INDEX.TIME], // may not exist
         timeUnits: values[COLUMN_INDEX.TIME_UNITS] // may note exist
      };
   }

   if (values[COLUMN_INDEX.POLYLINE]) {
      overlayData.polylines = {
         polylineColumn: values[COLUMN_INDEX.POLYLINE]
      };
   }

   if (values[COLUMN_INDEX.POLYGON]) {
      overlayData.polygons = {
         polygonColumn: values[COLUMN_INDEX.POLYGON]
      };
   }

   return overlayData;
}
