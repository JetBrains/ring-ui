import path from 'path';

import * as glob from 'glob';
import {composeStories} from '@storybook/react';
import {storyNameFromExport} from '@storybook/csf';

export function getAllStoryFiles() {
  const srcDir = path.resolve(__dirname, '../src');
  const storyFiles = glob.sync(path.join(srcDir, '**/*.stories.{js,ts,tsx}'));

  return storyFiles.map(filePath => {
    const storyFile = require(filePath);
    const componentName = path.basename(filePath).replace(/\.stories\.\w*$/, '');
    const dirName = path.dirname(filePath);
    const title =
      storyFile.default.title ||
      (dirName === srcDir
        ? componentName
        : path.relative(
          srcDir,
          path.basename(dirName) === componentName
            ? dirName
            : path.join(dirName, componentName),
        ));
    return {storyFile, title};
  });
}

const getStoryName = originalStory => (typeof originalStory === 'function'
  ? storyNameFromExport(originalStory.name)
  : originalStory.name);

export const getStories = storyFile =>
  Object.entries(composeStories(storyFile)).map(([name, story]) => {
    const originalStory = storyFile[name];

    return {
      name: originalStory.storyName ?? (
        originalStory.name != null
          ? getStoryName(originalStory)
          : storyNameFromExport(name)
      ),
      story
    };
  });
