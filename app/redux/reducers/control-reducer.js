import { CONTROLS, CONTROL_TYPES } from "../constants.js";

const INITIAL_STATE = {
   lastInteraction: CONTROL_TYPES.SLIDER,
   slider: 0,
   range: [0, 0],
   interval: {
      range: [0, 0],
      slider: 0
   }
};

module.exports = function(state = INITIAL_STATE, action) {
   switch (action.type) {
      case CONTROLS.UPDATE_SLIDER:
         return {
            ...state,
            slider: action.payload,
            lastInteraction: CONTROL_TYPES.SLIDER
         };
      case CONTROLS.UPDATE_RANGE:
         return {
            ...state,
            range: action.payload,
            lastInteraction: CONTROL_TYPES.RANGE
         };
      case CONTROLS.UPDATE_INTERVAL:
         return {
            ...state,
            interval: { ...action.payload },
            lastInteraction: CONTROL_TYPES.INTERVAL
         };
      default:
         return state;
   }
};
