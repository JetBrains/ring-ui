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

module.exports = function (params) {
  var publicPath = params.publicPath;

  return [
    new DocsPlugin(),

    new MarkdownExtractorPlugin(),
    new SourceLastModifiedPlugin(),
    new SourcePackageInfoPlugin(),
    new ExampleCompilerPlugin({
      filenamePrefix: path.resolve(__dirname, 'components') + '/'
    }),

    new ExamplePagePlugin({
      template: path.resolve(__dirname, 'site/example.twig'),
      context: {
        publicPath: publicPath
      }
    }),

    new PagePlugin({
      template: path.resolve(__dirname, 'site/page.twig'),
      filename: '[name].html',
      context: {
        publicPath: publicPath
      }
    }),

    {
      apply: function (compiler) {
        compiler.plugin('compilation', function (compilation) {

          compilation.plugin(DocsPlugin.HOOKS.FILTER_EXTRACTED_RESULTS, function (results, done) {
            var filtered = results.filter(function (result) {
              if (/\.(js|scss)$/.test(result.source.path)) {
                var examples = find(result, function (item) {
                  return item instanceof Example;
                });
                return examples.length > 0;
              } else {
                return true;
              }
            });

            done(null, filtered);
          });

          //compilation.plugin(DocsPlugin.HOOKS.EMIT_RESULTS, function (context, done) {
          //  var pages = context.plugin.docs;
          //  var toc = pages.map(function (page) {
          //    var serialized = page.serialize();
          //    return {
          //      id: serialized.path,
          //      url: publicPath + serialized.path,
          //      title: serialized.name || serialized.title || serialized.source.path,
          //      category: serialized.category || serialized.collection
          //    };
          //  });
          //  emitFile(this, 'toc.json', JSON.stringify(toc, null, 2));
          //
          //  done();
          //});
        });
      }
    }
  ];
};
