/* eslint-disable camelcase */
const path = require('path');

const ip = require('ip');
require('dotenv').config();

const baseUrl = `http://${ip.address()}:9999/`;

const gridUrl =
  process.env.SELENIUM_GRID ||
  `https://${process.env.BROWSERSTACK_NAME}:${process.env.BROWSERSTACK_KEY}@hub-cloud.browserstack.com:443/wd/hub`;
// Supports Firefox
const windowSize = '1024x1000';
const os = 'Windows';
const os_version = '11';
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
    '@jetbrains/testplane-teamcity-reporter': {
      enabled: isTeamCity,
    },
    'html-reporter/testplane': {
      defaultView: 'all',
    },
  },
  screenshotsDir: test =>
    path.join('testplane', test.browserId, test.parent.title.toLowerCase(), test.title.toLowerCase()),
  antialiasingTolerance: 10,

  desiredCapabilities: {
    project: 'Ring UI',
    build: `Screenshots comparison [build ${process.env.BUILD_NUMBER || `local ${Date.now()}`}]`,
    'browserstack.local': true,
  },
  // See all platforms here https://www.browserstack.com/automate/capabilities
  browsers: {
    chrome: {
      httpTimeout: 300000,
      desiredCapabilities: {
        browser: 'Chrome',
        pageLoadStrategy: 'normal',
        browser_version: '127.0',
        chromeOptions: {
          excludeSwitches: ['enable-automation'],
        },
        os,
        os_version,
        maxDuration,
      },
      sessionsPerBrowser: 4,
    },
    firefox: {
      httpTimeout: 300000,
      resetCursor: false, // Prevents grid failure on performing "moveto" command
      screenshotDelay: 500, // Wait while macOS scrollbars disappear
      desiredCapabilities: {
        browser: 'Firefox',
        pageLoadStrategy: 'normal',
        browser_version: '128.0',
        os: 'OS X',
        os_version: 'Sonoma',
        maxDuration,
      },
      sessionEnvFlags: {
        isW3C: true,
      },
      sessionsPerBrowser: 4,
    },
  },
};
