const {exec} = require('child_process');

const hermione = require('./hermione');

const server = exec('npm run serve');
server.stderr.on('data', error => {
  // eslint-disable-next-line no-console
  console.error(error);
});

hermione(() => {
  server.kill();
  process.exit(0);
});
