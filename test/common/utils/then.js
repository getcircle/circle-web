/**
 * http://brandonokert.com/2015/08/04/TestingInReact/#Verify_Components_Callback_is_Called_within_a_Specific_Time-Window
 */
var then = function (callback, timeout) {
  setTimeout(callback, timeout > 0 ? timeout : 0);
  return {then: then};
};

module.exports = then;
