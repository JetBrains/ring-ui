/* global hermione */
const querystring = require('querystring');

const filenamify = require('filenamify');

const items = require('./stories.json');

const Actions = require('./actions');

function addTestName(name, storyName) {
  return `${storyName}${name ? `-${name}` : ''}`;
}

for (const {kind, stories} of items) {
  const kindName = kind.
    split(/\//g).
    map(filenamify).
    join('/');
  describe(kindName, () => {
    for (const story of stories) {
      const {name, id, parameters = {}} = story;
      const testName = filenamify(name);
      const {
        captureSelector = '[id=root]',
        skip,
        actions = [{type: 'capture', name: '', selector: captureSelector}]
      } = parameters;

      if (skip === true) {
        continue;
      }
      if (skip) {
        hermione.skip.in(skip);
      }

      it(testName, async function test() {
        await this.browser.url(
          `iframe.html?${querystring.stringify({id, 'block-animations': true, 'block-auth': true})}`,
        );

        for (const action of actions) {
          await Actions[action.type](
            this.browser,
            {...action, name: addTestName(action.name, name)}
          );
        }
      });
    }
  });
}
