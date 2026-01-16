import {act} from 'react';
import {render} from '@testing-library/react';

import {getAllStoryFiles, getStories} from '../test-helpers/get-stories';

vi.mock('../src/loader/loader-core', () => ({
  default: class FakeLoader {
    updateMessage = vi.fn();
    destroy = vi.fn();
  },
}));

beforeAll(() => {
  HTMLDialogElement.prototype.show = vi.fn();
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

const options = {
  suite: 'Console errors',
  // storyNameRegex: /^with deprecated item\.type parameter$/,
};

describe(options.suite, async () => {
  const storyFiles = await getAllStoryFiles();

  storyFiles.forEach(({storyFile, title}) => {
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
          const consoleError = vi.spyOn(global.console, 'error');
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
