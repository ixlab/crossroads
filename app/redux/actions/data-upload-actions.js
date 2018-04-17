import { DATA_UPLOAD } from "../constants";
import store from "store";

function updateDataUpload(upload, data) {
   return {
      type: DATA_UPLOAD.DATA.UPDATE,
      payload: { upload, data }
   };
}

function clearDataUpload() {
   return {
      type: DATA_UPLOAD.DATA.CLEAR,
      payload: true
   };
}

function addIgnored(col) {
   return {
      type: DATA_UPLOAD.IGNORED.ADD,
      payload: col
   };
}

function removeIgnored(col) {
   return {
      type: DATA_UPLOAD.IGNORED.REMOVE,
      payload: col
   };
}

// just a helper that triggers an `add` or `remove`
// action
function toggleIgnored(col) {
   if (store.getState().dataUpload.ignored.indexOf(col) === -1)
      return addIgnored(col);
   else return removeIgnored(col);
}

function updateIgnored(ignoredCols) {
   return {
      type: DATA_UPLOAD.IGNORED.UPDATE,
      payload: ignoredCols
   };
}

function clearIgnored() {
   return {
      type: DATA_UPLOAD.IGNORED.CLEAR,
      payload: true
   };
}

function updateTableConfig(tableConfig) {
   return {
      type: DATA_UPLOAD.TABLE_CONFIG.UPDATE,
      payload: tableConfig
   };
}

function clearTableConfig() {
   return {
      type: DATA_UPLOAD.TABLE_CONFIG.CLEAR,
      payload: true
   };
}

module.exports = {
   data: {
      update: updateDataUpload,
      clear: clearDataUpload
   },
   ignored: {
      add: addIgnored,
      remove: removeIgnored,
      toggle: toggleIgnored,
      update: updateIgnored,
      clear: clearIgnored
   },
   tableConfig: {
      update: updateTableConfig,
      clear: clearTableConfig
   }
};
