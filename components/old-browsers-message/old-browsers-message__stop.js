/**
 Removes error message block
 */

module.export = function () {
  var oldBrowsersMessageNode = document.getElementById('ring-old-browsers-message');
  oldBrowsersMessageNode.remove();
};
