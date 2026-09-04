/* global testplane */
import querystring from 'querystring';
import filenamify from 'filenamify';

import Actions from './actions.js';

// eslint-disable-next-line import/no-unresolved
import items from './stories.json' with {type: 'json'};

function addTestName(name, storyName) {
  return `${storyName}${name ? `-${name}` : ''}`;
}

for (const {kind, stories} of items) {
  const kindName = kind.split(/\//g).map(filenamify).join('/');
  describe(kindName, () => {
    for (const story of stories) {
      const {name, id, parameters = {}} = story;
      const testName = filenamify(name);
      const {
        captureSelector = '[id=storybook-root]',
        skip,
        actions = [{type: 'capture', name: '', selector: captureSelector}],
      } = parameters;

      const storyCaptureSelector = actions.findLast(action => action.type === 'capture')?.selector ?? captureSelector;

      const allActions = [
        ...actions,
        {type: 'setDarkTheme'},
        {type: 'capture', name: 'dark', selector: storyCaptureSelector},
      ];

      if (skip === true) {
        continue;
      }
      if (skip) {
        testplane.skip.in(skip);
      }

      it(testName, async function test() {
        // eslint-disable-next-line no-invalid-this
        await this.browser.url(
          `iframe.html?${querystring.stringify({id, 'block-animations': true, 'block-auth': true})}`,
        );

        for (const action of allActions) {
          // eslint-disable-next-line no-invalid-this
          await Actions[action.type](this.browser, {...action, name: addTestName(action.name, name)});
        }
      });
    }
  });
}
