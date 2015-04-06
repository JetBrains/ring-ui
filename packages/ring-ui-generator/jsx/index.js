var generators = require('yeoman-generator');

var convertToBemName = function (name) {
  return name.replace(/([\A-Z])/g, function (symbol) {
    return '-' + symbol.toLowerCase();
  });
};

module.exports = generators.Base.extend({

  writing: function () {
    this.prompt([{
      type: 'input',
      name: 'componentName',
      message: 'What\'s your component name, myComponent for example',
      default: this.appname
    }], function (answers) {
      var bemName = convertToBemName(answers.componentName);

      this.fs.copyTpl(
        this.templatePath('/component.jsx'),
        this.destinationPath(bemName + '.jsx'),
        {componentName: answers.componentName, bemName: bemName}
      );

      this.fs.copyTpl(
        this.templatePath('/component.scss'),
        this.destinationPath(bemName + '.scss'),
        {componentName: answers.componentName, bemName: bemName}
      );

    }.bind(this));
  }
});
