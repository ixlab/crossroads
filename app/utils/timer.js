// external modules
import moment from "moment";

export default class Timer {
   constructor() {
      this._start = null;
      this._stop = null;
   }

   clear() {
      this._start = null;
      this._stop = null;
   }

   start() {
      this._start = moment();
   }

   stop() {
      this._stop = moment();
   }

   get total() {
      if (!this._start || !this._stop) return 0;
      return this._stop.diff(this._start);
   }
}
