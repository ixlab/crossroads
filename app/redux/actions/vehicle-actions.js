// custom modules
import { VEHICLES } from "../constants";

/**
 * update the list of all available vehicles
 * @param {array} vehicles - the list of all vehicles
 * @returns {object} a redux action
 */
function updateAll(vehicles) {
   return {
      type: VEHICLES.UPDATE_ALL,
      payload: vehicles
   };
}

/**
 * add one or many vehicles to the list of those selected
 * @param {string|array} addition - a string or array of vehicles to be added
 * @returns {object} a redux action
 */
function addSelected(addition) {
   return {
      type: VEHICLES.ADD_SELECTED,
      payload: addition
   };
}

/**
 * remove one or many items from the list of those selected
 * @param {string|array} removal - a string or array of vehicles to be removed
 * @returns {object} a redux action
 */
function removeSelected(removal) {
   return {
      type: VEHICLES.REMOVE_SELECTED,
      payload: removal
   };
}

/**
 * update the selected vehicles with an entirely new array
 * @param {array} selected - an array of selected vehicles
 * @returns {object} a redux action
 */
function updateSelected(selected) {
   return {
      type: VEHICLES.UPDATE_SELECTED,
      payload: selected
   };
}

module.exports = {
   updateAll,
   addSelected,
   removeSelected,
   updateSelected
};
