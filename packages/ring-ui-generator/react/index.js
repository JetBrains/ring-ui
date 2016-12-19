const generateComponent = require('../generate-component');

module.exports = generateComponent({
  fileTemplates: [
    '%s.js',
    '%s.css',
    '%s.gemini.js',
    '%s.test.js'
  ]
});
