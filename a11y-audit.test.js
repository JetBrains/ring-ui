import path from 'path';

import initStoryshots from '@storybook/addon-storyshots';
import {axeTest} from '@storybook/addon-storyshots-puppeteer';
import tsm from 'teamcity-service-messages';

const isTeamCity = process.env.TEAMCITY_VERSION != null;

const test = axeTest({
  storybookUrl: isTeamCity ? `file://${path.resolve(__dirname, 'dist')}` : 'http://localhost:9999',
  customizePage: page => page.setViewport({width: 1000, height: 600})
});

const suite = 'Accessibility audit';

initStoryshots({
  framework: 'html',
  suite,
  // storyKindRegex: /^Legacy Angular\|ShortcutsHint Ng$/,
  // storyNameRegex: /^Simple$/,
  test: Object.assign(async (...args) => {
    const {story} = args[0];
    if (isTeamCity) {
      tsm.testMetadata({testName: `${suite} ${story.kind} ${story.name}`, type: 'artifact', value: `dist.zip!index.html?path=/story/${story.id}`});
    }
    await test(...args);
  }, test)
});
