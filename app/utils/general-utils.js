// external imports
import moment from "moment";

// custom imports
import { RESOLUTION, TM_UNITS } from "./constants";

/**
 * Converts a string to snake case from camel case
 * @param  {string} str - the string to convert
 * @return {string} the converted string
 */
function toSnakeCase(str) {
   return str.replace(/([A-Z])/g, $1 => "_" + $1.toLowerCase());
}

/**
 * converts two unix timestamps into a
 * human readable format. If only one time
 * is given, that time will be converted
 * into a human readable interval.
 *
 * @param {number} low - smaller unix timestamp
 * @param {number} high - larger unix timestamp
 * @returns a human readable interval
 */
function humanInterval(low, high) {
   let delta = high ? (high - low) / 1000 : low;

   const days = Math.floor(delta / 86400);
   delta -= days * 86400;

   const hours = Math.floor(delta / 3600) % 24;
   delta -= hours * 3600;

   const minutes = Math.floor(delta / 60) % 60;
   delta -= minutes * 60;

   const seconds = Math.floor(delta % 60);

   return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

/**
 * converts a timestamp from the db into
 * a valid js Date object
 * @param {number} timestamp - unix timestamp
 */
function timestampToDate(timestamp) {
   return timestamp && timestamp.tm && new Date(timestamp.tm * 1000);
}

/**
 * converts a timestamp from the db into
 * a short date (mm/dd/yyyy h:mm a)
 */
function toShortDateTime(timestamp) {
   const date = timestampToDate({ tm: parseInt(timestamp) });
   return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

/**
 * Generates a random hex color code
 * @return {string} a hex color code of the form "#xxxxxx"
 */
function randomColor() {
   const helper = () => {
      let raw = Math.ceil(Math.random() * 0xff).toString(16);
      while (raw.length < 2) raw = `0${raw}`;
      return raw;
   };
   const r = helper();
   const g = helper();
   const b = helper();
   return `#${r}${g}${b}`;
}

/**
 * converts a hex color to an rgb color
 * @param  {string} hex - a hex color code
 * @return {string}     - an rgb color code
 */
function hexToRgb(hex) {
   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
   return result
      ? {
           r: parseInt(result[1], 16),
           g: parseInt(result[2], 16),
           b: parseInt(result[3], 16)
        }
      : null;
}

/**
 * converts a hex color with alpha value to an rgba color
 * @param  {string} hex - a hex color code
 * @return {string}     - an rgba color code
 */
function hexToRgba(hex, a) {
   var rgb = hexToRgb(hex);
   return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
}

/**
 * Formats time restrictions such that the appropriate date
 * is sent to the API.
 * @param  {object} dateRange - range of dates
 * @param  {object} snapshot  - snapshot information
 * @return {object}           - time restriction information
 */
function formatTimeRestrictions(dateRange, snapshot) {
   if (!snapshot.active || !dateRange.start || !dateRange.end)
      return { dateRange };

   switch (snapshot.resolution) {
      case RESOLUTION.DAY:
         const day = moment(dateRange.start).add(snapshot.slider, "days");
         return {
            dateRange: {
               start: moment(day).startOf("day"),
               end: moment(day).endOf("day")
            }
         };
      case RESOLUTION.WEEK:
         return {
            dateRange: {
               start: moment(dateRange.start).add(snapshot.slider, "weeks"),
               end: moment(dateRange.start).add(snapshot.slider + 1, "weeks")
            }
         };
      case RESOLUTION.MONTH:
         const month = moment(dateRange.start).add(snapshot.slider, "months");
         return {
            dateRange: {
               start: moment(month).startOf("month"),
               end: moment(month).endOf("month")
            }
         };
   }
}

/**
 * Generates a heatmap color gradient from a hex color code
 * @param  {string} hex - a hex color code
 * @return {object}     the heatmap color gradient object
 */
function generateHeatmapGradient(hex) {
   const { r: r0, g: g0, b: b0 } = hexToRgb(hex),
      // light
      r1 = r0 + 25 > 255 ? 255 : r0 + 25,
      g1 = g0 + 25 > 255 ? 255 : g0 + 25,
      b1 = b0 + 25 > 255 ? 255 : b0 + 25,
      // dark
      r2 = r0 - 25 < 0 ? 0 : r0 - 25,
      g2 = g0 - 25 < 0 ? 0 : g0 - 25,
      b2 = b0 - 25 < 0 ? 0 : b0 - 25,
      // darkest
      r3 = r0 - 50 < 0 ? 0 : r0 - 50,
      g3 = g0 - 50 < 0 ? 0 : g0 - 50,
      b3 = b0 - 50 < 0 ? 0 : b0 - 50;

   return {
      0.25: `rgba(${r1},${g1},${b1},1.0)`, // lighter
      0.5: `rgba(${r0},${g0},${b0},1.0)`, // original
      0.75: `rgba(${r2},${g2},${b2},1.0)`, // darker
      1.0: `rgba(${r3},${g3},${b3},1.0)` // darkest
   };
}

/**
 * Disables the zooming of a leaflet map
 * @param  {object} map - the leaflet map
 */
function disableZoom(map) {
   map.touchZoom.disable();
   map.doubleClickZoom.disable();
   map.scrollWheelZoom.disable();
   map.boxZoom.disable();
   map.keyboard.disable();

   const ctrl = document.querySelector(".leaflet-control-zoom");
   if (ctrl) {
      ctrl.style.visibility = "hidden";
   }
}

/**
 * Enables the zooming of a leaflet map
 * @param  {object} map - the leaflet map
 */
function enableZoom(map) {
   map.touchZoom.enable();
   map.doubleClickZoom.enable();
   map.scrollWheelZoom.enable();
   map.boxZoom.enable();
   map.keyboard.enable();

   const ctrl = document.querySelector(".leaflet-control-zoom");
   if (ctrl) {
      ctrl.style.visibility = "visible";
   }
}

/**
 * Converts an svg element into a canvas element
 * @param  {object} svg - an svg element
 * @return {promise}     resolves with the canvas element
 */
function svgToCanvas(svg) {
   const promise = new Promise((resolve, reject) => {
      // instatiate the canvas element
      const canvas = document.createElement("canvas");
      canvas.height = svg.height.baseVal.value;
      canvas.width = svg.width.baseVal.value;

      // instantiate the image element (to monitor loading)
      const img = document.createElement("img");

      // create the canvases context
      const ctx = canvas.getContext("2d");

      // serialize the data and create a blob url
      let data = new XMLSerializer().serializeToString(svg);

      const re = /transform:\s?translate3d\((-?\d+)[pxtrem]*\,?\s?(-?\d+)[pxtrem]*\,?\s?(-?\d+)[pxtrem]*\);/;
      const [, x, y] = data.match(re);
      const heatmap = document.querySelector(
         ".leaflet-overlay-pane .leaflet-heatmap-layer"
      );
      const [, hx, hy] = heatmap.style.transform.match(
         /translate3d\((-?\d+)[pxtrem]*\,?\s?(-?\d+)[pxtrem]*\,?\s?(-?\d+)[pxtrem]*\)/
      );
      const offX = x - hx;
      const offY = y - hy;
      data = data.replace(re, "");

      const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      console.log(url);

      // once the image has loaded, draw it into the canvas' context
      // and resolve the canvas
      img.onload = () => {
         ctx.drawImage(img, offX, offY);
         // URL.revokeObjectURL(url);
         resolve(canvas);
      };

      // begin loading the image
      img.src = url;
   });

   return promise;
}

/**
 * Convert a time to unix based on the units.
 * @param  {object} time  - the time to convert
 * @param  {string} units - the time units, from TM_UNITS
 * @return {number}       the unix timestamp
 */
function toUnix(time, units) {
   switch (units) {
      case TM_UNITS.MILLIS.value:
         return time;
      case TM_UNITS.SECONDS.value:
         return parseInt(time) * 1000;
      case TM_UNITS.DATE.value:
         return moment(time).unix();
   }
}

/**
 * Formats the time of date into moment objects.
 * @param {object} timeOfDay - the time of day object from the contraints reducer
 * @returns a properly formatted time of day object
 */
function formatTimeOfDay(timeOfDay) {
   let arrival1 =
      timeOfDay.arrival[0] === 24
         ? moment("11:59pm", "HH:mm a")
         : moment(`${timeOfDay.arrival[0]}`, "HH");

   let arrival2 =
      timeOfDay.arrival[1] === 24
         ? moment("11:59pm", "HH:mm a")
         : moment(`${timeOfDay.arrival[1]}`, "HH");

   let departure1 =
      timeOfDay.departure[0] === 24
         ? moment("11:59pm", "HH:mm a")
         : moment(`${timeOfDay.departure[0]}`, "HH");

   let departure2 =
      timeOfDay.departure[1] === 24
         ? moment("11:59pm", "HH:mm a")
         : moment(`${timeOfDay.departure[1]}`, "HH");

   return {
      arrival: [arrival1, arrival2],
      departure: [departure1, departure2]
   };
}

/**
 * Converts a css dimension (10px, 10%, 10rem, 10) into an int if possible, or returns undefined
 * @param  css - string css dimension
 * @return int version of the input, or undefined
 */
function cssDimensionToInt(css) {
   var numeric = css.match(/[0-9]*/)[0];
   if (numeric) return parseInt(numeric);
}

module.exports = {
   toSnakeCase,
   humanInterval,
   timestampToDate,
   toShortDateTime,
   formatTimeRestrictions,
   randomColor,
   hexToRgb,
   hexToRgba,
   generateHeatmapGradient,
   disableZoom,
   enableZoom,
   svgToCanvas,
   toUnix,
   formatTimeOfDay,
   cssDimensionToInt
};
