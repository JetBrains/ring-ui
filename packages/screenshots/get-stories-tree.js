/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

import {getAllStoryFiles, getStories} from '../../test-helpers/get-stories';

test('Get stories tree', () => {
  const kinds = {};
  getAllStoryFiles().forEach(({storyFile, title}) => {
    kinds[title] = {
      kind: title,
      stories: getStories({
        ...storyFile,
        default: {...storyFile.default, title}
      }).map(
        ({name, story}) => ({
          id: story.id,
          name,
          parameters: story.parameters.screenshots
        }),
      )
    };
  });

  fs.writeFileSync(
    path.join(__dirname, 'screenshots/stories.json'),
    // eslint-disable-next-line no-magic-numbers
    JSON.stringify(Object.values(kinds), null, 2),
  );
  console.log('Tree saved successfully');
});
