export default class MapTracker {
   /// name of the leaflet events
   static EVENTS = {
      ZOOM_END: "zoomend",
      MOVE_END: "moveend"
   };

   constructor(map) {
      this.map = map;
      this.eventCallbacks = {};
   }

   /**
    * Register a callback for the given event
    * @param  {string}   event    leaflet event name
    * @param  {Function} callback callback function for the event
    */
   registerCallback(event, callback) {
      // unregister old callback if it exists
      if (this.eventCallbacks[event]) {
         const callback = this.eventCallbacks[event];
         this.map.off(event, callback);
      }
      // register the new callbacks
      this.eventCallbacks[event] = callback;
      this.map.on(event, callback);
   }

   /**
    * Unregister the callback for a given event
    * @param  {string} event the event to unregister callbacks for
    * @return {Function}     the callback that was unregistered
    */
   unregisterCallback(event) {
      const callback = this.eventCallbacks[event];
      this.map.off(event, callback);
      delete this.eventCallbacks[event];
      return callback;
   }
}
