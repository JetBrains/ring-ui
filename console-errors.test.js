import initStoryshots, {renderOnly} from '@storybook/addon-storyshots';

jest.mock('./components/loader/loader__core');

initStoryshots({
  framework: 'html',
  suite: 'Console errors',
  // storyKindRegex: /^Components\|Loader$/,
  // storyNameRegex: /^Basic$/,
  async test(...args) {
    const consoleError = jest.spyOn(global.console, 'error');
    await renderOnly(...args);
    expect(consoleError).not.toBeCalled();
    consoleError.mockRestore();
  }
});
