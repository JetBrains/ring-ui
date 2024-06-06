const {exec} = require('child_process');

const screenshots = require('./screenshots');

const server = exec('npm run serve');
server.stderr.on('data', error => {
  // eslint-disable-next-line no-console
  console.error(error);
});

screenshots(() => {
  server.kill();
  process.exit(0);
});
