// custom modules
import { CONSTRAINTS } from "../constants";
import { sqlUtils } from "utils";

// actions that necessitate a query being executed
const flaggedActions = [...Object.values(CONSTRAINTS.DATA_SET)];

function fireQueries(constraints) {
   const { dataSets: tableNames } = constraints;
   tableNames.forEach(tableName => {
      // FIXME: the data in the local sql cannot change from the
      // map, don't need to query every time
      const {
         values: [
            ,
            ,
            /* skip first 2 columns (id, table_name) */
            polyline,
            polygon,
            time,
            timeUnits,
            lat,
            lng
         ],
         columns
      } = sqlUtils.table.info(tableName);

      /*
			NOTE: for now, will not attempt to vary polygons
			or polylines over time. Assume they are static,
			to be drawn once. Because of this, these queries
			only need to be fired once, and not continuosly
			from the middleware. Checking for polylines/polygons
			should probably just be checked from the `DataSetControl`,
			but will somehow need to reconcile this with redux,
			since it won't be able to tell which data sets vary over
			time without firing local a query every time
	 */

      // static
      if (polyline) {
         // draw polylines
      }
      if (polygon) {
         // draw polygons
      }

      // time varying
      if (time && timeUnits) {
         // data varies over time
         if (lat && lng) {
            // heatmap
         } else {
            // display columns of `tableName`
         }
      }
   });
}

// middleware function
export default store => next => action => {
   const result = next(action);
   if (flaggedActions.indexOf(action.type) !== -1) {
      const { constraints } = store.getState();
      // fireQueries(constraints);
   }
   return result;
};
