import debounce from "lodash.debounce";

export default {
   /**
    * The map of event callbacks; each event that gets
    * registered will have an array of callbacks as its
    * value.
    * @type {Object}
    */
   _eventsCallbackMap: {},
   /**
    * Registers a new event. Overrides existing event
    * if it already exists.
    * @param  {string} event - the name of the event
    */
   registerEvent: function(event) {
      this._eventsCallbackMap[event] = [];
   },
   /**
    * Register a callback for a given event.
    * @param  {string}   event    - the event name
    * @param  {Function} callback - the callback to register
    * @return {boolean}           - whether or not the callback was registerd
    */
   registerCallback: function(event, callback) {
      const eventCallbacks = this._eventsCallbackMap[event];
      if (eventCallbacks) {
         eventCallbacks.push(callback);
         return true;
      } else {
         return false;
      }
   },
   /**
    * Removes a registered callback for a specific event.
    * @param  {string} event              - the name of the event
    * @param  {function} callbackToRemove - the callback to remove
    * @return {boolean}                   - whether or not a callback was found and removed
    */
   removeCallback: function(event, callbackToRemove) {
      const eventCallbacks = this._eventsCallbackMap[event];
      if (eventCallbacks) {
         let indexToRemove;
         eventCallbacks.forEach((callback, i) => {
            if (callback === callbackToRemove) {
               indexToRemove = i;
            }
         });
         eventCallbacks.splice(indexToRemove, 1);
         return true;
      } else {
         return false;
      }
   },
   /**
    * Fires all the registered callbacks for a given event. debounce prevents
    * 2 events from firing when the arrival and departure maps are both being
    * updated.
    * @param  {string} event - the name of the event
    * @param  {any}    data  - the data to be fed to the callback
    * @return {number}       - the number of callbacks invoked
    */
   fire: debounce(function(event, data) {
      const eventCallbacks = this._eventsCallbackMap[event];
      if (eventCallbacks && eventCallbacks.length) {
         eventCallbacks.forEach(callback => callback(data));
         return eventCallbacks.length;
      } else {
         return 0;
      }
   }, 150)
};
