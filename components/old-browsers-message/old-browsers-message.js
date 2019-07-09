import {isBrowserInWhiteList} from './white-list';

/**
 * @name Old Browsers Message
 */

/**
  The list of versions which are definitely supported. "Browser is unsupported"
  won't be displayed for those and higher versions even when a JS error occurs
  on application start.
 */

let smileChanges = 0;
const MAX_SMILE_CHANGES = 50;
let previousWindowErrorHandler;

function changeSmileClickListener(event) {
  const eyes = ['O', 'o', '-', '>', '<'];
  const target = event.target || event.srcElement;

  smileChanges++;

  function rand(min, max) {
    return Math.round((Math.random() * (max - min))) + min;
  }

  function getRandomEye() {
    return eyes[rand(0, (eyes.length - 1))];
  }

  function getRandomSmile() {
    if (smileChanges >= MAX_SMILE_CHANGES) {
      return '\\\\ (x_x) //';
    }

    return `{{ (${getRandomEye()}_${getRandomEye()}) }}`;
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
}


//Start javascript error detection
startOldBrowsersDetector(() => {
  const oldBrowsersMessageContainer = document.getElementById('ring-old-browsers-message');
  const browserMessage = document.getElementById('ring-old-browsers-message__browser-message');
  const errorMessage = document.getElementById('ring-old-browsers-message__error-message');
  const smileNode = document.getElementById('ring-old-browsers-message__smile');

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

export {stopOldBrowserDetector as stop};
