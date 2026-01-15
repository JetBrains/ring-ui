/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {getAllStoryFiles, getStories} from '../../test-helpers/get-stories';

// this task has to have more timeout as it sometimes fails on CI
const TEST_TIMEOUT = 15_000;

const dirname = path.dirname(fileURLToPath(import.meta.url));

test(
  'Get stories tree',
  async () => {
    const kinds = {};
    const storyFiles = await getAllStoryFiles();

    storyFiles.forEach(({storyFile, title}) => {
      kinds[title] = {
        kind: title,
        stories: getStories({
          ...storyFile,
          default: {...storyFile.default, title},
        }).map(({name, story}) => ({
          id: story.id,
          name,
          parameters: story.parameters.screenshots,
        })),
      };
    });

    fs.writeFileSync(path.join(dirname, 'testplane/stories.json'), JSON.stringify(Object.values(kinds), null, 2));
    console.log('Tree saved successfully');
  },
  TEST_TIMEOUT,
);
