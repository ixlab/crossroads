/**
 * sets the value of an item in local storage
 * @param {string} key - the key to be set
 * @param {any} value - the value to be set for the key
 */
function setItem(key, value) {
   localStorage.setItem(key.toString(), value);
}

/**
 * set multiple items in local storage at once
 * @param {object} itemObj - an object whose keys and values match what is
 * to be set within local storage
 */
function setItems(itemObj) {
   for (let key in itemObj)
      if (itemObj.hasOwnProperty(key)) setItem(key.toString(), itemObj[key]);
}

/**
 * retrieves an item from local storage
 * @param {string} key - value to retrieve from local storage
 * @param {any} [defaultValue] - default value to be returned if none is found
 * in local storage
 * @returns {any}
 */
function getItem(key, defaultValue) {
   return localStorage.getItem(key) || defaultValue;
}

/**
 * retrieves multiple items from local storage and returns them as an
 * object whose keys and values correspond to local storage
 * @param {array} keys - an array of keys to be retrieved
 * @returns {object}
 */
function getItems(keys) {
   const obj = {};
   for (let i = 0; i < keys.length; i++) {
      let k = keys[i].toString();
      obj[k] = getItem(k);
   }
   return obj;
}

/**
 * retrieves multiple items from local storage and returns them as an
 * object whose keys and values correspond to local storage. Allows for
 * default values to be set for each key
 * @param {array} keyObjs - an array of objects with a key and defaultValue
 * (options) property
 * @returns {object}
 */
function getItemsWithDefaults(keyObjs) {
   const obj = {};
   for (let i = 0; i < keyObjs.length; i++) {
      let k = keyObjs[i];
      obj[k.key] = getItem(k.key.toString()) || k.defaultValue;
   }
   return obj;
}

// keys currently used in local storage
const keys = {
   LAST_INTERACTION: "LAST_INTERACTION"
};

module.exports = {
   setItem,
   setItems,
   getItem,
   getItems,
   getItemsWithDefaults,
   keys
};
