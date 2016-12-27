const hostname = require('os').hostname();
const fullHostname = hostname.indexOf('.') !== -1 ? hostname : `${hostname}.labs.intellij.net`;
const rootUrl = `http://${fullHostname}:9999`;

const gridUrl = process.env.SELENIUM_GRID || '***REMOVED***';
const windowSize = '1024x800';

console.log('Docsite url detected:', rootUrl);
console.log('Grid at:', gridUrl);

module.exports = {
  rootUrl,
  gridUrl,
  retry: 2,
  suitesPerSession: 100, // workaround for Gemini bug
  system: {
    plugins: {
      teamcity: process.argv.indexOf('--teamcity') !== -1
    },
    projectRoot: __dirname
  },
  browsers: {
    chrome: {
      windowSize,
      desiredCapabilities: {
        browserName: 'chrome'
      }
    },
    firefox: {
      windowSize,
      desiredCapabilities: {
        browserName: 'firefox'
      }
    },
    ie: {
      windowSize,
      desiredCapabilities: {
        browserName: 'internet explorer'
      }
    }
  }
};
