const ip = require('ip');

const rootUrl = `http://${ip.address()}:9999/examples/`;

const gridUrl = process.env.SELENIUM_GRID || 'http://ondemand.saucelabs.com/wd/hub';
// Supports Firefox
const windowSize = '1024x1000';
const WIN10 = 'Windows 10';
const RELAXED_TOLERANCE = 4;

console.log('Docsite url detected:', rootUrl);
console.log('Grid at:', gridUrl);

module.exports = {
  rootUrl,
  gridUrl,
  retry: 2,
  suitesPerSession: 100, // workaround for Gemini bug
  compositeImage: true,
  system: {
    plugins: {
      '@jetbrains/gemini-teamcity': process.argv.indexOf('--teamcity') !== -1,
      'html-reporter/gemini': {
        defaultView: 'all'
      },
      sauce: {
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        logfile: 'saucelabs-session.log',
        connectRetries: 3,
      }
    },
    projectRoot: __dirname
  },
  // See all platforms here https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
  browsers: {
    chrome: {
      windowSize,
      desiredCapabilities: {
        browserName: 'chrome',
        version: '72.0',
        platform: WIN10
      }
    },
    firefox: {
      windowSize,
      desiredCapabilities: {
        browserName: 'firefox',
        version: '47.0',
        platform: WIN10
      }
    },
    ie: {
      windowSize,
      desiredCapabilities: {
        browserName: 'internet explorer',
        version: '11.309',
        platform: WIN10
      }
    },
    edge: {
      windowSize,
      desiredCapabilities: {
        browserName: 'MicrosoftEdge',
        version: '17.17134',
        platform: WIN10,
        tolerance: RELAXED_TOLERANCE
      }
    }
  }
};
