import { CONSTRAINTS } from "../constants";

/*
    IMPORTANT:
    Advanced settings is technically a part of the contraints reducer, but
    the actions are broken out into a separate module for clarity and ease of
    use.
*/

/**
 * softUpdate - "softly" update the sampling rate value; meaning, that this
 * method will not call for a requery.
 *
 * @param {number} sliderVal - the new value of the slider
 *
 * @return {object} a redux action
 */
function softUpdate(sliderVal) {
   return {
      type: CONSTRAINTS.ADVANCED_SETTINGS.SAMPLING_RATE.UPDATE.SOFT,
      payload: sliderVal
   };
}

/**
 * hardUpdate - "hard" update the sampling rate value; meaning, that this
 * method WILL trigger a requery
 *
 * @param {number} sliderVal - the new value of the slider
 *
 * @return {object} a redux action
 */
function hardUpdate(sliderVal) {
   return {
      type: CONSTRAINTS.ADVANCED_SETTINGS.SAMPLING_RATE.UPDATE.HARD,
      payload: sliderVal
   };
}

export default {
   samplingRate: {
      update: {
         soft: softUpdate,
         hard: hardUpdate
      }
   }
};
