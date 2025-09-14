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
let previousWindowErrorHandler: OnErrorEventHandler;

function changeSmileClickListener(event: Event) {
  const eyes = ['O', 'o', '-', '>', '<'];
  const target = (event.target || event.srcElement) as HTMLElement;

  smileChanges++;

  function rand(min: number, max: number) {
    return Math.round(Math.random() * (max - min)) + min;
  }

  function getRandomEye() {
    return eyes[rand(0, eyes.length - 1)];
  }

  function getRandomSmile() {
    if (smileChanges >= MAX_SMILE_CHANGES) {
      return '\\\\ (x_x) //';
    }

    return `{{ (${getRandomEye()}_${getRandomEye()}) }}`;
  }

  target.innerHTML = getRandomSmile();
}

function attachSmileClickListener(smileNode: Node) {
  if (smileNode.addEventListener) {
    smileNode.addEventListener('click', changeSmileClickListener);
    /* eslint-disable @typescript-eslint/no-explicit-any */
  } else if ((smileNode as any).attachEvent) {
    (smileNode as any).attachEvent('onclick', changeSmileClickListener);
    /* eslint-enable */
  }
}

/**
 * Listens to unhandled errors and displays passed node
 */
function startOldBrowsersDetector(onOldBrowserDetected?: () => void) {
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

  if (browserMessage && errorMessage) {
    if (isBrowserInWhiteList()) {
      browserMessage.style.display = 'none';
      errorMessage.style.display = 'block';
    } else {
      browserMessage.style.display = 'block';
      errorMessage.style.display = 'none';
    }
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
