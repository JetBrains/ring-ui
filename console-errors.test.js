import initStoryshots, {renderWithOptions} from '@storybook/addon-storyshots';
import {act} from 'react-dom/test-utils';

jest.mock('./src/loader/loader__core', () => (
  class FakeLoader {
    updateMessage = jest.fn();
  }
));
jest.mock('./src/old-browsers-message/old-browsers-message');

initStoryshots({
  framework: 'react',
  suite: 'Console errors',
  storyKindRegex: /^((?!Style-only\/Old Browsers Message).)*$/,
  // storyNameRegex: /^with deprecated item\.type parameter$/,
  async test(...args) {
    const consoleError = jest.spyOn(global.console, 'error');
    await act(() => Promise.resolve(renderWithOptions({
      createNodeMock: element => document.createElement(element.type)
    })(...args)));
    expect(consoleError).not.toBeCalled();
  }
});
