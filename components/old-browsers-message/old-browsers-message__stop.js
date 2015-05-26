/**
 Removes error message block
 */

module.exports = function () {
  var oldBrowsersMessageNode = document.getElementById('ring-old-browsers-message');
  oldBrowsersMessageNode.remove();
};
