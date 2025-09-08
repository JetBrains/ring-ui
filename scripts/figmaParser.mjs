import path from 'node:path';
import fs from 'node:fs';

import {pascalCase} from 'change-case';

let data = '';
let ended = false;

process.stdin.on('data', chunk => {
  if (!ended) {
    data += chunk;
  }
});

process.stdin.on('end', () => {
  ended = true;
  const parsed = JSON.parse(data);
  const result = {
    docs: parsed.paths.map(file => {
      const name = path.basename(file, '.figma.js');
      const fileContent = fs.readFileSync(file, 'utf-8');
      const [firstLine, ...templateLines] = fileContent.split('\n');
      const figmaNodeUrl = firstLine.replace(/\/\/\s*url=/, '').trim();
      const template = templateLines.join('\n');

      return {
        figmaNode: figmaNodeUrl,
        component: pascalCase(name),
        template,
        source: file,
        sourceLocation: {line: -1},
        templateData: {nestable: true, props: {}},
        language: 'tsx',
        label: 'React',
      };
    }),
    messages: [],
  };

  process.stdout.write(JSON.stringify(result));
});
