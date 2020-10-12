const {exec} = require('child_process');

const hermione = require('./hermione');

const server = exec('yarn serve');

hermione(() => server.kill());
