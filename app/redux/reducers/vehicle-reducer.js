// custom modules
import { VEHICLES } from "../constants";

const INITIAL_STATE = {
   all: [],
   selected: []
};

module.exports = function(state = INITIAL_STATE, action) {
   switch (action.type) {
      case VEHICLES.UPDATE_ALL:
         return {
            ...state,
            all: action.payload
         };
      case VEHICLES.ADD_SELECTED:
         const data = Array.isArray(action.payload)
            ? action.payload
            : [action.payload];
         return {
            ...state,
            selected: [
               ...state.selected,
               ...data.filter(x => state.selected.indexOf(x) === -1)
            ]
         };
      case VEHICLES.REMOVE_SELECTED:
         if (Array.isArray(action.payload))
            // remove many
            return {
               ...state,
               selected: state.selected.filter(
                  x => action.payload.indexOf(x) !== -1
               )
            }; // remove one
         else
            return {
               ...state,
               selected: state.selected.filter(x => x !== action.payload)
            };
      case VEHICLES.UPDATE_SELECTED:
         return {
            ...state,
            selected: action.payload
         };
      default:
         return state;
   }
};
