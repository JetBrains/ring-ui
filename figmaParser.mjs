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

const figmaNodes = {
  avatar: '5990-522',
  button: '9954-528',
};

process.stdin.on('end', () => {
  ended = true;
  const parsed = JSON.parse(data);
  const result = {
    docs: parsed.paths.map(file => {
      const name = path.basename(file, '.figma.js');
      return {
        figmaNode: `https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI?node-id=${figmaNodes[name]}`,
        component: pascalCase(name),
        template: fs.readFileSync(file, 'utf8'),
        source: file,
        sourceLocation: {line: 0},
        templateData: {props: {}},
        language: 'tsx',
        label: 'React',
      };
    }),
    messages: [
      {level: 'DEBUG', message: 'Debug message from parser!'},
      {level: 'INFO', message: 'Success from parser!'},
    ],
  };

  process.stdout.write(JSON.stringify(result));
});
