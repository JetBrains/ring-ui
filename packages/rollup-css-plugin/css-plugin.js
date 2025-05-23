/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs/promises');

const cssNano = require('cssnano');
const loadPostcssConfig = require('postcss-load-config');
const postcss = require('postcss');
const postcssImport = require('postcss-import');
const postcssUrl = require('postcss-url');
const cssModules = require('postcss-modules');
const FileSystemLoader = require('postcss-modules/build/FileSystemLoader').default;
const {createFilter} = require('@rollup/pluginutils');

const {DependencyGraph} = require('./css-plugin-dependencies');

function removeDuplicatePaths(paths) {
  const seenPaths = new Set();
  return paths.filter(p => {
    if (seenPaths.has(p)) {
      return false;
    } else {
      seenPaths.add(p);
      return true;
    }
  });
}

const postcssConfigPromise = loadPostcssConfig();

module.exports = function cssPlugin(options = {}) {
  const filter = createFilter(options.include || '**/*.css', options.exclude);
  const extractPath = options.extract || 'bundle.css';
  const log = options.log || (() => {});
  const depGraph = new DependencyGraph();
  const sourcesList = [];

  const compiledCodeMap = new Map();

  return {
    name: 'css',

    async transform(code, id) {
      if (!filter(id)) {
        return null;
      }
      let plugins = [];

      const cssModulesCache = new Map();
      sourcesList.push(id);
      const postcssConfig = await postcssConfigPromise;

      async function compileIfNeeded(resolvedPath) {
        if (compiledCodeMap.has(resolvedPath)) {
          return;
        }
        const fileContent = await fs.readFile(resolvedPath, 'utf-8');
        const result = await postcss(plugins).process(fileContent, {
          from: resolvedPath,
          to: resolvedPath,
          map: false,
        });
        log('compileIfNeeded.compiled', resolvedPath);

        compiledCodeMap.set(resolvedPath, result.css);
      }

      plugins = [
        postcssImport({
          resolve: (fileId, basedir) => {
            const resolvedPath = path.resolve(basedir, fileId);
            log('postcssImport.resolve', fileId, basedir, resolvedPath);
            depGraph.addDependency(id, resolvedPath);
            return resolvedPath;
          },
          load: async filename => {
            await compileIfNeeded(filename);

            return `/* "@import" of "${path.basename(filename)}" extracted */\n`;
          },
        }),
        ...(postcssConfig.plugins || []),
        postcssUrl({
          includeUriFragment: true,
          url: 'inline',
        }),
        cssModules({
          generateScopedName(name, filename) {
            return `ring-${path.basename(filename, '.css')}-${name}`;
          },
          getJSON: (filepath, json) => {
            cssModulesCache.set(filepath, json);
          },
          // Override Loader to prevent css-modules from inlining content of imported files for @value bar form '../foo.css' syntax
          // See https://github.com/madyankin/postcss-modules/blob/bd64c71ddfd81b615104b0727ce9a623da0eaef6/src/FileSystemLoader.js#L68
          Loader: class CustomLoader extends FileSystemLoader {
            async fetch(file, relativeTo, _trace) {
              const res = await super.fetch(file, relativeTo, _trace);
              const normalizedFile = file.replace(/^["']|["']$/g, '');
              const resolvedPath = path.join(path.dirname(relativeTo), normalizedFile);

              await compileIfNeeded(resolvedPath);
              depGraph.addDependency(id, resolvedPath);

              this.sources[resolvedPath] = `/* "@value" import of "${path.basename(resolvedPath)}" extracted */\n`;

              return res;
            }
          },
          resolve: async (file, importer) => {
            const resolvedPath = path.resolve(path.dirname(importer), file);
            log('cssModules.resolve', file, importer, resolvedPath);
            await compileIfNeeded(resolvedPath);
            depGraph.addDependency(id, resolvedPath);
            return resolvedPath;
          },
        }),
      ];

      const result = await postcss(plugins).process(code, {
        from: id,
        to: id,
        map: false,
      });
      log('source.compiled', id);

      compiledCodeMap.set(id, result.css);

      return {
        code: `export default ${JSON.stringify(cssModulesCache.get(id))};`,
        map: result.map,
        moduleSideEffects: 'no-treeshake',
      };
    },

    async generateBundle() {
      const orderedFiles = removeDuplicatePaths([...depGraph.topologicalSort(), ...sourcesList]);

      const sources = orderedFiles
        .map(filePath => {
          if (!compiledCodeMap.has(filePath)) {
            throw new Error(`No compiled code for ${filePath}`);
          }
          return `/* ${path.basename(filePath)} */\n${compiledCodeMap.get(filePath)}`;
        })
        .filter(Boolean);

      let combinedCSS = sources.join('\n');

      if (options.minimize) {
        log('Minimizing...');
        const result = await postcss(cssNano()).process(combinedCSS, {
          from: extractPath,
          to: extractPath,
          map: false,
        });
        log('Done minimizing');
        combinedCSS = result.css;
      }

      this.emitFile({
        type: 'asset',
        fileName: extractPath,
        source: combinedCSS,
      });
    },
  };
};
