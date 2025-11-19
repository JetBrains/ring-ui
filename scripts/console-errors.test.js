import {act} from 'react';
import {render} from '@testing-library/react';

import {getAllStoryFiles, getStories} from '../test-helpers/get-stories';

jest.mock(
  '../src/loader/loader-core',
  () =>
    class FakeLoader {
      updateMessage = jest.fn();
      destroy = jest.fn();
    },
);

const options = {
  suite: 'Console errors',
  // storyNameRegex: /^with deprecated item\.type parameter$/,
};

describe(options.suite, () => {
  getAllStoryFiles().forEach(({storyFile, title}) => {
    const meta = storyFile.default;

    if ((options.storyKindRegex && !options.storyKindRegex.test(title)) || meta.parameters?.storyshots?.disable) {
      return;
    }

    describe(title, () => {
      const stories = getStories(storyFile).filter(
        ({name, story}) =>
          (!options.storyNameRegex || options.storyNameRegex.test(name)) && !story.parameters.storyshots?.disable,
      );

      stories.forEach(({name, story}) => {
        test(name, async () => {
          const consoleError = jest.spyOn(global.console, 'error');
          const Component = story;
          render(<Component />);
          // eslint-disable-next-line max-nested-callbacks
          await act(() => Promise.resolve());
          expect(consoleError).not.toHaveBeenCalled();
        });
      });
    });
  });
});
