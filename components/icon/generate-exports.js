const fs = require('fs');

const path = require('path').posix;

const glob = require('glob');
const changeCase = require('change-case');

const generate = (packageName, output, suffix = 'Icon') => {
  const dirname = path.dirname(require.resolve(path.join(packageName, 'package.json')));
  const icons = glob.sync('**/*.svg', {cwd: dirname}).
    // TODO: add deduplication instead
    filter(filename => !/apple-mask-icon\.svg$/.test(filename)).
    map(filename => ({
      importPath: path.join(packageName, filename),
      // eslint-disable-next-line no-magic-numbers
      name: changeCase.camelCase(path.basename(filename).slice(0, -4), null, true)
    }));

  let source = '';

  // Suppress the max-len check when it's known to fail
  if (packageName === '@jetbrains/icons') {
    source += '/* eslint-disable max-len */\n';
  }

  source +=
    '/* This is a generated file. If you want to change it, edit generate-exports instead. */\n\n';
  icons.forEach(({importPath, name}) => {
    source += `import ${name} from '${importPath}';\n`;
  });
  source += "\nimport {iconHOC} from './icon';\n\n";
  icons.forEach(({name}) => {
    const displayName = changeCase.pascalCase(name) + suffix;
    source += `export const ${displayName} = iconHOC(${name}, '${displayName}');\n`;
  });

  fs.writeFileSync(path.resolve(__dirname, output), source);
};

generate('@jetbrains/icons', 'icons.js');
generate('@jetbrains/logos', 'logos.js', 'Logo');
