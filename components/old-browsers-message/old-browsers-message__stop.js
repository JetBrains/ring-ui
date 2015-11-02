/**
 Removes error message block
 */

export default function () {
  const oldBrowsersMessageNode = document.getElementById('ring-old-browsers-message');

  if (oldBrowsersMessageNode.remove) {
    oldBrowsersMessageNode.remove();
  } else if (oldBrowsersMessageNode.parentNode) {
    oldBrowsersMessageNode.parentNode.removeChild(oldBrowsersMessageNode);
  }
}
