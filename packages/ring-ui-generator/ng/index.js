var generators = require('yeoman-generator');

var convertToBemName = function (name) {
  return name.replace(/-./g, function (symbol) {
    return symbol.replace('-', '').toUpperCase();
  });
};

module.exports = generators.Base.extend({

  writing: function () {
    this.prompt([{
      type: 'input',
      name: 'componentName',
      message: 'What\'s your component name, my-component for example',
      default: this.appname
    }], function (answers) {
      var bemName = convertToBemName(answers.componentName);

      this.fs.copyTpl(
        this.templatePath('/component-ng.js'),
        this.destinationPath(answers.componentName + '-ng.js'),
        {componentName: answers.componentName, bemName: bemName}
      );

      this.fs.copyTpl(
        this.templatePath('/component-ng.scss'),
        this.destinationPath(answers.componentName + '-ng.scss'),
        {componentName: answers.componentName, bemName: bemName}
      );

      this.fs.copyTpl(
        this.templatePath('/component-ng.test.js'),
        this.destinationPath(answers.componentName + '-ng.test.js'),
        {componentName: answers.componentName, bemName: bemName}
      );

    }.bind(this));
  }
});
