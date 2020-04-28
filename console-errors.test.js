import initStoryshots, {renderOnly} from '@storybook/addon-storyshots';
import {act} from 'react-dom/test-utils';

jest.mock('./components/loader/loader__core', () => (
  class FakeLoader {
    updateMessage = jest.fn()
  }
));
jest.mock('./components/old-browsers-message/old-browsers-message');

initStoryshots({
  framework: 'html',
  suite: 'Console errors',
  // storyKindRegex: /^Components\|Icon$/,
  // storyNameRegex: /^Basic$/,
  async test(...args) {
    const consoleError = jest.spyOn(global.console, 'error');
    await act(async () => renderOnly(...args));
    expect(consoleError).not.toBeCalled();
  }
});
