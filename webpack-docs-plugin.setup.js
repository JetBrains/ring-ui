/* eslint-env node */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */
/* eslint-disable camelcase */

const path = require('path');
const Docpack = require('docpack');
const slug = require('url-slug');
const pkg = require('./package.json');
const emitAsset = require('webpack-toolkit').emitAsset;

const HOOKS = Docpack.HOOKS;

function serializeExample(example) {
  return {
    name: example.attrs.name,
    url: example.page.url,
    files: example.files.map(file => ({
      type: file.type,
      content: file.content,
      showCode: file.attrs['show-code'] !== 'false'
    }))
  };
}

function serializeSource(source) {
  const attrs = source.attrs;

  return {
    title: attrs.name || attrs.title,
    url: source.page.url,
    type: source.type,
    content: source.content,
    examples: source.getExamples().map(serializeExample),
    description: attrs.description,
    attrs
  };
}

function sortCategoryItems(items) {
  // eslint-disable-next-line complexity
  return items.sort((a, b) => {
    const aAttrs = a.attrs;
    const bAttrs = b.attrs;
    const aOrder = typeof aAttrs.order !== 'undefined' ? aAttrs.order : (aAttrs.name || aAttrs.title || '');
    const bOrder = typeof bAttrs.order !== 'undefined' ? bAttrs.order : (bAttrs.name || bAttrs.title || '');

    if (aOrder === bOrder) {
      return 0;
    }

    return aOrder < bOrder ? -1 : 1;
  });
}

function groupSourcesByCategory(sources) {
  const defaultCategory = 'Uncategorized';

  const sourcesByCategories = sources.
    // get category names
    reduce((categories, source) => categories.concat(source.attrs.category || defaultCategory), []).

    // remove duplicates
    filter((value, i, self) => self.indexOf(value) === i).

    // create category object and fill it with related sources
    reduce((categories, categoryName) => {
      categories.push({
        name: categoryName,
        items: sources.filter(source => source.attrs.category && source.attrs.category === categoryName)
      });
      return categories;
    }, []);

  sourcesByCategories.forEach(category => sortCategoryItems(category.items));

  return sourcesByCategories;
}

module.exports = () => {
  const docpack = new Docpack({
    test: /\.(js|scss|md)$/,
    include: [
      path.resolve(__dirname, 'components'),
      /\.md$/
    ]
  });

  docpack.use(require('docpack-jsdoc-extractor')({
    match: /\.(js|scss)$/,
    parseMarkdown: false
  }));

  docpack.use(HOOKS.AFTER_EXTRACT, (sources, done) => {
    sources.
      reduce((examples, source) => examples.concat(source.getExamples()), []).
      forEach(example => {
        example.files.forEach(file => {
          file.type = file.attrs.type || file.attrs.name.split('.')[1] || 'js';
        });
      });

    done(null, sources);
  });

  docpack.use(require('docpack-markdown-extractor')({files: '{README,docs/*}.md'}));

  docpack.use(require('docpack-examples-compiler')({
    applyParentCompilerPlugins: true,
    filename: path.resolve(__dirname, 'components/example.[type]'),
    outputFilename: 'examples/[name]/[hash]',
    filter: example => (!example.attrs.hasOwnProperty('compile') || example.attrs.compile !== 'false')
  }));

  // Generate example pages
  docpack.use(require('docpack-page-generator')({
    template: path.resolve(__dirname, 'site/example.twig'),

    url: example => (`examples/[name]/${example.attrs.name ? slug(example.attrs.name) : '[hash]'}.html`),

    select: sources => sources.reduce((examples, source) => {
      const sourceExamples = source.getExamples();
      sourceExamples.forEach(example => (example.absolutePath = source.absolutePath));
      return examples.concat(sourceExamples);
    }, []),

    context: (examples, currentExample) => ({example: currentExample})
  }));

  // Generate pages
  docpack.use(require('docpack-page-generator')({
    template: path.resolve(__dirname, 'site/page.twig'),
    url: '[name].html',
    select: sources => sources.filter(source => source.getExamples().length > 0 || source.type === 'md')
  }));


  docpack.use(HOOKS.AFTER_GENERATE, function generateNavData(sources, done) {
    const DATE_STRING_LENGTH = 16;
    const JSON_FORMATTER_WHITESPACES = 2;

    const buildDate = new Date().toISOString().replace('T', ' ').substr(0, DATE_STRING_LENGTH);
    const serialized = docpack.sources.filter(s => s.hasOwnProperty('page')).map(serializeSource);
    const sourcesByCategory = groupSourcesByCategory(serialized);
    const data = {
      sources: serialized,
      sourcesByCategory,
      buildDate,
      version: pkg.version
    };

    emitAsset(this, 'data.json', JSON.stringify(data, null, JSON_FORMATTER_WHITESPACES));
    done(null, sources);
  });

  return docpack;
};
