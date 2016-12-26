const hostname = require('os').hostname();
const fullHostname = hostname.indexOf('.') !== -1 ? hostname : `${hostname}.labs.intellij.net`;
const rootUrl = `http://${fullHostname}:9999`;

const gridUrl = process.env.SELENIUM_GRID || '***REMOVED***';

console.log('Docsite url detected:', rootUrl);
console.log('Grid at:', gridUrl);

module.exports = {
  rootUrl,
  gridUrl,
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
