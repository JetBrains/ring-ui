var ReactTools = require('react-tools');

module.exports = {
  process: function(src, path) {
    if (path.match(/\.scss$/)) {
      return '';
    }
    return ReactTools.transform(src);
  }
};