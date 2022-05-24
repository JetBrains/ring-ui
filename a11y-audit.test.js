import path from 'path';
import fs from 'fs';

import Puppeteer from 'puppeteer';

import initStoryshots from '@storybook/addon-storyshots';
import {axeTest} from '@storybook/addon-storyshots-puppeteer';

const isTeamCity = process.env.TEAMCITY_VERSION != null;

let browser;
beforeAll(async () => {
  // Customized like said in https://github.com/puppeteer/puppeteer/issues/1947#issuecomment-879500626
  browser = await Puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process'],
    headless: true
  });
});

const test = axeTest({
  storybookUrl: isTeamCity ? `file://${path.resolve(__dirname, 'storybook-dist')}` : 'http://localhost:9999?block-auth',
  customizePage: page => page.setViewport({width: 1000, height: 600}),
  testTimeout: 20000,
  getCustomBrowser: () => browser
});

const suite = 'Accessibility audit';

const metadataMessages = [];
initStoryshots({
  framework: 'html',
  suite,
  // storyKindRegex: /^Legacy Angular\|Sidebar Ng$/,
  // storyNameRegex: /^Simple$/,
  test: Object.assign(async (...args) => {
    const {story} = args[0];
    if (isTeamCity) {
      metadataMessages.push({testName: `${path.basename(__filename)}: ${suite}: ${story.kind}: ${story.name}`, type: 'artifact', value: `storybook-dist.zip!/index.html?path=/story/${story.id}`});
    }
    await test(...args);
  }, test)
});

afterAll(() => {
  browser.close();
});

if (isTeamCity) {
  afterAll(done =>
    fs.writeFile(
      'metadata-messages.json',
      JSON.stringify(metadataMessages),
      done
    ));
}
