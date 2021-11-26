const generateComponent = require('../generate-component');

module.exports = generateComponent({
  fileTemplates: [
    '%s.html',
    '%s.js',
    '%s.css',
    '%s.test.js'
  ],
  promptMessage: import('chalk').then(({default: chalk}) => `What's your component name is any case, ${chalk.green('my component')} for example. Ng suffix will be added automatically.`),
  type: 'angular'
});
