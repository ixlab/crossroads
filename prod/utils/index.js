"use strict";

/**
 * Takes an array and converts it to a node-pg friendly
 * interpolation string. Ex: ['hello', 'd', {}, 2] -> "($1,$2,$3,$4)".
 *
 * @param {array} arr - the array to be converted
 * @param {object} options - the options object
 * @param {number} opts.offset - the number to offset the initial count by
 * @param {func} opts.template - a templating function to apply to each element in the string
 * @param {func} opts.joiner - the text to join the elements with
 * @returns the pg compliant string
 */
function toPgArrStr(arr) {
   var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
       _ref$offset = _ref.offset,
       offset = _ref$offset === undefined ? 0 : _ref$offset,
       _ref$template = _ref.template,
       template = _ref$template === undefined ? function (a) {
      return a;
   } : _ref$template,
       _ref$joiner = _ref.joiner,
       joiner = _ref$joiner === undefined ? "," : _ref$joiner;

   offset = offset + 1;
   return arr.reduce(function (x, y, i) {
      return x + ("" + (i === 0 ? "" : joiner) + template("$" + (i + offset)));
   }, "");
}

module.exports = {
   toPgArrStr: toPgArrStr
};