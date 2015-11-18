/* eslint-env node */
/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var chalk = require('chalk');

module.exports = function progressPlugin() {
  var timeMeasureMessage = chalk.blue('Compilation finished in');

  this.plugin('compile', function () {
    console.time(timeMeasureMessage);
    console.log(chalk.green('Compilation started...', (new Date()).toTimeString()));
  });

  this.plugin('done', function (stats) {
    if (stats.hasErrors) {
      console.error(chalk.red(stats.toJson().errors.join('\n')));
    }
    console.timeEnd(timeMeasureMessage);
  });
};
