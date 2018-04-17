// external modules
import moment from "moment";

// custom modules
import { formatTimeRestrictions, formatTimeOfDay } from "utils";
import { CONSTRAINTS } from "../constants";
import { RESOLUTION } from "utils/constants";
import tripsData from "trips-data";
import { tripInformationSliderConfig as sliderConfig } from "../../../config/query-config.json";

const INITIAL_STATE = {
   geofences: {
      arrivedAt: [],
      departedFrom: []
   },
   dateRange: {
      start: moment("2015-12-31", moment.ISO_8601),
      end: moment("2016-06-30", moment.ISO_8601)
   },
   dayOfWeek: [],
   timeOfDay: {
      arrival: [0, 24],
      departure: [0, 24]
   },
   vins: [],
   dataSets: [],
   snapshot: {
      active: false,
      resolution: RESOLUTION.DAY,
      slider: 0
   },
   tripTime: [0, sliderConfig.maxTime],
   tripDistance: [0, sliderConfig.maxDistance],
   advancedSettings: {
      samplingRate: 50
   }
};

function updateDateFilter(dateRange, trim = false) {
   let predicate;

   if (moment(dateRange.start).isValid() && moment(dateRange.end).isValid()) {
      const start = dateRange.start.unix();
      const end = dateRange.end.unix();
      predicate = date => start < date && date < end;
   } else if (moment(dateRange.start).isValid()) {
      const start = dateRange.start.unix();
      predicate = date => start < date;
   } else if (moment(dateRange.end).isValid()) {
      const end = dateRange.end.unix();
      predicate = date => date < end;
   } else {
      predicate = date => true;
   }

   tripsData.addFilter(tripsData.dimensions.date, predicate);

   if (trim) tripsData.trimData();
}

function handleDateRangeChange(state, dateRange, action, side) {
   const requery = () => {
      const timeOfDay = formatTimeOfDay(state.timeOfDay);
      const timeRestrictions = formatTimeRestrictions(
         state.dateRange,
         state.snapshot
      );
      window.socket.emit("data changed", {
         ...state,
         ...timeRestrictions,
         timeOfDay
      });
   };

   if (
      side === "start" &&
      moment(state.dateRange[side]).isValid() &&
      moment(action.payload).isValid() &&
      moment(action.payload).isBefore(state.dateRange[side])
   ) {
      // needs requery
      requery();
   } else if (
      side === "end" &&
      moment(state.dateRange[side]).isValid() &&
      moment(action.payload).isValid() &&
      moment(action.payload).isAfter(state.dateRange[side])
   ) {
      // needs requery
      requery();
   } else {
      // doesn't need requery
      updateDateFilter(dateRange, true);
   }
}

function handleTimeOfDayChange(timeOfDay) {
   const {
      arrival: [arrivalStart, arrivalEnd],
      departure: [departureStart, departureEnd]
   } = timeOfDay;

   tripsData.addFilter(
      tripsData.dimensions.arrivalTime,
      time => arrivalStart < time && time < arrivalEnd
   );
   tripsData.addFilter(
      tripsData.dimensions.departureTime,
      time => departureStart < time && time < departureEnd
   );
}

export default function(state = INITIAL_STATE, action) {
   switch (action.type) {
      // BASIC ACTIONS
      // ------------------------------------------------
      case CONSTRAINTS.REFRESH_DATA:
         return state;

      // GEOFENCE ACTIONS
      // ------------------------------------------------
      case CONSTRAINTS.GEOFENCES.UPDATE_ALL:
         return {
            ...state,
            geofences: {
               arrivedAt: action.payload.inbound,
               departedFrom: action.payload.outbound
            }
         };

      case CONSTRAINTS.GEOFENCES.CLEAR_ALL:
         return { ...state, geofences: INITIAL_STATE.geofences };

      case CONSTRAINTS.GEOFENCES.INBOUND.CLEAR:
         return {
            ...state,
            geofences: {
               ...state.geofences,
               arrivedAt: INITIAL_STATE.geofences.arrivedAt
            }
         };

      case CONSTRAINTS.GEOFENCES.INBOUND.UPDATE:
         return {
            ...state,
            geofences: { ...state.geofences, arrivedAt: action.payload }
         };

      case CONSTRAINTS.GEOFENCES.OUTBOUND.CLEAR:
         return {
            ...state,
            geofences: {
               ...state.geofences,
               departedFrom: INITIAL_STATE.geofences.departedFrom
            }
         };

      case CONSTRAINTS.GEOFENCES.OUTBOUND.UPDATE:
         return {
            ...state,
            geofences: { ...state.geofences, departedFrom: action.payload }
         };

      // DATE_RANGE ACTIONS)
      // ------------------------------------------------
      case CONSTRAINTS.DATE_RANGE.CLEAR_ALL:
         console.log("clearing date range:", {
            ...state,
            dateRange: { ...INITIAL_STATE.dateRange }
         });
         return { ...state, dateRange: { ...INITIAL_STATE.dateRange } };

      case CONSTRAINTS.DATE_RANGE.START.CLEAR:
         var dateRange = {
            ...state.dateRange,
            start: INITIAL_STATE.dateRange.start
         };
         return { ...state, dateRange };

      case CONSTRAINTS.DATE_RANGE.START.UPDATE:
         var dateRange = { ...state.dateRange, start: action.payload };
         handleDateRangeChange(state, dateRange, action, "start");
         return { ...state, dateRange };

      case CONSTRAINTS.DATE_RANGE.END.CLEAR:
         return { ...state, dateRange: { ...INITIAL_STATE.dateRange } };

      case CONSTRAINTS.DATE_RANGE.END.UPDATE:
         var dateRange = { ...state.dateRange, end: action.payload };
         handleDateRangeChange(state, dateRange, action, "end");
         return { ...state, dateRange };

      // DAY_OF_WEEK ACTIONS
      // ------------------------------------------------
      case CONSTRAINTS.DAY_OF_WEEK.CLEAR:
         tripsData.clearFilter(tripsData.dimensions.dow);
         return { ...state, dayOfWeek: INITIAL_STATE.dayOfWeek };

      case CONSTRAINTS.DAY_OF_WEEK.UPDATE:
         tripsData.addFilter(
            tripsData.dimensions.dow,
            dow => action.payload.indexOf(dow) !== -1
         );
         return { ...state, dayOfWeek: action.payload };

      case CONSTRAINTS.DAY_OF_WEEK.ADD:
         if (state.dayOfWeek.indexOf(action.payload) === -1) {
            var dayOfWeek = [...state.dayOfWeek, action.payload];
            tripsData.addFilter(
               tripsData.dimensions.dow,
               dow => dayOfWeek.indexOf(dow) !== -1
            );
            return { ...state, dayOfWeek };
         } else return state;

      case CONSTRAINTS.DAY_OF_WEEK.TOGGLE:
         var dayOfWeek;
         if (state.dayOfWeek.indexOf(action.payload) === -1)
            dayOfWeek = [...state.dayOfWeek, action.payload];
         else dayOfWeek = state.dayOfWeek.filter(day => day !== action.payload);
         tripsData.addFilter(
            tripsData.dimensions.dow,
            dow => dayOfWeek.indexOf(dow) !== -1
         );
         return { ...state, dayOfWeek };

      case CONSTRAINTS.DAY_OF_WEEK.REMOVE:
         var dayOfWeek = state.dayOfWeek.filter(day => day !== action.payload);
         tripsData.addFilter(
            tripsData.dimensions.dow,
            dow => dayOfWeek.indexOf(dow) !== -1
         );
         return { ...state, dayOfWeek };

      // TIME_OF_DAY ACTIONS
      // ------------------------------------------------
      case CONSTRAINTS.TIME_OF_DAY.DEPARTURE.CLEAR:
         tripsData.clearFilter(tripsData.dimensions.time);
         return {
            ...state,
            timeOfDay: {
               ...state.timeOfDay,
               departure: INITIAL_STATE.timeOfDay.departure
            }
         };

      case CONSTRAINTS.TIME_OF_DAY.DEPARTURE.UPDATE:
         var timeOfDay = { ...state.timeOfDay, departure: action.payload };
         handleTimeOfDayChange(timeOfDay);
         return { ...state, timeOfDay };

      case CONSTRAINTS.TIME_OF_DAY.ARRIVAL.CLEAR:
         tripsData.clearFilter(tripsData.dimensions.time);
         return {
            ...state,
            timeOfDay: {
               ...state.timeOfDay,
               arrival: INITIAL_STATE.timeOfDay.arrival
            }
         };

      case CONSTRAINTS.TIME_OF_DAY.ARRIVAL.UPDATE:
         var timeOfDay = { ...state.timeOfDay, arrival: action.payload };
         handleTimeOfDayChange(timeOfDay);
         return { ...state, timeOfDay };

      // TRIP TIME ACTIONS
      case CONSTRAINTS.TRIP_TIME.CLEAR:
         tripsData.clearFilter(tripsData.dimensions.tripTime);
         return { ...state, tripTime: [0, sliderConfig.maxTime] };
      case CONSTRAINTS.TRIP_TIME.UPDATE:
         var [start, end] = action.payload;
         if (end === sliderConfig.maxTime) end = Infinity;
         tripsData.addFilter(
            tripsData.dimensions.tripTime,
            tt => tt >= start && tt <= end
         );
         return { ...state, tripTime: action.payload };

      // TRIP DISTANCE ACTIONS
      case CONSTRAINTS.TRIP_DISTANCE.CLEAR:
         tripsData.clearFilter(tripsData.dimensions.tripDist);
         return { ...state, tripDistance: [0, sliderConfig.maxDistance] };
      case CONSTRAINTS.TRIP_DISTANCE.UPDATE:
         var [start, end] = action.payload;
         if (end === sliderConfig.maxDistance) end = Infinity;
         tripsData.addFilter(
            tripsData.dimensions.tripDist,
            td => td >= start && td <= end
         );
         return { ...state, tripDistance: action.payload };

      // VEHICLE ACTIONS
      // ------------------------------------------------
      case CONSTRAINTS.VEHICLES.UPDATE:
         if (action.payload.length)
            tripsData.addFilter(
               tripsData.dimensions.vin,
               vin => ~action.payload.indexOf(vin)
            );
         else tripsData.clearFilter(tripsData.dimensions.vin);
         return { ...state, vins: action.payload };

      case CONSTRAINTS.VEHICLES.CLEAR:
         tripsData.clearFilter(tripsData.dimensions.vin);
         return { ...state, vins: INITIAL_STATE.vins };

      // DATA SET ACTIONS
      // ------------------------------------------------
      case CONSTRAINTS.DATA_SET.TOGGLE:
         if (state.dataSets.indexOf(action.payload) === -1)
            return { ...state, dataSets: [...state.dataSets, action.payload] };
         else
            return {
               ...state,
               dataSets: state.dataSets.filter(
                  dataSet => dataSet !== action.payload
               )
            };

      // SNAPSHOT ACTIONS
      // ------------------------------------------------
      case CONSTRAINTS.SNAPSHOT.RESOLUTION.UPDATE:
         var snapshot = { ...state.snapshot, resolution: action.payload };
         var { dateRange } = formatTimeRestrictions(state.dateRange, snapshot);
         updateDateFilter(dateRange);
         return { ...state, snapshot };

      case CONSTRAINTS.SNAPSHOT.SLIDER.UPDATE:
         var snapshot = { ...state.snapshot, slider: action.payload };
         var { dateRange } = formatTimeRestrictions(state.dateRange, snapshot);
         updateDateFilter(dateRange);
         return { ...state, snapshot };

      case CONSTRAINTS.SNAPSHOT.TOGGLE:
         var snapshot = { ...state.snapshot, active: !state.snapshot.active };
         var { dateRange } = formatTimeRestrictions(state.dateRange, snapshot);
         updateDateFilter(dateRange);
         return { ...state, snapshot };

      // ADVANCED SETTINGS
      // ------------------------------------------------
      case CONSTRAINTS.ADVANCED_SETTINGS.SAMPLING_RATE.UPDATE.SOFT:
      case CONSTRAINTS.ADVANCED_SETTINGS.SAMPLING_RATE.UPDATE.HARD:
         return {
            ...state,
            advancedSettings: {
               ...state.advancedSettings,
               samplingRate: action.payload
            }
         };

      // DEFAULT
      // ------------------------------------------------
      default:
         return state;
   }
}
