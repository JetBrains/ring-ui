const path = require('path');

const Docpack = require('docpack');
const slug = require('url-slug');
const {emitAsset} = require('webpack-toolkit');
const pkg = require('ring-ui/package.json');

const HOOKS = Docpack.HOOKS;
const ringUiPath = path.dirname(require.resolve('ring-ui'));

/**
 * @param {Object} data.
 * @returns {string}
 */
function toJSONString(data) {
  const JSON_FORMATTER_WHITESPACES = 2;
  return JSON.stringify(data, null, JSON_FORMATTER_WHITESPACES);
}

/**
 * @param {Example} example
 * @see {docpack/lib/data/Example.js}
 * @returns {Object}
 */
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

/**
 * @param {Source} source
 * @see {docpack/lib/data/Source.js}
 * @returns {Object}
 */
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

/**
 * @param {Array<Source>} sources
 * @param {string} category
 * @returns {Array<Object>}
 */
function createCategoryItemsFromSources(sources, category) {
  return sources.
    filter(({attrs}) => attrs.category && attrs.category === category).
    map(source => {
      const {title, url, attrs} = serializeSource(source);
      return {
        url,
        title,
        legacy: attrs.tags !== '3.0',
        order: attrs.order
      };
    });
}

/**
 * @param {Object} a Category object.
 * @param {Object} b Category object.
 * @returns {number}
 */
function categoriesSorter(a, b) {
  const aName = a.name;
  const bName = b.name;
  let order = 0;

  if (aName === 'Docs' || aName < bName) {
    order = -1;
  }

  if (bName === 'Docs' || aName > bName) {
    order = 1;
  }

  return order;
}

/**
 * @param {Object} a Category item object.
 * @param {Object} b Category item object.
 * @returns {number}
 */
function categoryItemsSorter(a, b) {
  const aOrder = typeof a.order !== 'undefined' ? a.order : (a.title || '');
  const bOrder = typeof b.order !== 'undefined' ? b.order : (b.title || '');

  if (aOrder === bOrder) {
    return 0;
  }

  return aOrder < bOrder ? -1 : 1;
}

/**
 * Creates navigation object.
 * @param {Array<Source>} sources
 * @returns {Array<Object>}
 */
function createNav(sources) {
  const defaultCategory = 'Uncategorized';

  const sourcesByCategories = sources.
    // get category names
    reduce((categories, source) => categories.
      concat(source.attrs.category || defaultCategory), []).

    // remove duplicates
    filter((value, i, self) => self.indexOf(value) === i).

    // create category object and fill it with related sources
    reduce((categories, categoryName) => {
      categories.push({
        name: categoryName,
        items: createCategoryItemsFromSources(sources, categoryName)
      });
      return categories;
    }, []);

  sourcesByCategories.sort(categoriesSorter);
  sourcesByCategories.
    forEach(category => category.items.sort(categoryItemsSorter));

  return sourcesByCategories;
}

module.exports = dllPath => {
  const docpack = new Docpack({
    test: /\.(js|scss|md)$/,
    include: [
      path.resolve(ringUiPath, 'components'),
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

  docpack.
    use(require('docpack-markdown-extractor')({files: '{README,docs/*}.md'}));

  docpack.use(require('docpack-examples-compiler')({
    applyParentCompilerPlugins: true,
    filename: path.resolve(ringUiPath, 'components/example.[type]'),
    outputFilename: 'examples/[name]/[hash]',
    filter: example =>
      !example.attrs.hasOwnProperty('compile') ||
      example.attrs.compile !== 'false'
  }));

  // Generate example pages
  docpack.use(require('docpack-page-generator')({
    template: path.resolve(__dirname, 'example.twig'),

    url: example => (`examples/[name]/${example.attrs.name ? slug(example.attrs.name) : '[hash]'}.html`),

    select: sources =>
      sources.reduce((examples, source) => {
        const sourceExamples = source.getExamples();
        sourceExamples.forEach(
          example => (example.absolutePath = source.absolutePath)
        );
        return examples.concat(sourceExamples);
      }, []),

    context: (examples, currentExample) => ({example: currentExample, dllPath})
  }));

  // Generate pages
  docpack.use(
    require('docpack-page-generator')({
      template: path.resolve(__dirname, 'page.twig'),
      url: '[name].html',
      select: sources =>
        sources.filter(
          source => source.getExamples().length > 0 || source.type === 'md'
        ),
      context: (sources, source) => ({source, dllPath})
    })
  );


  docpack.use(HOOKS.BEFORE_GENERATE, function generateJSON(sources, done) {
    const DATE_STRING_LENGTH = 16;
    const hasPage = source => source.hasOwnProperty('page');

    const buildDate = new Date().
      toISOString().
      replace('T', ' ').
      substr(0, DATE_STRING_LENGTH);
    const navCategories = createNav(docpack.sources.filter(hasPage));

    const nav = {
      buildDate,
      version: pkg.version,
      categories: navCategories
    };

    emitAsset(this, 'nav.json', toJSONString(nav));

    sources.filter(hasPage).forEach(source => {
      const data = serializeSource(source);
      const filename = data.url.replace('.html', '.json');
      emitAsset(this, filename, toJSONString(data));

      source.jsonURL = filename;
    });

    done(null, sources);
  });

  return docpack;
};
