define(function(require) {
  var IEVersion;

  // Sometimes we need exact IE version to detect quirks (not features)
  // Adopted from https://gist.github.com/padolsey/527683
  require('jquery')(function () {
    // documentMode  === 5 indicates just quirks mode
    if (document.documentMode > 5) {
      IEVersion = document.documentMode;
      return;
    }

    var version = 3;
    var div = document.createElement('div');
    var all = div.getElementsByTagName('i');

    while (
      div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
        all[0]
      ) {
    }

    if (version > 4) {
      IEVersion = version;
    }
  });

  return {
    getIEVersion: function() {
      return IEVersion;
    }
  };
});