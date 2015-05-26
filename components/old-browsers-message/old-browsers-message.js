/**
 * Note: this script is self running script. You should include it in your browser directly
 * It starts detecting unhandled errors when loaded.
 * When your app is loaded and you want to stop detecting,
 * call require('old-browsers-message/old-browsers-message__stop')();
 */
(function () {
  var smileChanges = 0;
  var MAX_SMILE_CHANGES = 50;
  var previousWindowErrorHandler;

  function changeSmileClickListener(event) {
    smileChanges++;

    var eyes = ['O', 'o', '-', '>', '<'];

    var rand = function (min, max) {
      return Math.round((Math.random() * (max - min))) + min;
    };

    var getRandomEye = function () {
      return eyes[rand(0, (eyes.length - 1))];
    };


    var getRandomSmile = function () {
      if (smileChanges >= MAX_SMILE_CHANGES) {
        return '\\\\ (x_x) //';
      }

      return '{{ (' + getRandomEye() + '_' + getRandomEye() + ') }}';
    };

    var target = event.target || event.srcElement;
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

    window.onerror = function (errorMsg, url, lineNumber) {

      if (onOldBrowserDetected) {
        onOldBrowserDetected();
      }

      if (previousWindowErrorHandler) {
        return previousWindowErrorHandler(errorMsg, url, lineNumber);
      }

      return false;
    };
  }

  var activate = function () {
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
  };

  activate();

}());
