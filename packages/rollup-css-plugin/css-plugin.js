/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');

const cssNano = require('cssnano');
const loadPostcssConfig = require('postcss-load-config');
const postcss = require('postcss');
const postcssImport = require('postcss-import');
const cssModules = require('postcss-modules');
const {createFilter} = require('@rollup/pluginutils');

const {DependencyGraph} = require('./css-plugin-dependencies');

function getHash(input) {
  const HASH_LEN = 4;
  const hash = crypto.createHash('md5').update(input).digest('hex');
  return hash.substr(0, HASH_LEN);
}

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
      if (!filter(id)) return null;

      const cssModulesCache = new Map();
      sourcesList.push(id);
      const postcssConfig = loadPostcssConfig();

      const plugins = [
        postcssImport({
          resolve: (fileId, basedir) => {
            const resolvedPath = path.resolve(basedir, fileId);
            log('postcssImport.resolve', fileId, basedir, resolvedPath);
            depGraph.addDependency(id, resolvedPath);
            return resolvedPath;
          },
          load: async filename => {
            if (!compiledCodeMap.has(filename)) {
              const fileContent = await fs.readFile(filename, 'utf-8');
              const result = await postcss(plugins).process(fileContent, {
                from: filename,
                to: filename,
                map: {inline: false, annotation: false},
              });
              log('postcssImport.compiled', filename);
              compiledCodeMap.set(filename, result.css);
            }

            return `/* Import of "${path.basename(filename)}" extracted */\n`;
          },
        }),
        ...(postcssConfig.plugins || []),
      ];

      plugins.push(
        cssModules({
          generateScopedName(name, filename) {
            return `${name}_rui_${getHash(filename)}`;
          },
          getJSON: (filepath, json) => {
            cssModulesCache.set(filepath, json);
          },
          resolve: async (file, importer) => {
            const resolvedPath = path.resolve(path.dirname(importer), file);
            log('cssModules.resolve', file, importer, resolvedPath);
            if (!compiledCodeMap.has(resolvedPath)) {
              const fileContent = await fs.readFile(resolvedPath, 'utf-8');
              const result = await postcss(plugins).process(fileContent, {
                from: resolvedPath,
                to: resolvedPath,
                map: false,
              });
              log('cssModules.compiled', resolvedPath);
              compiledCodeMap.set(resolvedPath, result.css);
            }
            depGraph.addDependency(id, resolvedPath);
            return resolvedPath;
          },
        }),
      );

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
