import initStoryshots, {renderOnly} from '@storybook/addon-storyshots';
import {act} from 'react-dom/test-utils';

jest.mock('./components/loader/loader__core', () => (
  class FakeLoader {
    updateMessage = jest.fn();
  }
));
jest.mock('./components/old-browsers-message/old-browsers-message');

initStoryshots({
  framework: 'html',
  suite: 'Console errors',
  storyKindRegex: /^((?!Style-only\/Old Browsers Message).)*$/,
  // storyNameRegex: /^Basic$/,
  async test(...args) {
    const consoleError = jest.spyOn(global.console, 'error');
    await act(() => Promise.resolve(renderOnly(...args)));
    expect(consoleError).not.toBeCalled();
  }
});
