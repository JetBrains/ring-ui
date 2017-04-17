const hostname = require('os').hostname();
const fullHostname = hostname.indexOf('.') !== -1 ? hostname : `${hostname}.labs.intellij.net`;
const rootUrl = `http://${fullHostname}:9999/examples/`;

const gridUrl = process.env.SELENIUM_GRID || '***REMOVED***';
// Supports Firefox
const windowSize = '1024x1000';

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
        browserName: 'chrome',
        version: '57.0'
      }
    },
    firefox: {
      windowSize,
      desiredCapabilities: {
        browserName: 'firefox',
        version: '47.0'
      }
    },
    ie: {
      windowSize,
      desiredCapabilities: {
        browserName: 'internet explorer'
      }
    },
    edge: {
      windowSize,
      desiredCapabilities: {
        browserName: 'MicrosoftEdge'
      }
    }
  }
};
