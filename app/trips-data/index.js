// external modules
import crossfilter from "crossfilter";
import moment from "moment";

// custom modules
import { TRIP_SIDE } from "utils/constants";
import LatencyManager from "./latency-manager";

// instantiate crossfilter object
const trips = crossfilter();

// instantiate utility object for export
const tripsData = {
   // reference to crossfilter object
   _trips: trips,

   // callbacks for when the output data changes
   _onChange: [],

   // currently active filters for each dimension
   _filters: {
      vin: null,
      date: null,
      departureTime: null,
      arrivalTime: null,
      dow: null,
      type: null,
      tripDist: null,
      tripTime: null
   },

   // actual dimensions; shouldn't be touched other than from within this object
   _dimensions: {
      vin: trips.dimension(({ vin }) => vin),
      date: trips.dimension(({ tm }) => +tm),
      time: trips.dimension(({ hr }) => +hr),
      dow: trips.dimension(({ d }) => +d),
      type: trips.dimension(({ t }) => +t),
      tripDist: trips.dimension(({ td }) => +td),
      tripTime: trips.dimension(({ tt }) => +tt)
   },

   // dimension names
   dimensions: {
      // real dimens
      vin: "vin",
      date: "date",
      time: "time",
      dow: "dow",
      type: "type",
      tripDist: "tripDist",
      tripTime: "tripTime",
      // "psuedo" dimens
      departureTime: "departureTime",
      arrivalTime: "arrivalTime"
   },

   /**
    * Invokes all the registered callbacks in this._onChange
    */
   _fireCallbacks: function() {
      this._onChange.forEach(callback =>
         callback(this.data.arrival, this.data.departure)
      );
   },

   /**
    * Adds a filter to the given dimension, which should be from
    * this.dimensions
    *
    * @param {string}   dimen  - the dimension to add the filter to
    * @param {function} filter - the filtering function
    */
   addFilter: function(dimen, filter) {
      // save the filter
      this._filters[dimen] = filter;

      // add the filter to the dimension, if it exists
      this._dimensions[dimen] && this._dimensions[dimen].filter(filter);

      // fire all on change callbacks
      this._fireCallbacks();
   },

   /**
    * Trims the data set based on the bounds of the date dimension
    */
   trimData: function() {
      // exit if there is no date filter to use for trimming
      const dateFilter = this._filters.date;
      if (!dateFilter) return;

      // make a copy of the fliters, and then clear them from the dimensions
      const prevFilters = { ...this._filters };
      this.clearFilter();

      // remove data based on date range filter only
      this._dimensions[this.dimensions.date].filter(date => !dateFilter(date));
      trips.remove();
      this._dimensions[this.dimensions.date].filter(null);

      // restore the filters from copy
      Object.values(this.dimensions).forEach(key => {
         this._filters[key] = prevFilters[key];
      });

      // fire all on change callbacks
      this._fireCallbacks();
   },

   /**
    * Clears filter for the given dimension; clears all filters if
    * none is specified.
    *
    * @param  {string} dimen - the dimension to clear the filter from
    * @return {[type]}       [description]
    */
   clearFilter: function(dimen) {
      if (dimen) {
         // clear filter for given dimen
         this._dimensions[dimen] && this._dimensions[dimen].filter(null);
         this._filters[dimen] = null;
      } else {
         // clear all filters
         Object.values(this.dimensions).forEach(key => {
            this._dimensions[key] && this._dimensions[key].filter(null);
            this._filters[key] = null;
         });
      }

      // fire all on change callbacks
      this._fireCallbacks();
   },

   /**
    * Update the data stored in the crossfilter object
    *
    * @param  {array} data - the new data to be stored
    */
   updateData: function(data) {
      /*
			if there is data already in crossfilter, need to save the filters,
			remove all data, and then re-apply the filters. Otherwise, just add
			the data to the crossfilter object
		*/
      if (trips.size()) {
         // save and clear filters
         const prevFilters = { ...this._filters };
         this.clearFilter();

         // remove all old data, add new data
         trips.remove();
         trips.add(data);

         // restore filters from copy
         Object.values(this.dimensions).forEach(key => {
            this._filters[key] = prevFilters[key];
         });
      } else {
         trips.add(data);
      }

      // fire all on change callbacks
      this._fireCallbacks();
   },

   /**
    * Groups the given dimension by the given grouping function
    * and returns the resulting data
    * @param  {string}   dimen        - the dimension to group
    * @param  {function} groupingFunc - the grouping function
    * @return {array}                 - the resulting data
    */
   groupDimenBy: function(dimen, groupingFunc) {
      if (groupingFunc) {
         const group = this._dimensions[dimen].group(groupingFunc);
         return group.top(Infinity) || [];
      } else {
         const group = this._dimensions[dimen].group();
         return group.top(Infinity) || [];
      }
   },

   /**
    * Sets the onChange handler for the crossroads data
    *
    * @param  {function} callback - invoked upon changes
    */
   onChange: function(callback) {
      this._onChange.push(callback);
   },

   /// a reference to the latency managers
   latencyManager: {
      arrival: new LatencyManager(),
      departure: new LatencyManager(),

      getNetworkLatency: function() {
         return this.arrival
            .getNetworkLatency()
            .concat(this.departure.getNetworkLatency());
      },
      getAvgNetworkLatency() {
         return (
            (this.arrival.getAvgNetworkLatency() +
               this.departure.getAvgNetworkLatency()) /
            2
         );
      },

      getDBLatency: function() {
         return this.arrival
            .getDBLatency()
            .concat(this.departure.getDBLatency());
      },
      getAvgDBLatency() {
         return (
            (this.arrival.getAvgDBLatency() +
               this.departure.getAvgDBLatency()) /
            2
         );
      },

      getAPILatency: function() {
         return this.arrival
            .getAPILatency()
            .concat(this.departure.getAPILatency());
      },
      getAvgAPILatency() {
         return (
            (this.arrival.getAvgAPILatency() +
               this.departure.getAvgAPILatency()) /
            2
         );
      },

      _BUCKET_SIZE: 100,
      _BUCKETS: 10,
      getHistogramLabels() {
         let labels = [];
         for (let i = 0; i < this._BUCKETS; i++) {
            labels[i] = `${(i + 1) * this._BUCKET_SIZE}ms`;
         }
         return labels;
      },
      _buildHistogram(x, y, opts = {}) {
         let data = [];
         for (let i = 0; i < this._BUCKETS; i++) {
            data[i] = 0;
         }

         x.concat(y).forEach(({ api, network, dbLatency }) => {
            let latency = 0;
            if (opts.network) latency += network;
            if (opts.api) latency += api;
            if (opts.dbLatency) latency += dbLatency;

            const bucket = Math.round(latency / this._BUCKET_SIZE) - 1;
            if (bucket < this._BUCKETS) {
               data[bucket] += 1;
            } else {
               console.warn(
                  `bucket index ${bucket} out of bounds (max ${this._BUCKETS})`
               );
            }
         });

         return data;
      },
      getSpeculationHistogram(opts) {
         const dd = this.departure.getSpeculationData();
         const ad = this.arrival.getSpeculationData();
         return this._buildHistogram(ad, dd, opts);
      },
      getNonSpeculationHistogram(opts) {
         const dd = this.departure.getNonSpeculationData();
         const ad = this.arrival.getNonSpeculationData();
         return this._buildHistogram(ad, dd, opts);
      },

      getAllData: function() {
         return this.arrival.getAllData().concat(this.departure.getAllData());
      }
   }
};

/*
	various data getters (all getters take filters into account); getters
	have to be added like this so that they have access to the `tripsData`
	object
*/
tripsData.data = {
   /**
    * Gets all the data stored in the crossfilter
    *
    * @return {array} - the data returned from crossfilter
    */
   get all() {
      return tripsData._dimensions.type.top(Infinity);
   },

   /**
    * Gets all the data stored in the crossfilter for the departure
    * heatmap only
    *
    * @return {array} - the data returned from crossfilter
    */
   get departure() {
      tripsData._dimensions.type.filter(type => type === TRIP_SIDE.DEPARTURE);

      if (tripsData._filters.departureTime)
         tripsData._dimensions.time.filter(tripsData._filters.departureTime);

      const data = tripsData._dimensions.type.top(Infinity);

      tripsData._dimensions.type.filter(null);
      tripsData._dimensions.time.filter(null);

      return data;
   },

   /**
    * Gets all the data stored in the crossfilter for the arrival
    * heatmap only
    *
    * @return {array} - the data returned from crossfilter
    */
   get arrival() {
      tripsData._dimensions.type.filter(type => type === TRIP_SIDE.ARRIVAL);

      if (tripsData._filters.arrivalTime)
         tripsData._dimensions.time.filter(tripsData._filters.arrivalTime);

      const data = tripsData._dimensions.type.top(Infinity);

      tripsData._dimensions.type.filter(null);
      tripsData._dimensions.time.filter(null);

      return data;
   }
};

// export the module
export default tripsData;
