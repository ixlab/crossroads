// custom modules
import { CONSTRAINTS, ADVANCED_SETTINGS } from "../constants";
import { RESOLUTION } from "utils/constants";
import tripsData from "trips-data";

// actions that necessitate a query being executed
const flaggedActions = [
   // BASIC
   CONSTRAINTS.REFRESH_DATA,

   // GEOFENCES
   CONSTRAINTS.GEOFENCES.CLEAR_ALL,
   CONSTRAINTS.GEOFENCES.UPDATE_ALL,
   ...Object.values(CONSTRAINTS.GEOFENCES.INBOUND),
   ...Object.values(CONSTRAINTS.GEOFENCES.OUTBOUND),

   // DATE RANGE
   CONSTRAINTS.DATE_RANGE.CLEAR_ALL,
   CONSTRAINTS.DATE_RANGE.START.CLEAR,
   CONSTRAINTS.DATE_RANGE.END.CLEAR,

   // ADVANCED SETTINGS
   CONSTRAINTS.ADVANCED_SETTINGS.SAMPLING_RATE.UPDATE.HARD
];

// middleware function
export default store => next => action => {
   const result = next(action);

   if (flaggedActions.indexOf(action.type) !== -1) {
      const {
         constraints: { geofences, dateRange, vins, advancedSettings }
      } = store.getState();

      console.info("emit:", new Date());
      tripsData.latencyManager.arrival.start();
      tripsData.latencyManager.departure.start();
      window.socket.emit("data changed", {
         geofences,
         dateRange,
         vins,
         advancedSettings
      });
   }

   return result;
};
