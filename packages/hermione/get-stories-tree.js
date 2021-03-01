/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

import loadFramework from '@storybook/addon-storyshots/dist/ts3.9/frameworks/frameworkLoader';

test('Get stories tree', () => {
  const {storybook} = loadFramework({framework: 'html'});
  const kinds = {};
  storybook.raw().forEach(({kind, id, name, parameters}) => {
    kinds[kind] = kinds[kind] || {kind, stories: []};
    kinds[kind].stories.push({
      id,
      name,
      parameters: parameters.hermione
    });
  });

  fs.writeFileSync(
    path.join(__dirname, 'hermione/stories.json'),
    // eslint-disable-next-line no-magic-numbers
    JSON.stringify(Object.values(kinds), null, 2),
  );
  console.log('Tree saved successfully');
});
