const querystring = require('querystring');

const filenamify = require('filenamify');

const items = require('./stories.json');

const Actions = require('./actions');

function addTestName(name, storyName) {
  return `${storyName}${name ? `-${name}` : ''}`;
}

for (const {kind, stories} of items) {
  const kindName = kind.
    split(/[|/]/g).
    map(filenamify).
    join('/');
  describe(kindName, () => {
    for (const story of stories) {
      const {name, displayName, parameters = {}} = story;
      const testName = filenamify(displayName);
      const {
        captureSelector = '[id=root]',
        skip,
        actions = [{type: 'capture', name: '', selector: captureSelector}]
      } = parameters;

      if (skip) {
        continue;
      }

      it(testName, async function test() {
        await this.browser.url(
          `iframe.html?${querystring.stringify({
            selectedKind: kind,
            selectedStory: name
          })}&block-animations`,
        );

        for (const action of actions) {
          await Actions[action.type](
            this.browser,
            {...action, name: addTestName(action.name, displayName)}
          );
        }
      });
    }
  });
}
