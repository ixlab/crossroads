// custom modules
import { TIMESTAMPS } from "../constants";

/**
 * updates the list of timestamps available to be queried for
 * @param {array} timestamps - an array of UNIX timestamps
 * @returns {object} a redux action
 */
function update(timestamps) {
   return {
      type: TIMESTAMPS.UPDATE,
      payload: timestamps
   };
}

module.exports = {
   update
};
