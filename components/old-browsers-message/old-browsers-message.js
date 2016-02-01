/* eslint-disable no-var, modules/no-cjs */

var Sniffr = require('sniffr');
var sniffr = new Sniffr();
sniffr.sniff();

/**
 * Note: this script is a self running script. You should include it in your browser directly
 * It starts detecting unhandled errors when loaded.
 * When your app is loaded and you want to stop detecting,
 * call require('ring-ui/components/old-browsers-message/old-browsers-message__stop')();
 */

/**
 * @name Old Browsers Message
 * @example
  <example name="Old Browsers Message">
    <file name="index.html">

      <div id="ring-old-browsers-message" class="ring-old-browsers-message ring-old-browsers-message_hidden">
        <span id="ring-old-browsers-message__smile" class="ring-old-browsers-message__smile">{{ (>_<) }}</span>
        <br/><br/>
        <span id="ring-old-browsers-message__browser-message">This version of your browser is not <a href="https://documentation.link">supported</a>.<br/>
        Try upgrading to the latest stable version.</span>
        <span id="ring-old-browsers-message__error-message">Something went seriously wrong.</span>
        <br/><br/>
        <!--[if IE 9]>
          <span>If you use IE9.0 or higher, make sure that compatibility mode is disabled.</span>
        <![endif]-->
      </div>

     </file>
       <file name="index.js" webpack="true">
          require('ring-ui/components/old-browsers-message/old-browsers-message.scss');
          require('ring-ui/components/old-browsers-message/old-browsers-message');

          //Triggering error to imitate unsupported browser
          Object.futureMethodWhichIsNotExistInThisBrowser();
       </file>
   </example>
 */

/*
The list of versions which (and above) is defenitely supported
"Browser is unsupported" won't show for this(and above) browsers even
if js error will occur on application start
*/

var MAJOR_VERSION_INDEX = 0;

var WHITE_LIST = {
  chrome: 38,
  firefox: 34,
  safari: 7,
  ie: 10,
  edge: 1
};


(function () {
  var smileChanges = 0;
  var MAX_SMILE_CHANGES = 50;
  var previousWindowErrorHandler;

  function changeSmileClickListener(event) {
    var eyes = ['O', 'o', '-', '>', '<'];
    var target = event.target || event.srcElement;

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

      return '{{ (' + getRandomEye() + '_' + getRandomEye() + ') }}';
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

  function browserInWhiteList() {
    return sniffr.browser.version[MAJOR_VERSION_INDEX] >= WHITE_LIST[sniffr.browser.name];
  }

  /**
   * Listens to unhandled errors and displays passed node
   */
  function startOldBrowsersDectector(onOldBrowserDetected) {
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

  function activate() {
    startOldBrowsersDectector(function onDetected() {
      var oldBrowsersMessageContainer = document.getElementById('ring-old-browsers-message');
      var browserMessage = document.getElementById('ring-old-browsers-message__browser-message');
      var errorMessage = document.getElementById('ring-old-browsers-message__error-message');
      var smileNode = document.getElementById('ring-old-browsers-message__smile');

      if (browserInWhiteList()) {
        browserMessage.style.display = 'none';
        errorMessage.style.display = 'block';
      } else {
        browserMessage.style.display = 'block';
        errorMessage.style.display = 'none';
      }

      if (oldBrowsersMessageContainer) {
        oldBrowsersMessageContainer.style.display = 'block';
      }

      if (smileNode) {
        attachSmileClickListener(smileNode);
      }
    });
  }

  activate();
}());
