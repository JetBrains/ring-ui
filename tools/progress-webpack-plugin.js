/* eslint-disable no-console */
/* eslint-disable modules/no-cjs */
/* eslint-disable strict */
'use strict';

const chalk = require('chalk');

module.exports = function progressPlugin() {
  const timeMeasureMessage = chalk.blue('Compilation finished in');

  this.plugin('compile', () => {
    console.time(timeMeasureMessage);
    console.log(chalk.green('Compilation started...', (new Date()).toTimeString()));
  });

  this.plugin('done', stats => {
    if (stats.hasErrors) {
      console.error(chalk.red(stats.toJson().errors.join('\n')));
    }
    console.timeEnd(timeMeasureMessage);
  });
};
