const generateComponent = require('../generate-component');

module.exports = generateComponent({
  fileTemplates: [
    '%s.js',
    '%s.test.js',
  ]
});
