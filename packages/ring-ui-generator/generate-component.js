const generators = require('yeoman-generator');
const green = require('chalk').green;
const format = require('util').format;
const join = require('path').join;

const convertToCamelCase = function (name) {
  return name.replace(/-./g, function (symbol) {
    return symbol.replace('-', '').toUpperCase();
  });
};

module.exports = function (fileTemplates, exampleName) {
  return generators.Base.extend({
    writing: function () {
      this.prompt([{
        type: 'input',
        name: 'componentName',
        message: 'What\'s your component name, ' + green(exampleName || 'my-component') + ' for example',
        default: this.appname.replace(/\s+/g, '-').toLowerCase()
      }]).then(answers => {
        const componentName = answers.componentName;
        const bemName = convertToCamelCase(componentName);

        fileTemplates.forEach(template => {
          this.fs.copyTpl(
            this.templatePath(format(template, 'component')),
            this.destinationPath(join(componentName, format(template, componentName))),
            {componentName, bemName}
          );
        });
      });
    }
  });
};
