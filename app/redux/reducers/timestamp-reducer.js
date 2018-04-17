// custom modules
import { TIMESTAMPS } from "../constants";

const INITIAL_STATE = [];

module.exports = function(state = INITIAL_STATE, action) {
   switch (action.type) {
      case TIMESTAMPS.UPDATE:
         return action.payload;
      default:
         return state;
   }
};
