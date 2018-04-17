import { CONTROLS } from "../constants";

/**
 * updates the value of the snapshot slider input
 * @param {string} slider - the slider's new value
 * @returns {object} a redux action
 */
function updateSlider(slider) {
   return {
      type: CONTROLS.UPDATE_SLIDER,
      payload: slider
   };
}

/**
 * updates the value of the range input
 * @param {array} range - the range's new value (a 2 element array of [low, high])
 * @returns {object} a redux action
 */
function updateRange(range) {
   return {
      type: CONTROLS.UPDATE_RANGE,
      payload: range
   };
}

/**
 * updates the value of the interval range and slider inputs
 * @param {array} range - the range's new value (a 2 element array of [low, high])
 * @param {string} slider - the slider's new value
 * @returns {object} a redux action
 */
function updateInterval(range, slider) {
   return {
      type: CONTROLS.UPDATE_INTERVAL,
      payload: { range, slider }
   };
}

module.exports = {
   updateSlider,
   updateRange,
   updateInterval
};
