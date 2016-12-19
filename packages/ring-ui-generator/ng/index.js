const generateComponent = require('../generate-component');
const green = require('chalk').green;

module.exports = generateComponent({
  fileTemplates: [
    '%s.html',
    '%s.js',
    '%s.css',
    '%s.test.js'
  ],
  promptMessage: `What's your component name is any case, ${green('my component')} for example. Ng suffix will be added automatically.`,
  type: 'angular'
});
