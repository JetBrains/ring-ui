import initStoryshots, {renderOnly} from '@storybook/addon-storyshots';

jest.mock('./components/loader/loader__core');
jest.mock('./components/old-browsers-message/old-browsers-message');

initStoryshots({
  framework: 'html',
  suite: 'Console errors',
  storyKindRegex: /^Components\|Icon$/,
  // storyNameRegex: /^Basic$/,
  async test(...args) {
    const consoleError = jest.spyOn(global.console, 'error');
    await renderOnly(...args);
    expect(consoleError).not.toBeCalled();
  }
});
