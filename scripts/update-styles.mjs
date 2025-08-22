/* eslint-disable no-magic-numbers */
import fs from 'fs';
import path from 'path';

import {fileURLToPath} from 'node:url';

import tokens from '../design-tokens/design-tokens.json' with {type: 'json'};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://stackoverflow.com/a/5624139
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

for (const {mode, color} of tokens[0].values) {
  const filename = `src/global/variables${mode.name === 'Dark' ? '_dark' : ''}.css`;
  const source = fs.readFileSync(path.resolve(__dirname, `../${filename}`), 'utf-8');
  let result = source;
  const newStyles = [];
  for (const {name, value} of color) {
    if (/^ring-.*-color$/.test(name)) {
      const components = name.replace('-color', '-components');
      const {r, g, b} = hexToRgb(value);
      if (!source.includes(`--${name}:`)) {
        newStyles.push(`  --${components}: ${r}, ${g}, ${b};`);
        newStyles.push(`  --${name}: rgb(var(--${components})); /* ${value.toUpperCase()} */`);
      } else {
        result = result
          .replace(new RegExp(`--${components}: .+;`), `--${components}: ${r}, ${g}, ${b};`)
          .replace(new RegExp(`(--${name}: .+;) /\\* .+? \\*/`), `$1 /* ${value.toUpperCase()} */`);
      }
    }
  }
  if (result !== source) {
    fs.writeFileSync(path.resolve(__dirname, `../${filename}`), result);
  }
  if (newStyles.length > 0) {
    // eslint-disable-next-line no-console
    console.log(`New variables detected. Please add them to ${filename}:\n${newStyles.join('\n')}`);
  }
}
