/* eslint-disable no-console */
const fs = require('fs');

const program = require('commander');
const {JSDOM, ResourceLoader, VirtualConsole} = require('jsdom');

program.
  option('-v, --verbose', 'Pass browser console to stdout').
  allowUnknownOption().
  parse(process.argv);

const virtualConsole = new VirtualConsole();
if (program.verbose) {
  virtualConsole.sendTo(console);
}

const STORYBOOK_CLIENT_API = '__STORYBOOK_CLIENT_API__';

const getTree = window => {
  const api = window[STORYBOOK_CLIENT_API];
  const tree = api.getStorybook();

  if (tree.length === 0) {
    console.error('No stories found. Run `node get-stories-tree -v` to find out why');
    process.exit(1);
  }

  const simpleTree = tree.map(item =>
    Object.assign({}, item, {
      stories: item.stories.map(({name}) => {
        const {parameters} =
          api._storyStore.getStoryAndParameters(item.kind, name);
        return {
          name,
          displayName: parameters.displayName || name,
          parameters: parameters.hermione
        };
      })
    }),
  );
  fs.writeFileSync(
    'hermione/stories.json',
    // eslint-disable-next-line no-magic-numbers
    JSON.stringify(simpleTree, null, 2),
  );
  if (program.verbose) {
    console.log(simpleTree);
  }
  console.log('Tree saved successfully');
  window.close();
};

const resourceLoader = new ResourceLoader({
  // Prevent Storybook from treating us as JSDOM
  userAgent: 'fakeAgent'
});

module.exports = JSDOM.fromURL('http://localhost:9999/iframe.html', {
  resources: resourceLoader,
  runScripts: 'dangerously',
  virtualConsole
}).
  then(({window}) => {
    window.document.addEventListener('DOMContentLoaded', () => {
      getTree(window);
    });
    const {querySelectorAll} = window.document;
    // eslint-disable-next-line func-names
    window.document.querySelectorAll = function () {
      try {
        return querySelectorAll.apply(this, arguments);
      } catch (e) {
        return [];
      }
    };
  }).
  catch(e => {
    throw e;
  });
