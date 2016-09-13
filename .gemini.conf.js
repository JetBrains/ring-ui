const hostname = require('os').hostname();
const fullHostname = hostname.indexOf('.') !== -1 ? hostname : `${hostname}.labs.intellij.net`;
const rootUrl = `http://${fullHostname}:9999`;

console.log('Docsite url detected:', rootUrl);

module.exports = {
  rootUrl,
  gridUrl: '***REMOVED***',
  retry: 5,
  system: {
    plugins: {
      teamcity: process.argv.indexOf('--teamcity') !== -1
    },
    projectRoot: __dirname
  },
  desiredCapabilities: {
    windowSize: '1024x800',
    platform: 'WINDOWS'
  },
  browsers: {
    chrome: {
      windowSize: '1024x800',
      desiredCapabilities: {
        browserName: 'chrome'
      }
    },
    firefox: {
      windowSize: '1024x800',
      desiredCapabilities: {
        browserName: 'firefox'
      }
    },
    ie: {
      windowSize: '1024x800',
      desiredCapabilities: {
        browserName: 'internet explorer'
      }
    }
  }
};
