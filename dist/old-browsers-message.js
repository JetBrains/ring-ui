import { h as _slicedToArray, i as _objectSpread2, d as _defineProperty } from './_rollupPluginBabelHelpers-ab14fb00.js';
import { s as sniffr } from './sniffer-c9d1f40e.js';
import 'sniffr';

var MAJOR_VERSION_INDEX = 0;
/**
 * SUPPORTED_BROWSERS are defined by Babel plugin, see babel config
 */

/* global SUPPORTED_BROWSERS */

if (!["and_chr 88", "and_uc 12.12", "chrome 87", "chrome 86", "edge 87", "firefox 84", "firefox 83", "ie 11", "ios_saf 14.0-14.3", "ios_saf 13.4-13.7", "ios_saf 12.2-12.4", "op_mini all", "safari 14", "samsung 13.0"]) {
  // eslint-disable-next-line no-console
  console.warn('Ring UI: no SUPPORTED_BROWSERS passed. Please check babel config.');
}

var SUPPORTED = ["and_chr 88", "and_uc 12.12", "chrome 87", "chrome 86", "edge 87", "firefox 84", "firefox 83", "ie 11", "ios_saf 14.0-14.3", "ios_saf 13.4-13.7", "ios_saf 12.2-12.4", "op_mini all", "safari 14", "samsung 13.0"] || [];
var WHITE_LISTED_BROWSERS = ['chrome', 'firefox', 'safari', 'edge'];
var WHITE_LIST = SUPPORTED.reduce(function (acc, item) {
  var _item$match = item.match(/(\S+)\s(\S+)/),
      _item$match2 = _slicedToArray(_item$match, 3),
      browserName = _item$match2[1],
      version = _item$match2[2];

  if (!WHITE_LISTED_BROWSERS.includes(browserName)) {
    return acc;
  }

  return _objectSpread2(_objectSpread2({}, acc), {}, _defineProperty({}, browserName, parseInt(version, 10)));
}, {});
function isBrowserInWhiteList() {
  return sniffr.browser.version[MAJOR_VERSION_INDEX] >= WHITE_LIST[sniffr.browser.name];
}

/**
 * @name Old Browsers Message
 */

/**
  The list of versions which are definitely supported. "Browser is unsupported"
  won't be displayed for those and higher versions even when a JS error occurs
  on application start.
 */

var smileChanges = 0;
var MAX_SMILE_CHANGES = 50;
var previousWindowErrorHandler;

function changeSmileClickListener(event) {
  var eyes = ['O', 'o', '-', '>', '<'];
  var target = event.target || event.srcElement;
  smileChanges++;

  function rand(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
  }

  function getRandomEye() {
    return eyes[rand(0, eyes.length - 1)];
  }

  function getRandomSmile() {
    if (smileChanges >= MAX_SMILE_CHANGES) {
      return '\\\\ (x_x) //';
    }

    return "{{ (".concat(getRandomEye(), "_").concat(getRandomEye(), ") }}");
  }

  target.innerHTML = getRandomSmile();
}

function attachSmileClickListener(smileNode) {
  if (smileNode.addEventListener) {
    smileNode.addEventListener('click', changeSmileClickListener);
  } else if (smileNode.attachEvent) {
    smileNode.attachEvent('onclick', changeSmileClickListener);
  }
}
/**
 * Listens to unhandled errors and displays passed node
 */


function startOldBrowsersDetector(onOldBrowserDetected) {
  previousWindowErrorHandler = window.onerror;

  window.onerror = function oldBrowsersMessageShower(errorMsg, url, lineNumber) {
    if (onOldBrowserDetected) {
      onOldBrowserDetected();
    }

    if (previousWindowErrorHandler) {
      return previousWindowErrorHandler(errorMsg, url, lineNumber);
    }

    return false;
  };
}

function stopOldBrowserDetector() {
  window.onerror = previousWindowErrorHandler;
} //Start javascript error detection


startOldBrowsersDetector(function () {
  var oldBrowsersMessageContainer = document.getElementById('ring-old-browsers-message');
  var browserMessage = document.getElementById('ring-old-browsers-message__browser-message');
  var errorMessage = document.getElementById('ring-old-browsers-message__error-message');
  var smileNode = document.getElementById('ring-old-browsers-message__smile');

  if (isBrowserInWhiteList()) {
    browserMessage.style.display = 'none';
    errorMessage.style.display = 'block';
  } else {
    browserMessage.style.display = 'block';
    errorMessage.style.display = 'none';
  }

  if (oldBrowsersMessageContainer) {
    oldBrowsersMessageContainer.hidden = false;
    oldBrowsersMessageContainer.style.display = 'block';
  }

  if (smileNode) {
    attachSmileClickListener(smileNode);
  }
});

export { stopOldBrowserDetector as stop };
