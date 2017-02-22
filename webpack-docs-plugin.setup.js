/* eslint-env node */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */
/* eslint-disable camelcase */

const path = require('path');
const Docpack = require('docpack');
const slug = require('url-slug');
const pkg = require('./package.json');

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

  docpack.use(Docpack.HOOKS.AFTER_EXTRACT, (sources, done) => {
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
    select: sources => sources.filter(source => source.getExamples().length > 0 || source.type === 'md'),
    context: sources => {
      const categories = {Docs: []};
      const defaultCategory = 'Uncategorized';

      sources.forEach(source => {
        const category = (source.attrs.category || defaultCategory);
        if (!Array.isArray(categories[category])) {
          categories[category] = [];
        }

        categories[category].push(source);
      });

      Object.keys(categories).forEach(category => {
        // eslint-disable-next-line complexity
        categories[category].sort((a, b) => {
          const aAttrs = a.attrs;
          const bAttrs = b.attrs;
          const aOrder = typeof aAttrs.order !== 'undefined' ? aAttrs.order : (aAttrs.name || aAttrs.title || '');
          const bOrder = typeof bAttrs.order !== 'undefined' ? bAttrs.order : (bAttrs.name || bAttrs.title || '');

          if (aOrder === bOrder) {
            return 0;
          }

          return aOrder < bOrder ? -1 : 1;
        });
      });

      const DATE_STRING_LENGTH = 16;
      return {
        buildDate: new Date().toISOString().replace('T', ' ').substr(0, DATE_STRING_LENGTH),
        sourcesByCategory: categories
      };
    }
  }));

  docpack.use(Docpack.HOOKS.BEFORE_GENERATE, (sources, done) => {
    sources.forEach(source => {
      source.package = {
        name: pkg.name,
        version: pkg.version
      };
    });
    done(null, sources);
  });

  return docpack;
};
