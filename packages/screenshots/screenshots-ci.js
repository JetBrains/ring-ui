import {exec} from 'child_process';

import screenshots from './screenshots.js';

const server = exec('npm run serve');
server.stderr.on('data', error => {
  // eslint-disable-next-line no-console
  console.error(error);
});

screenshots(() => {
  server.kill();
  process.exit(0);
});
