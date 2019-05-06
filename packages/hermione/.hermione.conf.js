const path = require('path');

const ip = require('ip');

const baseUrl = `http://${ip.address()}:9999/`;

const gridUrl = process.env.SELENIUM_GRID ||
  `http://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@ondemand.saucelabs.com/wd/hub`;
// Supports Firefox
const windowSize = '1024x1000';
const WIN10 = 'Windows 10';
const RELAXED_TOLERANCE = 4;
const maxDuration = 3600;
const isTeamCity = process.argv.indexOf('--teamcity') !== -1;

// eslint-disable-next-line no-console
console.log('Storybook url detected:', baseUrl);

module.exports = {
  baseUrl,
  gridUrl,
  // eslint-disable-next-line no-magic-numbers
  retry: isTeamCity ? 2 : 0,
  testsPerSession: 100,
  compositeImage: true,
  windowSize,
  plugins: {
    '@jetbrains/hermione-teamcity-reporter': {
      enabled: isTeamCity
    },
    'html-reporter/hermione': {
      defaultView: 'all'
    }
  },
  screenshotsDir: test =>
    path.join('hermione', test.browserId, test.parent.title.toLowerCase()),
  // See all platforms here https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        version: '74.0',
        platform: WIN10,
        maxDuration
      }
    },
    firefox: {
      resetCursor: false, // Prevents SauceLabs failure on performing "moveto" command
      desiredCapabilities: {
        browserName: 'firefox',
        version: '66.0',
        platform: WIN10,
        maxDuration
      }
    },
    ie: {
      testsPerSession: 20,
      desiredCapabilities: {
        browserName: 'internet explorer',
        version: '11.309',
        platform: WIN10,
        maxDuration
      }
    },
    edge: {
      tolerance: RELAXED_TOLERANCE,
      antialiasingTolerance: RELAXED_TOLERANCE,
      desiredCapabilities: {
        browserName: 'MicrosoftEdge',
        version: '17.17134',
        platform: WIN10,
        maxDuration
      }
    }
  }
};
