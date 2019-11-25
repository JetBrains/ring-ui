import path from 'path';

import initStoryshots from '@storybook/addon-storyshots';
import {axeTest} from '@hypnosphi/addon-storyshots-puppeteer';
import tsm from 'teamcity-service-messages';

const isTeamCity = process.env.TEAMCITY_VERSION != null;

const test = axeTest({
  storybookUrl: isTeamCity ? `file://${path.resolve(__dirname, 'dist')}` : 'http://localhost:9999'
});

initStoryshots({
  framework: 'html',
  suite: 'Accessibility audit',
  test: Object.assign(async (...args) => {
    const {story} = args[0];
    if (isTeamCity) {
      tsm.testMetadata({type: 'artifact', value: `dist.zip!index.html?path=/story/${story.id}`});
    }
    await test(...args);
  }, test)
});
