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
function toPgArrStr(arr, { offset = 0, template = a => a, joiner = "," } = {}) {
   offset = offset + 1;
   return arr.reduce(
      (x, y, i) => x + `${i === 0 ? "" : joiner}${template(`\$${i + offset}`)}`,
      ""
   );
}

module.exports = {
   toPgArrStr
};
