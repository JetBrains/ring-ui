require('./supported-browsers.scss');
var attachSmileChanger = require('./supported-browsers__smiles');

var supportedDifference = 2;
var latestVersions = {
  Chrome: 39,
  Firefox: 35,
  Safari: 8,
  Opera: 26,
  IE: 11
};

function getUserAgent() {
  var ua = navigator.userAgent;
  var tem = null;
  var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])){
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {
      name: 'IE',
      version: (tem[1] || '')
    };
  }
  if (M[1] === 'Chrome'){
    tem = ua.match(/\bOPR\/(\d+)/);
    if (tem !== null) {
      return {
        name: 'Opera',
        version: tem[1]
      };
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

  tem = ua.match(/version\/(\d+)/i);
  if (tem !== null) {
    M.splice(1, 1, tem[1]);
  }
  return {
    name: M[0],
    version: M[1]
  };
}

function attachEvent(object, event, func) {
  if (object.addEventListener) {
    return object.addEventListener(event, func, false);
  } else if (object.attachEvent) {
    return object.attachEvent('on' + event, func);
  }
  return false;
}

function createBlock() {
  document.body.innerHTML =
    '<div id="ring-unsupported-browser__message" class="ring-unsupported-browser__message ring-unsupported-browser__message_hidden">' +
      '<span class="ring-unsupported-browser__message-smile">{{ (>_<) }}</span>' +
      '<br/><br/>' +
      'This version of %browserName% is not <a href="https://confluence.jetbrains.com/display/HUBD/Supported+Environment">supported by HUB</a>.' +
      '<br/>' +
      'Try upgrading to the latest stable version.' +
      '<br/><br/>' +
      '<span browser="IE">If you use IE9.0 or higher, make sure that compatibility mode is disabled.</span>' +
    '</div>';
}

var smileChanges = 0;
function changeSmile(event) {
  smileChanges++;

  var eyes = ['O', 'o', '-', '>', '<'];

  var rand = function (min, max) {
    return Math.round((Math.random() * (max - min))) + min;
  };

  var getRandomEye = function() {
    return eyes[rand(0, (eyes.length - 1))];
  };


  var getRandomSmile = function() {
    if (smileChanges >= 100) {
      return '\\\\ (x_x) //';
    }

    return '{{ (' + getRandomEye() + '_' + getRandomEye() + ') }}';
  };

  var target = event.target || event.srcElement;
  target.innerHTML = getRandomSmile();
}

function checkNodes(node, browserName) {
  if (node.className === 'ring-unsupported-browser__message-smile') {
    attachSmileChanger(node);
  }

  if (node.attributes) {
    for (var i = 0; i < node.attributes.length; i++) {
      var attr = node.attributes[i];
      if (attr.nodeName === 'browser') {
        var attrValue = attr.nodeValue || attr.value;

        if (!attrValue) {
          continue;
        }

        if (attrValue.indexOf('!') !== -1) {
          attrValue = attrValue.substr(0, 1);
          if (attrValue === browserName) {
            node.parentNode.removeChild(node);
          }
        } else if (attrValue !== browserName) {
          node.parentNode.removeChild(node);
        }
      }
    }
  }

  if (!node.childNodes) {
    return;
  }

  for (var j = 0; j < node.childNodes.length; j++) {
    checkNodes(node.childNodes[j], browserName);
  }
}

function checkBrowser() {
  var block = document.getElementById('ring-unsupported-browser__message');
  var userAgent = getUserAgent();
  if (userAgent.name && latestVersions[userAgent.name] && userAgent.version &&
    (latestVersions[userAgent.name] - userAgent.version > supportedDifference)) {
    if (!block) {
      createBlock();
      block = document.getElementById('ring-unsupported-browser__message');
    }
    block.innerHTML = block.innerHTML
      .replace(new RegExp('%browserName%', 'g'), userAgent.name)
      .replace(new RegExp('%currentVersion%', 'g'), userAgent.version)
      .replace(new RegExp('%lastVersion%', 'g'), latestVersions[userAgent.name]);
    checkNodes(block, userAgent.name);
    block.style.display = 'block';
  } else if (block) {
    block.style.display = 'none';
  }
}

attachEvent(window, 'load', checkBrowser);
