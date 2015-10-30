/**
 Removes error message block
 */

module.exports = function () {
  const oldBrowsersMessageNode = document.getElementById('ring-old-browsers-message');

  if (oldBrowsersMessageNode.remove) {
    oldBrowsersMessageNode.remove();
  } else if (oldBrowsersMessageNode.parentNode) {
    oldBrowsersMessageNode.parentNode.removeChild(oldBrowsersMessageNode);
  }
};
