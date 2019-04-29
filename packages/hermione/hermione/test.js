const querystring = require('querystring');

const filenamify = require('filenamify');

const items = require('./stories.json');

const TIMEOUT = 1000;

const defaultParameters = {
  captureSelector: '[id=root]'
};

for (const {kind, stories} of items) {
  const kindName = kind.
    split(/[|/]/g).
    map(filenamify).
    join('/');
  describe(kindName, () => {
    for (const story of stories) {
      const {name, parameters} = story;
      const testName = filenamify(name);
      const {captureSelector, skip, waitElements} = {
        ...defaultParameters,
        ...parameters
      };

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

        if (waitElements) {
          try {
            await this.browser.waitForVisible(captureSelector, TIMEOUT);
            await Promise.all(
              Object.entries(waitElements).map(([selector, visible]) =>
                this.browser.waitForVisible(selector, TIMEOUT, !visible),
              ),
            );
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
          }
        }

        await this.browser.assertView(testName.toLowerCase(), captureSelector);
      });
    }
  });
}
