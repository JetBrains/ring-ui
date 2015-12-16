/* eslint-disable no-var */

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
        This version of your browser is not <a href="https://documentation.link">supported</a>.<br/>
        Try upgrading to the latest stable version.
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
      var oldBrowsersMessageNode = document.getElementById('ring-old-browsers-message');
      var smileNode = document.getElementById('ring-old-browsers-message__smile');

      if (oldBrowsersMessageNode) {
        oldBrowsersMessageNode.style.display = 'block';
      }

      if (smileNode) {
        attachSmileClickListener(smileNode);
      }
    });
  }

  activate();
}());
