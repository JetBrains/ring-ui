const querystring = require('querystring');

const filenamify = require('filenamify');

const items = require('./stories.json');

const Actions = require('./actions');

function addTestNamesToCaptures(actions, storyName) {
  return actions.map(action => {
    if (action.type === 'capture') {
      return {
        ...action,
        name: `${storyName}${action.name ? `-${action.name}` : ''}`
      };
    }
    return action;
  });
}

for (const {kind, stories} of items) {
  const kindName = kind.
    split(/[|/]/g).
    map(filenamify).
    join('/');
  describe(kindName, () => {
    for (const story of stories) {
      const {name, parameters = {}} = story;
      const testName = filenamify(name);
      const {
        captureSelector = '[id=root]',
        skip,
        actions = [{type: 'capture', name: '', selector: captureSelector}]
      } = parameters;

      const namedActions = addTestNamesToCaptures(actions, name);

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

        for (const action of namedActions) {
          await Actions[action.type](this.browser, action);
        }
      });
    }
  });
}
