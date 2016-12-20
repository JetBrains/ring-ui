const generateComponent = require('../generate-component');

module.exports = generateComponent({
  fileTemplates: [
    '%s.js',
    '%s.css',
    {
      template: '%s.gemini.js',
      ringUI: true
    },
    '%s.test.js'
  ]
});
