// IMPORTANT: Only put vanilla JavaScript in here: this should all work in the server or client

/**
 * Is Some Of This Array In That Array?
 * Are any of the items in arrayA in arrayB?
 * @param {Array} arrayA
 * @param {Array} arrayB
 * @return {boolean}
 */
function hasItemsInItems(arrayA, arrayB) {
  return arrayA.some(a => arrayB.includes(a));
}

module.exports = {
  hasItemsInItems,
};
