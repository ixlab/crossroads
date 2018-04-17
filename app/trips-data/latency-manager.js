// custom modules
import { Timer } from "utils";

/// the latency manager type
export default class LatencyManager {
   constructor() {
      /// store of latency data
      this._latencyData = [];
      this._timer = new Timer();
   }

   /// start the latency timer
   start() {
      this._timer.start();
   }

   /// stop the latency timer
   stop() {
      this._timer.stop();
   }

   /**
    * addPoint - adds a point to the latency data store
    *
    * @param point (object) - the latency point to add. This point must have
    * a latency (time in ms), rows (number of rows returned by query), and
    * a startTime (moment datetime object) property
    */
   addPoint(point) {
      if (
         !point.latency ||
         !point.rows ||
         !point.startTime ||
         point.speculation === undefined
      ) {
         return;
      } else if (this._latencyData.length > 100) {
         this._latencyData.shift();
      }
      let network =
         this._timer.total - (point.latency + point.speculation || 0);
      // NOTE: something about taking the total is wrong sometimes and yields a
      // negative number
      if (network < 0) network = 0;
      this._latencyData.push({
         api: point.latency,
         network,
         dbLatency: point.dbLatency,
         speculation: point.speculation
      });
      this._timer.clear();
   }

   /// clears the latency data array
   clear() {
      while (this._latencyData.length) _latencyData.pop();
   }

   /**
    * getNetworkLatency - retrieves only the network latency times from the
    * latency point store
    *
    * @return {arrayOf(number)} - the array of latency times
    */
   getNetworkLatency() {
      return this._latencyData.map(x => x.network);
   }

   /// get the average network latency
   getAvgNetworkLatency() {
      const data = this._latencyData.map(x => x.network);
      return data.reduce((x, y) => x + y, 0) / data.length || 1;
   }

   /**
    * getDBLatency - retrieves only the network latency times from the
    * latency point store
    *
    * @return {arrayOf(number)} - the array of latency times
    */
   getDBLatency() {
      return this._latencyData.map(x => x.dbLatency);
   }

   /// get the average network latency
   getAvgDBLatency() {
      const data = this._latencyData.map(x => x.dbLatency);
      return data.reduce((x, y) => x + y, 0) / data.length || 1;
   }

   /**
    * getAPILatency - retrieves only the API latencyies from the latency point
    * store
    *
    * @return {arrayOf(number)} - the array of latency times
    */
   getAPILatency() {
      return this._latencyData.map(x => x.api);
   }

   /// get the average network latency
   getAvgAPILatency() {
      const data = this._latencyData.map(x => x.api);
      return data.reduce((x, y) => x + y, 0) / data.length || 1;
   }

   /// get the average network latency
   getAvgSesameLatency() {
      const data = this._latencyData.map(x => x.speculation);
      return data.reduce((x, y) => x + y, 0) / data.length || 1;
   }

   /// get data points with speculation
   getSpeculationData() {
      const data = this._latencyData.filter(x => x.speculation);
      return data;
   }

   /// get data points with no speculation
   getNonSpeculationData() {
      const data = this._latencyData.filter(x => !x.speculation);
      return data;
   }

   /**
    * getAllData - returns the latency data store
    *
    * @return {arrayOf(object)} - the array of latency objects
    */
   getAllData() {
      return this._latencyData;
   }
}
