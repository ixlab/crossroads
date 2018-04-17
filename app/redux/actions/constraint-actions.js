// custom modules
import { CONSTRAINTS } from "../constants";

// ----------------------------------------------
// -------------- BASIC ACTIONS -----------------
// ----------------------------------------------
// requery for data
function refreshData() {
   return {
      type: CONSTRAINTS.REFRESH_DATA,
      payload: true
   };
}

// ----------------------------------------------
// ------------ GEOFENCE ACTIONS ----------------
// ----------------------------------------------
// clear all the geofences (inbound and outbound)
function clearAllGeofences() {
   return {
      type: CONSTRAINTS.GEOFENCES.CLEAR_ALL,
      payload: true
   };
}

/**
 * Updates all the geofences (inbound and outbound)
 * @param  {array} inbound  - the inbound geofences
 * @param  {array} outbound - the outbound geofences
 * @return {object}         a redux action
 */
function updateAllGeofences(inbound, outbound) {
   return {
      type: CONSTRAINTS.GEOFENCES.UPDATE_ALL,
      payload: { inbound, outbound }
   };
}

/**
 * Update the inbound geofences with new values.
 * @param {array} fences - the new inbound geofences
 */
function updateInboundGeofences(fences) {
   return {
      type: CONSTRAINTS.GEOFENCES.INBOUND.UPDATE,
      payload: fences
   };
}

// clear the inbound geofences
function clearInboundGeofences() {
   return {
      type: CONSTRAINTS.GEOFENCES.INBOUND.CLEAR,
      payload: true
   };
}

/**
 * Update the outbound geofences with new values.
 * @param {array} fences - the new outbound geofences
 */
function updateOutboundGeofences(fences) {
   return {
      type: CONSTRAINTS.GEOFENCES.OUTBOUND.UPDATE,
      payload: fences
   };
}

// clear the outbound geofences
function clearOutboundGeofences() {
   return {
      type: CONSTRAINTS.GEOFENCES.OUTBOUND.CLEAR,
      payload: true
   };
}

// ----------------------------------------------
// ----------- DATE RANGE ACTIONS ---------------
// ----------------------------------------------
// clear the current date range
function clearAllDateRange() {
   return {
      type: CONSTRAINTS.DATE_RANGE.CLEAR_ALL,
      payload: true
   };
}

// clear the start of the current date range
function clearDateRangeStart() {
   return {
      type: CONSTRAINTS.DATE_RANGE.START.CLEAR,
      payload: true
   };
}

/**
 * Update the start of the date range.
 * @param {moment} startDate - the end start date.
 */
function updateDateRangeStart(startDate) {
   return {
      type: CONSTRAINTS.DATE_RANGE.START.UPDATE,
      payload: startDate
   };
}

// clear the end of the date range
function clearDateRangeEnd() {
   return {
      type: CONSTRAINTS.DATE_RANGE.END.CLEAR,
      payload: true
   };
}

/**
 * Update the end of the date range.
 * @param {moment} endDate - the new end date.
 */
function updateDateRangeEnd(endDate) {
   return {
      type: CONSTRAINTS.DATE_RANGE.END.UPDATE,
      payload: endDate
   };
}

// ----------------------------------------------
// ----------- DAY OF WEEK ACTIONS --------------
// ----------------------------------------------
// Clears the selected days of the week.
function clearDayOfWeek() {
   return {
      type: CONSTRAINTS.DAY_OF_WEEK.CLEAR,
      payload: true
   };
}

/**
 * Updates the selected days of the week.
 * @param {array} days - the new selected days of the week
 */
function updateDayOfWeek(days) {
   return {
      type: CONSTRAINTS.DAY_OF_WEEK.UPDATE,
      payload: days
   };
}

/**
 * Add a day to the selected days of the week.
 * @param {number} day - the day to add
 */
function addDayOfWeek(day) {
   return {
      type: CONSTRAINTS.DAY_OF_WEEK.ADD,
      payload: day
   };
}

/**
 * Remove a day from the selected days of the week.
 * @param {number} day - the day to remove
 */
function removeDayOfWeek(day) {
   return {
      type: CONSTRAINTS.DAY_OF_WEEK.REMOVE,
      payload: day
   };
}

/**
 * Toggle a given day, removing it if it exists in `state.daysOfWeek`
 * and adding it if it does not.
 * @param {number} day - the day to toggle
 */
function toggleDayOfWeek(day) {
   return {
      type: CONSTRAINTS.DAY_OF_WEEK.TOGGLE,
      payload: day
   };
}

// ----------------------------------------------
// ----------- TIME OF DAY ACTIONS --------------
// ----------------------------------------------
// clear the time of day range
function clearDepartureTimeOfDay() {
   return {
      type: CONSTRAINTS.TIME_OF_DAY.DEPARTURE.CLEAR,
      payload: true
   };
}

/**
 * Update the time of day to a new range.
 * @param {array} range - the new range for time of day
 */
function updateDepartureTimeOfDay(range) {
   return {
      type: CONSTRAINTS.TIME_OF_DAY.DEPARTURE.UPDATE,
      payload: range
   };
}

// clear the time of day range
function clearArrivalTimeOfDay() {
   return {
      type: CONSTRAINTS.TIME_OF_DAY.ARRIVAL.CLEAR,
      payload: true
   };
}

/**
 * Update the time of day to a new range.
 * @param {array} range - the new range for time of day
 */
function updateArrivalTimeOfDay(range) {
   return {
      type: CONSTRAINTS.TIME_OF_DAY.ARRIVAL.UPDATE,
      payload: range
   };
}

// ----------------------------------------------
// ----------- TRIP INFORMATION ACTIONS ---------
// ----------------------------------------------
// clear the trip time range
function clearTripTime() {
   return {
      type: CONSTRAINTS.TRIP_TIME.CLEAR,
      payload: true
   };
}

/**
 * Update the trip time to a new range.
 * @param {array} range - the new range for trip time
 */
function updateTripTime(range) {
   return {
      type: CONSTRAINTS.TRIP_TIME.UPDATE,
      payload: range
   };
}

// clear the trip distance range
function clearTripDistance() {
   return {
      type: CONSTRAINTS.TRIP_DISTANCE.CLEAR,
      payload: true
   };
}

/**
 * Update the trip distance to a new range.
 * @param {array} range - the new range for trip distance
 */
function updateTripDistance(range) {
   return {
      type: CONSTRAINTS.TRIP_DISTANCE.UPDATE,
      payload: range
   };
}

// ----------------------------------------------
// ----------- VIN ACTIONS ----------------------
// ----------------------------------------------
/**
 * Update vehicle selection.
 * @param {array} vehicles - the new vehicle selection
 */
function updateVehicles(vehicles) {
   return {
      type: CONSTRAINTS.VEHICLES.UPDATE,
      payload: vehicles
   };
}

// clear the vehicle selection
function clearVehicles() {
   return {
      type: CONSTRAINTS.VEHICLES.CLEAR,
      payload: true
   };
}

// ----------------------------------------------
// ------------ DATA SET ACTIONS ----------------
// ----------------------------------------------
/**
 * Toggle a specific data set overlay.
 * @param  {string} tableName - the name of the table of the data set
 */
function toggleDataSet(tableName) {
   return {
      type: CONSTRAINTS.DATA_SET.TOGGLE,
      payload: tableName
   };
}

// ----------------------------------------------
// ------------ SNAPSHOT ACTIONS ----------------
// ----------------------------------------------
function updateSnapshotSlider(sliderVal) {
   return {
      type: CONSTRAINTS.SNAPSHOT.SLIDER.UPDATE,
      payload: sliderVal
   };
}

function updateSnapshotResolution(resolution) {
   return {
      type: CONSTRAINTS.SNAPSHOT.RESOLUTION.UPDATE,
      payload: resolution
   };
}

function toggleSnapshot() {
   return {
      type: CONSTRAINTS.SNAPSHOT.TOGGLE,
      payload: true
   };
}

module.exports = {
   refreshData,
   geofences: {
      all: {
         update: updateAllGeofences,
         clear: clearAllGeofences
      },
      inbound: {
         update: updateInboundGeofences,
         clear: clearInboundGeofences
      },
      outbound: {
         update: updateOutboundGeofences,
         clear: clearOutboundGeofences
      }
   },
   dateRange: {
      all: {
         clear: clearAllDateRange
      },
      start: {
         clear: clearDateRangeStart,
         update: updateDateRangeStart
      },
      end: {
         clear: clearDateRangeEnd,
         update: updateDateRangeEnd
      }
   },
   dayOfWeek: {
      clear: clearDayOfWeek,
      update: updateDayOfWeek,
      add: addDayOfWeek,
      remove: removeDayOfWeek,
      toggle: toggleDayOfWeek
   },
   timeOfDay: {
      arrival: {
         clear: clearArrivalTimeOfDay,
         update: updateArrivalTimeOfDay
      },
      departure: {
         clear: clearDepartureTimeOfDay,
         update: updateDepartureTimeOfDay
      }
   },
   tripTime: {
      update: updateTripTime,
      clear: clearTripTime
   },
   tripDistance: {
      update: updateTripDistance,
      clear: clearTripDistance
   },
   vehicles: {
      update: updateVehicles,
      clear: clearVehicles
   },
   dataSets: {
      toggle: toggleDataSet
   },
   snapshot: {
      toggle: toggleSnapshot,
      resolution: {
         update: updateSnapshotResolution
      },
      slider: {
         update: updateSnapshotSlider
      }
   }
};
