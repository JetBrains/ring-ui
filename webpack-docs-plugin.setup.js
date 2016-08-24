/* eslint-env node */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */
/* eslint-disable camelcase */

var path = require('path');

var DocsPlugin = require('webpack-docs-plugin');
var find = require('webpack-docs-plugin/lib/utils/find');
var Example = require('webpack-docs-plugin/lib/data/Example');
var ExampleCompilerPlugin = require('webpack-docs-plugin/lib/plugins/ExampleCompilerPlugin');
var PagePlugin = require('webpack-docs-plugin/lib/plugins/PagePlugin');
var ExamplePagePlugin = require('webpack-docs-plugin/lib/plugins/ExamplePagePlugin');
var SourceLastModifiedPlugin = require('webpack-docs-plugin/lib/plugins/SourceLastModifiedPlugin');
var SourcePackageInfoPlugin = require('webpack-docs-plugin/lib/plugins/SourcePackageInfoPlugin');
var MarkdownExtractorPlugin = require('webpack-docs-plugin/lib/plugins/MarkdownExtractorPlugin');
var JsDocExtractorPlugin = require('webpack-docs-plugin/lib/plugins/JsDocExtractorPlugin');

module.exports = params => {
  var publicPath = params.publicPath;

  return [
    new DocsPlugin(),

    new MarkdownExtractorPlugin(),
    new JsDocExtractorPlugin(),

    new SourceLastModifiedPlugin(),
    new SourcePackageInfoPlugin(),

    new ExampleCompilerPlugin({
      filenamePrefix: `${path.resolve(__dirname, 'components')}/`
    }),

    new ExamplePagePlugin({
      template: path.resolve(__dirname, 'site/example.twig'),
      filename: 'example-[example-name]/index.html',
      context: {
        publicPath
      }
    }),

    new PagePlugin({
      template: path.resolve(__dirname, 'site/page.twig'),
      filename: '[name].html',
      context: {
        publicPath,
        pagesByCategory: sources => {
          var categories = {Docs: []};
          var defaultCategory = 'Components';

          sources.forEach(page => {
            var p = page.serialize();
            var category = (p.category || defaultCategory);
            if (!Array.isArray(categories[category])) {
              categories[category] = [];
            }

            categories[category].push(p);
          });

          Object.keys(categories).forEach(category => {
            categories[category].sort((a, b) => {
              const aOrder = typeof a.order !== 'undefined' ? a.order : (a.name || a.title || '');
              const bOrder = typeof b.order !== 'undefined' ? b.order : (b.name || b.title || '');

              if (aOrder === bOrder) {
                return 0;
              }

              return aOrder < bOrder ? -1 : 1;
            });
          });

          return categories;
        }
      }
    }),

    {
      apply(compiler) {
        compiler.plugin('compilation', compilation => {

          compilation.plugin(DocsPlugin.HOOKS.FILTER_EXTRACTED_RESULTS, (results, done) => {
            var filtered = results.filter(result => {
              if (/\.(js|scss)$/.test(result.source.path)) {
                const examples = find(result, item => item instanceof Example);
                return examples.length > 0;
              } else {
                return true;
              }
            });

            done(null, filtered);
          });
        });
      }
    }
  ];
};
